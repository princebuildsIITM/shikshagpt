import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 md:py-28">
      <h1 className="mx-auto max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-paper sm:text-4xl md:text-5xl">
        Your personal AI tutor, <span className="text-gold">built for India.</span>
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm text-paper-dim sm:mt-6 sm:text-base md:text-lg">
        ShikshaGPT gives every student — no matter their city, language, or budget — a
        tutor that explains, guides, and never gets tired of their questions.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
        <Link
          to="/chat"
          className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-dim sm:w-auto"
        >
          Try it free
        </Link>
        <Link
          to="/doubt"
          className="w-full rounded-full border border-ink-border px-6 py-3 text-sm font-semibold text-paper transition hover:border-gold hover:text-gold sm:w-auto"
        >
          Explore features
        </Link>
      </div>
    </section>
  )
}