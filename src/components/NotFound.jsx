import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <h1 className="text-5xl font-bold text-[#F5C518]">404</h1>
      <p className="mt-3 text-sm text-zinc-400">Yeh page exist nahi karta.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-[#F5C518] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90"
      >
        Go back home
      </Link>
    </div>
  );
}