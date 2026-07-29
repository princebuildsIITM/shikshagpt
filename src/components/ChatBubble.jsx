export default function ChatBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`flex w-full mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed sm:max-w-[75%] sm:px-4
          ${
            isUser
              ? "bg-[#F5C518] text-black rounded-br-sm"
              : "bg-zinc-800 text-white rounded-bl-sm border border-zinc-700"
          }`}
      >
        {text}
      </div>
    </div>
  );
}