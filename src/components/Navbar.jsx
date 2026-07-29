import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { to: '/doubt', label: 'Doubt' },
    { to: '/chat', label: 'Chat' },
    { to: '/test', label: 'Test' },
    { to: '/notes', label: 'Notes' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-ink-border/80 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="font-display text-base font-bold tracking-tight text-paper sm:text-lg">
            Shiksha<span className="text-gold">GPT</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-paper-dim transition hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/chat"
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-gold-dim sm:inline-block"
          >
            Try it free
          </Link>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-border text-paper md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <span className="text-lg leading-none">✕</span>
            ) : (
              <span className="text-lg leading-none">☰</span>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink-border/80 bg-ink px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-paper-dim transition hover:bg-ink-border/40 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/chat"
            onClick={() => setIsOpen(false)}
            className="mt-2 rounded-full bg-gold px-4 py-2 text-center text-sm font-semibold text-ink transition hover:bg-gold-dim"
          >
            Try it free
          </Link>
        </nav>
      )}
    </header>
  )
}