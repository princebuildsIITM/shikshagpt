const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-gold" strokeWidth="1.75">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Ask anytime',
    body: 'No waiting for a coaching slot or a tutor to be free. Doubts get answered the moment they happen — even at midnight.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-gold" strokeWidth="1.75">
        <path
          d="M4 5h16v10H8l-4 4V5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Explained your way',
    body: "Not a generic search result. ShikshaGPT teaches like a patient teacher — simple language first, exam-ready detail second.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 stroke-gold" strokeWidth="1.75">
        <path
          d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Built for Indian exams',
    body: 'JEE, NEET, and board syllabus — not a generic AI chatbot repurposed for studying.',
  },
]

export default function Features() {
  return (
    <section id="features" className="border-t border-ink-border bg-ink-raised/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Why students switch to it
        </p>
        <h2 className="mt-3 max-w-lg font-display text-2xl font-bold text-paper md:text-3xl">
          Built around one problem: doubts don't happen on a schedule.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-ink-border bg-ink p-6 transition hover:border-gold/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                {f.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-paper">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-paper-dim">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}