import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { askDoubt } from "../api/doubt.api";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Hi! Main ShikshaGPT hoon. Kis topic mein doubt hai?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef(null);

  const handleSend = async (text) => {
    const userMessage = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const result = await askDoubt(text);

    setIsLoading(false);

    if (result.success) {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: result.answer,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } else {
      const errorMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: `⚠️ ${result.error}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-3 py-2.5 sm:px-4 sm:py-3">
        <Link
          to="/"
          className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-[#F5C518] hover:text-[#F5C518] sm:px-3 sm:text-sm"
        >
          ← Home
        </Link>
        <h1 className="text-base font-bold text-[#F5C518] sm:text-lg">ShikshaGPT Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} sender={msg.sender} text={msg.text} />
        ))}

        {isLoading && (
          <div className="flex w-full justify-start mb-3">
            <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-bl-sm text-sm bg-zinc-800 border border-zinc-700 text-zinc-400 sm:px-4">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.15s]">.</span>
                <span className="animate-bounce [animation-delay:0.3s]">.</span>
              </span>{" "}
              ShikshaGPT soch raha hai
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}