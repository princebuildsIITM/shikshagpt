import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import ChatPage from './components/ChatPage.jsx'
import DoubtPage from './components/DoubtPage.jsx'
import TestPage from './components/TestPage.jsx'
import NotesPage from './components/NotesPage.jsx'
import NotFound from './components/NotFound.jsx'

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ink font-body text-paper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doubt" element={<DoubtPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}