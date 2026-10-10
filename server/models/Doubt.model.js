import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["chat", "teacher", "notes"],
      default: "chat",
    },
  },
  { timestamps: true }
);

const Doubt = mongoose.model("Doubt", doubtSchema);

export default Doubt;