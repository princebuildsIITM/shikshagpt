import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "./db.js";
import Doubt from "./models/Doubt.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Multer (image upload) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// --- Health routes ---
app.get("/", (req, res) => {
  res.json({ message: "ShikshaGPT API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ShikshaGPT API is healthy", timestamp: new Date().toISOString() });
});

// --- System prompts ---
const LANGUAGE_RULE = `
Language rule: reply in the same language style as the student's latest message. If they write in English, reply in English. If they write in Hindi or Hinglish, reply in Hinglish (Hindi in Roman script mixed with English).
Use plain text only. Do not use markdown symbols like * or ** or $, and do not use LaTeX.`;

const SYSTEM_PROMPTS = {
  chat: `You are ShikshaGPT, a friendly AI tutor for Indian students.
Explain simply and clearly, like a patient friend helping with a doubt. Keep it conversational, not too long.
If the student refers to something said earlier (like "the second one" or "explain that again"), use the earlier conversation to understand what they mean instead of asking again.${LANGUAGE_RULE}`,

  teacher: `You are ShikshaGPT in Teacher mode, a strict, structured JEE/NEET teacher.
Structure every answer as:
1. Concept explanation (2-3 lines)
2. Step-by-step solution if it's a numerical/problem
3. One common mistake students make on this topic
4. A related exam tip
Be precise and exam-focused, not casual. If the student refers to something said earlier, use the earlier conversation.${LANGUAGE_RULE}`,

  notes: `You are ShikshaGPT in Notes mode. Generate short, revision-ready notes.
Format as:
- Short bullet points using "-" only, no long paragraphs
- Include only exam-relevant facts, formulas, or definitions
- End with one memory trick (mnemonic) if applicable
Keep it compact, this is for quick revision. If the student refers to something said earlier, use the earlier conversation.${LANGUAGE_RULE}`,
};

// --- Helpers ---
// Converts frontend messages into the format Gemini expects.
function buildChatHistory(history) {
  if (!Array.isArray(history)) return [];

  const cleaned = [];
  for (const msg of history) {
    if (!msg || typeof msg.text !== "string") continue;
    if (msg.text.startsWith("⚠️")) continue; // skip error bubbles

    const role = msg.sender === "user" ? "user" : "model";
    const last = cleaned[cleaned.length - 1];

    if (last && last.role === role) {
      last.parts[0].text += "\n" + msg.text;
    } else {
      cleaned.push({ role, parts: [{ text: msg.text }] });
    }
  }

  // Next turn is the student's new question, so history must end with the AI's reply
  while (cleaned.length && cleaned[cleaned.length - 1].role !== "model") cleaned.pop();

  const recent = cleaned.slice(-6);

  // Gemini needs history to start with a user turn
  while (recent.length && recent[0].role !== "user") recent.shift();

  return recent;
}

function cleanAnswer(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/\$/g, "")
    .replace(/\\times/g, "×")
    .replace(/\\text\{([^}]+)\}/g, "$1");
}
const HINGLISH_WORDS = new Set([
  "kya", "hai", "hain", "ka", "ki", "ke", "ko", "se", "mein", "aur", "nahi", "nhi",
  "kaise", "kyun", "kyu", "kaun", "kitna", "kitni", "kab", "kahan", "batao", "btao",
  "btaao", "bataiye", "samjhao", "samjha", "samjhaiye", "wala", "wale", "wali",
  "isko", "usko", "iska", "uska", "yeh", "ye", "woh", "wo", "hota", "hoti", "hote",
  "karo", "karna", "chahiye", "mujhe", "mera", "meri", "tum", "aap", "bhi", "abhi",
  "phir", "lekin", "isme", "usme", "dikhao", "aasan",
]);

function detectLanguageHint(text) {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  const isHinglish = hasDevanagari || words.some((w) => HINGLISH_WORDS.has(w));

  return isHinglish
    ? "Reply in Hinglish (Hindi in Roman script mixed with English)."
    : "Reply fully in English only, even if earlier replies in this conversation were in Hinglish.";
}

// --- POST /api/doubt ---
app.post("/api/doubt", async (req, res) => {
  const { question, mode, history } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ message: "Question is required" });
  }

  const selectedMode = SYSTEM_PROMPTS[mode] ? mode : "chat";

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      systemInstruction: SYSTEM_PROMPTS[selectedMode],
    });

    const chat = model.startChat({ history: buildChatHistory(history) });
    const result = await chat.sendMessage(`${question}\n\n(${detectLanguageHint(question)})`);
    const answer = cleanAnswer(result.response.text());

    try {
      await Doubt.create({ question, answer, mode: selectedMode });
    } catch (dbError) {
      console.error("Failed to save doubt to DB:", dbError.message);
    }

    res.json({ answer, mode: selectedMode });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ message: "AI se jawab nahi mil paya. Thodi der baad try karo." });
  }
});

// --- GET /api/doubt/history ---
app.get("/api/doubt/history", async (req, res) => {
  try {
    const history = await Doubt.find().sort({ createdAt: -1 }).limit(20);
    res.json({ history });
  } catch (error) {
    console.error("Failed to fetch history:", error);
    res.status(500).json({ message: "History load nahi ho payi." });
  }
});

// --- Image upload ---
app.post("/api/upload-doubt", upload.single("doubtImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image received." });
  }

  console.log("Image received:", req.file.filename);

  res.json({
    message: "Image received! Hum jald hi iska solution bhejenge.",
    filename: req.file.filename,
  });
});

// --- Multer error handler ---
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error.message === "Only image files are allowed") {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));