import { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const PLACEHOLDER_REPLIES = [
  "Achha sawaal hai! Yeh feature abhi build ho raha hai — real AI reply backend wire hone ke baad live hoga.",
  "Samajh gaya tumhara doubt. Abhi main sirf demo mode mein hoon — asli jawab jaldi aayega!",
  "Is topic pe detailed help jald milegi — AI engine abhi backend mein connect ho raha hai.",
  "Good question! Filhaal main practice mode mein hoon, real answers jald available honge.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Hi! Main ShikshaGPT hoon. Kis topic mein doubt hai?" },
  ]);

  const bottomRef = useRef(null);

  const handleSend = (text) => {
    const userMessage = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    // Placeholder AI reply — will be replaced with real backend call later (Week 9+)
    setTimeout(() => {
      const randomReply =
        PLACEHOLDER_REPLIES[Math.floor(Math.random() * PLACEHOLDER_REPLIES.length)];

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: randomReply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 600);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h1 className="text-[#F5C518] font-bold text-lg">ShikshaGPT Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}