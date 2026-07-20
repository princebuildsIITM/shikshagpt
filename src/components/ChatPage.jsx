import { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Hi! Main ShikshaGPT hoon. Kis topic mein doubt hai?" },
  ]);

  const bottomRef = useRef(null);

  const handleSend = (text) => {
    const userMessage = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    // Placeholder AI reply — will be replaced with real backend call later
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Yeh feature abhi build ho raha hai — AI response backend wire hone ke baad live hoga.",
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