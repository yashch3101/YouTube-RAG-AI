"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Sidebar from "@/components/Sidebar";

import {
  Loader2,
  PlaySquare,
  Copy,
  Sparkles,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import { motion } from "framer-motion";

export default function Home() {

  const [videoUrl, setVideoUrl] =
    useState("");

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);
  type Message = {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
  };

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [chatHistory, setChatHistory] =
    useState<string[]>([]);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Summarize the video",
    "Key insights",
    "Important topics discussed",
    "Main conclusion",
  ];

     const getEmbedUrl = (url: string) => {
      const regExp =
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;

      const match = url.match(regExp);

      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }

      return "";
    };

const askQuestion = async (
  customQuestion?: string
) => {

  const finalQuestion =
    customQuestion || question;

  if (!videoUrl || !finalQuestion)
    return;

  try {

    setLoading(true);

    const userMessage: Message = {
      role: "user",
      content: finalQuestion,
    };

    setChatHistory((prev) => [
      finalQuestion,
      ...prev,
    ]);

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        role: "assistant" as const,
        content: "",
      },
    ]);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stream-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          video_url: videoUrl,
          question: finalQuestion,
        }),
      }
    );

    const reader =
      response.body?.getReader();

    const decoder =
      new TextDecoder();

    let streamedText = "";

    while (true) {

      const { done, value } =
        await reader!.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      streamedText += chunk;

      setMessages((prev) => {

        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "assistant" as const,
          content: streamedText,
        };

        return updated;
      });
    }

    setQuestion("");

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }
};

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);

  return (

    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">

      <div className="flex min-h-screen">

        {/* Sidebar */}

        <Sidebar chats={chatHistory} />

        <div className="flex-1">

          {/* Navbar */}

          <div className="border-b border-zinc-800 backdrop-blur-xl bg-black/40 sticky top-0 z-50">

            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

              <div>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">

                  YouTube RAG AI

                </h1>

                <p className="text-sm text-zinc-400">

                  Advanced AI Video Assistant

                </p>

              </div>

              <div className="hidden md:flex items-center gap-2 text-zinc-400">

                <Sparkles size={18} />

                <span className="text-sm">
                  Advanced RAG
                </span>

              </div>

            </div>

          </div>

          {/* Main */}

          <div className="w-full max-w-5xl mx-auto p-4 md:p-6">

            {/* Input Section */}

            <div className="space-y-5">

              {/* URL Input */}

              <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl px-4 h-14">

                <PlaySquare className="text-red-500" />

                <Input
                  placeholder="Paste YouTube URL..."
                  value={videoUrl}
                  onChange={(e) =>
                    setVideoUrl(e.target.value)
                  }
                  className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                />

              </div>

              {/* Embedded Player */}

              {videoUrl && (

                <div className="mt-6 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">

                  <iframe
                    id="youtube-player"
                    width="100%"
                    height="400"
                    src={getEmbedUrl(videoUrl)}
                    title="YouTube video"
                    allowFullScreen
                  />

                </div>

              )}

              {/* Question */}

              <div className="flex gap-3">

                <Input
                  placeholder="Ask anything about the video..."
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      askQuestion();
                    }
                  }}
                  className="bg-zinc-900/70 border-zinc-700 rounded-2xl h-14 text-base"
                />

                <Button
                  className="rounded-2xl px-6 h-14 bg-red-600 hover:bg-red-700"
                  onClick={() =>
                    askQuestion()
                  }
                  disabled={loading}
                >

                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Ask"
                  )}

                </Button>

              </div>

              {/* Suggested Questions */}

              <div className="flex flex-wrap gap-3 mt-5">

                {suggestedPrompts.map(
                  (item, index) => (

                    <button
                      key={index}
                      onClick={() =>
                        setQuestion(item)
                      }
                      className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-sm transition"
                    >

                      {item}

                    </button>

                  )
                )}

              </div>

            </div>

            {/* Empty State */}

            {messages.length === 0 && (

              <div className="flex flex-col items-center justify-center py-24 text-center">

                <h2 className="text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-red-500 to-zinc-500 bg-clip-text text-transparent">

                  Chat With Any
                  <br />
                  YouTube Video

                </h2>

                <p className="text-zinc-400 max-w-2xl text-lg">

                  Paste any YouTube video and chat with it using Advanced RAG AI.

                </p>

              </div>

            )}

            {/* Chat */}

            <div className="mt-10 space-y-6">

              {/* Loader */}

              {loading && (

                <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900/50">

                  <div className="flex items-center gap-2">

                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" />

                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-100" />

                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce delay-200" />

                  </div>

                </div>

              )}

              {messages.map((msg, index) => (

                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className={`p-6 rounded-3xl border border-zinc-800 shadow-xl backdrop-blur-xl transition-all ${
                    msg.role === "user"
                      ? "bg-zinc-900/80"
                      : "bg-zinc-800/60"
                  }`}
                >

                  {/* Header */}

                  <div className="flex items-center justify-between mb-4">

                    <p className="text-sm text-zinc-400">

                      {msg.role === "user"
                        ? "You"
                        : "AI Assistant"}

                    </p>

                    {msg.role === "assistant" && (

                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            msg.content
                          )
                        }
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
                      >

                        <Copy size={16} />

                        Copy Response

                      </button>

                    )}

                  </div>

                  {/* Message */}

                  <div className="prose prose-invert max-w-none">

                    <ReactMarkdown
                          components={{
                            text(props) {

                              const text =
                                props.children?.toString() || "";

                              const regex =
                                /\[(\d+\.\d+)s\]/g;

                              const parts =
                                text.split(regex);

                              return (

                                <>
                                  {parts.map(
                                    (part, index) => {

                                      const isTimestamp =
                                        !isNaN(
                                          Number(part)
                                        );

                                      if (isTimestamp) {

                                        const seconds =
                                          Number(part);

                                        return (

                                          <button
                                            key={index}
                                            onClick={() => {

                                              const iframe =
                                                document.getElementById(
                                                  "youtube-player"
                                                ) as HTMLIFrameElement;

                                              if (iframe) {

                                                iframe.src =
                                                  iframe.src.split("?")[0] +
                                                  `?start=${Math.floor(
                                                    seconds
                                                  )}&autoplay=1`;
                                              }
                                            }}
                                            className="text-red-400 hover:text-red-300 underline mx-1"
                                          >

                                            [{part}s]

                                          </button>

                                        );
                                      }

                                      return part;
                                    }
                                  )}
                                </>

                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>

                  </div>

                  {/* Sources */}

                  {msg.sources && (

                    <div className="mt-8">

                      <h3 className="font-semibold mb-4">

                        Sources

                      </h3>

                      <div className="space-y-4">

                        {msg.sources.map(
                          (
                            source: string,
                            i: number
                          ) => (

                            <div
                              key={i}
                              className="bg-black/40 border border-zinc-800 p-4 rounded-2xl text-sm text-zinc-300 leading-7 hover:bg-zinc-900 transition-all"
                            >

                              {source.slice(
                                0,
                                300
                              )}...

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                </motion.div>

              ))}

              <div ref={bottomRef} />

            </div>

          </div>

        </div>

      </div>

    </main>

  );
}