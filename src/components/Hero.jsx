export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
      <div className="grid items-center gap-14 md:grid-cols-2">
        {/* Left: the actual promise */}
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-gold">
            AI tutor · online 24/7
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] text-paper md:text-5xl">
            Doubts don't wait for
            <br />
            coaching hours. <span className="text-gold">Neither should you.</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-paper-dim">
            ShikshaGPT explains your JEE, NEET, and board exam doubts in simple
            language — at 11 PM, on a Sunday, or in the two minutes before class.
            No coaching centre required.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="#try"
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-gold-dim"
            >
              Ask your first doubt — free
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-paper-dim transition hover:text-paper"
            >
              See how it works →
            </a>
          </div>
        </div>

        {/* Right: signature element — a real doubt, answered, timestamped late at night */}
        <div className="rounded-2xl border border-ink-border bg-ink-raised p-5 shadow-2xl shadow-black/40">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs text-paper-dim">11:47 PM</span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-gold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              ShikshaGPT is awake
            </span>
          </div>

          <div className="space-y-3">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-ink-border px-4 py-2.5 text-sm text-paper">
              Sir integration by parts ka formula kab use karna hai, samajh nahi aata 😩
            </div>
            <div className="mr-auto max-w-[90%] rounded-2xl rounded-tl-sm border border-gold/20 bg-gold/10 px-4 py-2.5 text-sm leading-relaxed text-paper">
              Jab do functions multiply ho rahe hon aur direct integrate na ho —
              jaise <span className="font-mono">x·sin(x)</span>. Choose karo{' '}
              <span className="font-mono">u</span> aur{' '}
              <span className="font-mono">dv</span> using LIATE rule. Ek example
              se dikhata hoon...
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}