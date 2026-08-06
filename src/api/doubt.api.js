import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function askDoubt(question) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/doubt`, {
      question,
    });

    return {
      success: true,
      answer: response.data.answer,
    };
  } catch (error) {
    console.error("askDoubt error:", error);

    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Kuch gadbad ho gayi. Thodi der baad try karo.",
    };
  }
}