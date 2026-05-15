from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio

from pydantic import BaseModel

from rag.pipeline import ask_question
from db import db

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    video_url: str
    question: str

@app.get("/")
def home():
    return {"message": "Advanced RAG Backend Running"}

@app.post("/chat")
async def chat(data: ChatRequest):

    response = ask_question(
        data.video_url,
        data.question
    )

    await db.chats.insert_one({
        "video_url": data.video_url,
        "question": data.question,
        "answer": response["answer"]
    })

    return response

@app.post("/stream-chat")
async def stream_chat(data: ChatRequest):

    response = ask_question(
        data.video_url,
        data.question
    )

    async def generate():

        text = response["answer"]

        for word in text.split():

            yield word + " "

            await asyncio.sleep(0.03)

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )

@app.get("/chat-history")
async def chat_history():

    chats = []

    async for chat in db.chats.find().sort(
        "_id",
        -1
    ):

        chat["_id"] = str(chat["_id"])

        chats.append(chat)

    return chats