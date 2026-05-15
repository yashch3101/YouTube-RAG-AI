import os
import re

import yt_dlp
import requests
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from langchain_groq import ChatGroq

from langchain_core.prompts import PromptTemplate

from langchain_community.retrievers import BM25Retriever
from langchain_classic.retrievers import EnsembleRetriever

from sentence_transformers import CrossEncoder

from dotenv import load_dotenv

video_cache = {}
load_dotenv()

# LLM
llm = ChatGroq(
    model_name="llama-3.1-8b-instant",
    temperature=0.2,
    groq_api_key=os.getenv("GROQ_API_KEY")
)

# Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Re-ranker
reranker = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2"
)

# Prompt
prompt = PromptTemplate(
    template="""
You are a highly intelligent AI assistant.

Your task is to answer questions using ONLY the provided YouTube transcript context.

Rules:
- Give detailed and human-like answers.
- Use natural language.
- If partial information exists, still answer intelligently.
- Mention timestamps if available.
- Do NOT say "I could not find this" unless absolutely nothing relevant exists.
- Summarize retrieved context properly.

Context:
{context}

Question:
{question}

Helpful Answer:
""",
    input_variables=["context", "question"]
)

def extract_video_id(url: str):
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)

    if match:
        return match.group(1)

    return url

def get_transcript(video_url: str):

    ydl_opts = {
        "quiet": True,
        "skip_download": True,
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["en"],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:

        info = ydl.extract_info(
            video_url,
            download=False
        )

        subtitles = (
            info.get("automatic_captions")
            or info.get("subtitles")
        )

        if not subtitles:
            return ""

        en_subs = subtitles.get("en")

        if not en_subs:
            return ""

        subtitle_url = en_subs[0]["url"]

        response = requests.get(subtitle_url)

        return response.text


def build_rag(video_url: str):

    if video_url in video_cache:
        return video_cache[video_url]

    transcript = get_transcript(video_url)

    # Chunking
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=100
    )

    chunks = splitter.create_documents([transcript])

    # Vector Store
    vector_store = FAISS.from_documents(
        chunks,
        embeddings
    )

    # BM25
    bm25_retriever = BM25Retriever.from_documents(chunks)
    bm25_retriever.k = 3

    # Vector Retriever
    vector_retriever = vector_store.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 6}
    )

    # Hybrid Search
    hybrid_retriever = EnsembleRetriever(
        retrievers=[
            bm25_retriever,
            vector_retriever
        ],
        weights=[0.5, 0.5]
    )

    video_cache[video_url] = hybrid_retriever

    return hybrid_retriever


def ask_question(video_url: str, question: str):

    retriever = build_rag(video_url)

    retrieved_docs = retriever.invoke(question)

    # Re-ranking
    pairs = [
        [question, doc.page_content]
        for doc in retrieved_docs
    ]

    scores = reranker.predict(pairs)

    ranked_docs = sorted(
        zip(scores, retrieved_docs),
        reverse=True,
        key=lambda x: x[0]
    )

    final_docs = [
        doc for _, doc in ranked_docs[:3]
    ]

    context = "\n\n".join(
        doc.page_content for doc in final_docs
    )

    final_prompt = prompt.format(
        context=context,
        question=question
    )

    response = llm.invoke(final_prompt)

    return {
        "answer": response.content,
        "sources": list(
            set([
                doc.page_content[:250] + "..."
                for doc in final_docs
            ])
        )
    }