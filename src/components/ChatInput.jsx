import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-zinc-800 bg-black p-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Apna doubt yahan likho..."
        className="flex-1 bg-zinc-900 text-white placeholder-zinc-500 rounded-full px-4 py-2
                   text-sm outline-none border border-zinc-700 focus:border-[#F5C518]"
      />
      <button
        onClick={handleSend}
        className="bg-[#F5C518] text-black font-semibold rounded-full px-5 py-2 text-sm
                   hover:opacity-90 transition disabled:opacity-40"
        disabled={!input.trim()}
      >
        Send
      </button>
    </div>
  );
}