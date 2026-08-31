import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "ShikshaGPT API is running ✅" });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Multer setup for image uploads ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// --- Existing /api/doubt route (Teacher/Notes mode) ---
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
    answer = answer.replace(/\*\*/g, "").replace(/\$/g, "");

    res.json({ answer });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ message: "AI se jawab nahi mil paya. Thodi der baad try karo." });
  }
});

// --- New: Image upload route ---
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

// --- Multer error handler (file too large, wrong type, etc.) ---
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError || error.message === "Only image files are allowed") {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));