import { useNavigate } from "react-router-dom";

export default function TestPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-[#F5C518] hover:text-[#F5C518]"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-[#F5C518]">Practice Test</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-400">
        Chapter-wise aur mock tests yahan honge, real-time scoring ke saath. Yeh feature
        abhi build ho raha hai.
      </p>
    </div>
  );
}