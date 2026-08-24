import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPTS = {
  chat: `You are ShikshaGPT, a friendly AI tutor for Indian students.
Keep it simple, clear, and conversational, like a patient friend helping with a doubt. Keep it conversational, not too long.`,

  teacher: `You are ShikshaGPT in Teacher mode — a strict, structured JEE/NEET teacher.
Structure every answer as:
1. Concept explanation (2-3 lines)
2. Step-by-step solution if it's a numerical/problem
3. One common mistake students make on this topic
4. A related exam tip
Be precise and exam-focused, not casual.`,

  notes: `You are ShikshaGPT in Notes mode — generate short, revision-ready notes.
Format as:
- Bullet points only, no long paragraphs
- Bold the key terms
- Include only exam-relevant facts, formulas, or definitions
- End with one memory trick (mnemonic) if applicable
Keep it compact — this is for quick revision, not deep explanation.`,
};

// Detects language from text: Hindi (Devanagari), Hinglish (romanized Hindi words), or English
function detectLanguage(text) {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return "Hindi";

  const hinglishWords = /\b(hai|kya|kyun|kaise|tha|thi|ka|ki|ke|ko|se|mein|aur|bhi|nahi|kar|raha|rahi|rhe|karo|kro|krna|krte|samjhao|batao|matlab)\b/i;
  if (hinglishWords.test(text)) return "Hinglish";

  return "English";
}

app.post("/api/doubt", async (req, res) => {
  const { question, mode, history } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;

  // Find the FIRST user message in this conversation to lock the language
  const historyArr = history || [];
  const firstUserMsg = historyArr.find((m) => m.sender === "user");
  const languageAnchor = firstUserMsg ? firstUserMsg.text : question;
  const conversationLanguage = detectLanguage(languageAnchor);

  const finalSystemPrompt =
    systemPrompt +
    `\n\nIMPORTANT: Respond in ${conversationLanguage} for this reply. Stay in ${conversationLanguage} even if the current message is short or ambiguous (like "explain more", "simple words", "yes", "why"). Only switch language if the student's CURRENT message clearly and unambiguously uses a different script/language.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      systemInstruction: finalSystemPrompt,
    });

    const formattedHistory = historyArr.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(question);
    let answer = result.response.text();
    answer = answer
      .replace(/\*\*/g, "")
      .replace(/\$/g, "")
      .replace(/\\vec\{([^}]+)\}/g, "$1")
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
      .replace(/\\(Sigma|sum)/g, "Σ")
      .replace(/\\mu/g, "μ")
      .replace(/\\theta/g, "θ")
      .replace(/\\lambda/g, "λ")
      .replace(/\\cdot/g, "×")
      .replace(/\\times/g, "×");

    res.json({ answer });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ message: "AI se jawab nahi mil paya. Thodi der baad try karo." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));