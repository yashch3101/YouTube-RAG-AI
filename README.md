# YouTube RAG AI

An Advanced Retrieval-Augmented Generation (RAG) application that enables users to interact with YouTube videos using natural language. The application extracts video transcripts, builds a semantic knowledge base, retrieves the most relevant context using hybrid retrieval techniques, and generates accurate responses powered by Large Language Models.

The project demonstrates modern Generative AI engineering practices by combining LangChain, FastAPI, Next.js, FAISS, BM25, HuggingFace Embeddings, and Groq LLM into a production-style full-stack application.

---

## Features

### AI-Powered Video Chat
- Chat with any YouTube video using natural language.
- Automatic transcript extraction from YouTube.
- Context-aware responses generated using Retrieval-Augmented Generation (RAG).

### Advanced Retrieval Pipeline
- Semantic search using FAISS Vector Store.
- Keyword search using BM25 Retriever.
- Hybrid Retrieval (FAISS + BM25).
- Cross-Encoder Re-ranking for improved retrieval quality.
- Timestamp-aware transcript indexing.
- Cached retrieval pipeline for faster subsequent queries.

### Intelligent Response Generation
- Groq LLM integration for low-latency inference.
- Context-grounded answers.
- Hallucination reduction using prompt engineering.
- Transcript-based response generation.

### Modern User Interface
- ChatGPT-inspired interface built with Next.js.
- Embedded YouTube video player.
- Real-time streaming responses.
- Auto-scrolling chat.
- Markdown rendering.
- Copy response functionality.
- Suggested questions.
- Responsive design.
- Dark theme UI.
- Sidebar chat history.

---

## Architecture

```
                    +--------------------+
                    |   Next.js Frontend |
                    +---------+----------+
                              |
                              |
                     REST API / Streaming
                              |
                              v
                    +--------------------+
                    |    FastAPI Backend |
                    +---------+----------+
                              |
                              |
                     RAG Processing Layer
                              |
     -------------------------------------------------
     |                 |               |              |
 Transcript      Text Splitting    Embeddings     Retrieval
 Extraction                        Generation
     |                                 |
     |                                 |
     -----------------+-----------------
                      |
               FAISS Vector Store
                      |
             Hybrid Retrieval (FAISS + BM25)
                      |
             Cross-Encoder Re-ranking
                      |
                 Prompt Engineering
                      |
                 Groq LLM Inference
                      |
                Final AI Response
```

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- React Markdown
- Axios
- Lucide React

### Backend

- FastAPI
- LangChain
- Groq API
- HuggingFace Embeddings
- FAISS
- BM25 Retriever
- Sentence Transformers
- Cross Encoder Re-ranking
- YouTube Transcript API
- Python

### Database

- MongoDB Atlas

### AI / Machine Learning

- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Hybrid Search
- Vector Embeddings
- Prompt Engineering
- Context Grounding
- Re-ranking
- LLM Inference

---

## Project Structure

```
youtube-rag-ai/

├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── lib/
│   │   └── styles/
│   └── package.json
│
├── backend/
│   ├── rag/
│   │   ├── pipeline.py
│   │   ├── prompts.py
│   │   └── utils.py
|   |   |__ retriever.py
|
│   ├── app.py
│   ├── db.py
│   └── requirements.txt
│
└── README.md
```

---

## RAG Pipeline

### 1. Transcript Extraction

The application extracts transcripts directly from YouTube videos using the YouTube Transcript API.

---

### 2. Text Chunking

Long transcripts are split into overlapping chunks using LangChain's Recursive Character Text Splitter.

---

### 3. Embedding Generation

Chunks are converted into dense vector embeddings using HuggingFace Sentence Transformers.

---

### 4. Vector Storage

Embeddings are indexed inside a FAISS Vector Database for efficient semantic retrieval.

---

### 5. Hybrid Retrieval

The application combines:

- Semantic Search (FAISS)
- Keyword Search (BM25)

to retrieve highly relevant context.

---

### 6. Re-ranking

Retrieved documents are re-ranked using a Cross Encoder model to improve retrieval accuracy before passing context to the language model.

---

### 7. Prompt Engineering

A custom prompt ensures:

- Context-grounded answers
- Reduced hallucinations
- Transcript-only responses
- Better formatting

---

### 8. Response Generation

The Groq LLM generates the final answer using the retrieved context.

---

## API Endpoints

### Chat

```
POST /chat
```

Request

```json
{
  "video_url": "https://youtube.com/...",
  "question": "What is the main topic?"
}
```

---

### Streaming Chat

```
POST /stream-chat
```

Streams the response token-by-token for a ChatGPT-like experience.

---

## Frontend Features

- Embedded YouTube Player
- Chat Interface
- Streaming Responses
- Auto Scroll
- Sidebar Chat History
- Suggested Questions
- Markdown Rendering
- Copy Response
- Responsive Design
- Dark Theme

---

## Performance Optimizations

- Retrieval pipeline caching
- Hybrid Retrieval
- FAISS indexing
- Streaming responses
- Optimized prompt templates
- Reduced hallucinations
- Cached transcript processing

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yashch3101/YouTube-RAG-AI
```

---

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app:app --reload
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

Backend

```
GROQ_API_KEY=YOUR_GROQ_API_KEY
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
```

Frontend

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## Future Improvements

- User Authentication
- Multi-Video Knowledge Base
- Persistent Chat History
- PDF Export
- Voice-Based Interaction
- Multi-Language Support
- Cloud Vector Database Integration
- Conversation Memory
- Role-Based Access
- Production Deployment
- Analytics Dashboard

---

## Learning Outcomes

This project demonstrates practical implementation of:

- Retrieval-Augmented Generation (RAG)
- LangChain
- FastAPI
- Next.js
- Prompt Engineering
- Vector Databases
- Semantic Search
- Hybrid Retrieval
- Cross Encoder Re-ranking
- Streaming LLM Responses
- Full Stack AI Development
- Production-style GenAI Architecture

---

## License

This project is intended for educational purposes and portfolio demonstration.