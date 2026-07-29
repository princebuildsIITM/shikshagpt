import { useNavigate } from "react-router-dom";

export default function TestPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-[#F5C518] hover:text-[#F5C518] sm:left-6 sm:top-6 sm:px-4 sm:py-2 sm:text-sm"
      >
        ← Back
      </button>

      <h1 className="text-xl font-bold text-[#F5C518] sm:text-2xl">Practice Test</h1>
      <p className="mt-3 max-w-xs text-sm text-zinc-400 sm:max-w-md">
        Chapter-wise aur mock tests yahan honge, real-time scoring ke saath. Yeh feature
        abhi build ho raha hai.
      </p>
    </div>
  );
}