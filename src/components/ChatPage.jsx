import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { askDoubt, getDoubtHistory } from "../api/doubt.api";

const MODES = [
  { id: "chat", label: "Chat" },
  { id: "teacher", label: "Teacher" },
  { id: "notes", label: "Notes" },
];

function getLoadingText(question) {
  const hasHindi = /[\u0900-\u097F]/.test(question);
  return hasHindi ? "ShikshaGPT soch raha hai" : "ShikshaGPT is thinking";
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Hi! Main ShikshaGPT hoon. Kis topic mein doubt hai?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("ShikshaGPT is thinking");
  const [mode, setMode] = useState("chat");

  // Saved doubts (from MongoDB)
  const [showSaved, setShowSaved] = useState(false);
  const [savedDoubts, setSavedDoubts] = useState([]);
  const [savedError, setSavedError] = useState("");

  const bottomRef = useRef(null);

  const handleSend = async (text) => {
    const userMessage = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setLoadingText(getLoadingText(text));
    setIsLoading(true);

    const recentHistory = messages.slice(1).slice(-4); // skip greeting, last 2 exchanges
    const result = await askDoubt(text, mode, recentHistory);

    setIsLoading(false);

    if (result.success) {
      const aiMessage = { id: Date.now() + 1, sender: "ai", text: result.answer };
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

  const handleToggleSaved = async () => {
    if (!showSaved) {
      const result = await getDoubtHistory();
      if (result.success) {
        setSavedDoubts(result.history);
        setSavedError("");
      } else {
        setSavedError(result.error);
      }
    }
    setShowSaved((prev) => !prev);
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

      {/* Mode toggle + History button */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2 sm:px-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
              mode === m.id
                ? "bg-[#F5C518] text-black"
                : "border border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}

        <button
          onClick={handleToggleSaved}
          className={`ml-auto rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
            showSaved
              ? "bg-zinc-700 text-white"
              : "border border-zinc-700 text-zinc-400 hover:text-white"
          }`}
        >
          📜 History
        </button>
      </div>

      {/* Saved doubts panel */}
      {showSaved && (
        <div className="max-h-56 overflow-y-auto border-b border-zinc-800 bg-zinc-950 px-3 py-2 sm:px-4">
          {savedError ? (
            <p className="text-xs text-red-400">{savedError}</p>
          ) : savedDoubts.length === 0 ? (
            <p className="text-xs text-zinc-500">Abhi tak koi doubt save nahi hua.</p>
          ) : (
            savedDoubts.map((item) => (
              <div key={item._id} className="mb-2 border-b border-zinc-800 pb-2 last:border-none">
                <p className="text-xs font-semibold text-[#F5C518]">{item.question}</p>
                <p className="line-clamp-2 text-xs text-zinc-400">{item.answer}</p>
                <p className="mt-0.5 text-[10px] text-zinc-600">
                  {item.mode} · {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

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
              {loadingText}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}