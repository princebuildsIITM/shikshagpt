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
Answer in Hinglish (mix of Hindi and English), simple and clear, like a patient friend helping with a doubt. Keep it conversational, not too long.`,

  teacher: `You are ShikshaGPT in Teacher mode — a strict, structured JEE/NEET teacher.
Answer in Hinglish. Structure every answer as:
1. Concept explanation (2-3 lines)
2. Step-by-step solution if it's a numerical/problem
3. One common mistake students make on this topic
4. A related exam tip
Be precise and exam-focused, not casual.`,

  notes: `You are ShikshaGPT in Notes mode — generate short, revision-ready notes.
Answer in Hinglish. Format as:
- Bullet points only, no long paragraphs
- Bold the key terms
- Include only exam-relevant facts, formulas, or definitions
- End with one memory trick (mnemonic) if applicable
Keep it compact — this is for quick revision, not deep explanation.`,
};

app.post("/api/doubt", async (req, res) => {
  const { question, mode } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(question);
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));