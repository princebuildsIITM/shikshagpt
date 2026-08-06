import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/doubt", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    const prompt = `You are ShikshaGPT, a friendly AI tutor for Indian students. 
Answer in Hinglish (mix of Hindi and English), simple and clear, like a patient teacher. 
Student's question: ${question}`;

    const result = await model.generateContent(prompt);
    let answer = result.response.text();
    answer = answer.replace(/\*\*/g, "").replace(/\$/g, "");

    res.json({ answer });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ message: "AI se jawab nahi mil paya. Thodi der baad try karo." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));