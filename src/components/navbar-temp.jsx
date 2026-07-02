export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-border/80 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="font-display text-lg font-bold tracking-tight text-paper">
            Shiksha<span className="text-gold">GPT</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-paper-dim transition hover:text-paper">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-paper-dim transition hover:text-paper">
            How it works
          </a>
        </nav>

        <a
          href="#try"
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-gold-dim"
        >
          Try it free
        </a>
      </div>
    </header>
  )
}