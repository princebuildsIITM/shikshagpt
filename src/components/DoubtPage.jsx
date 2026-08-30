import { useState, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DoubtPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage({ type: "error", text: "Sirf image files allowed hain." });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatusMessage(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("doubtImage", selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/upload-doubt`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatusMessage({ type: "success", text: response.data.message });
    } catch (error) {
      console.error("Upload error:", error);
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || "Upload fail ho gaya. Dobara try karo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-black px-4 py-10 text-center sm:px-6">
      <h1 className="text-xl font-bold text-[#F5C518] sm:text-2xl">Doubt Solving</h1>
      <p className="mt-3 max-w-xs text-sm text-zinc-400 sm:max-w-md">
        Apne doubt ki photo upload karo — humari team/AI usse dekh kar madad karegi.
      </p>

      {/* Hidden real file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl ? (
        <button
          onClick={handleUploadClick}
          className="mt-6 rounded-full bg-[#F5C518] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          📷 Upload Doubt Image
        </button>
      ) : (
        <div className="mt-6 w-full max-w-xs sm:max-w-sm">
          <img
            src={previewUrl}
            alt="Doubt preview"
            className="w-full rounded-2xl border border-zinc-700 object-cover"
          />

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="flex-1 rounded-full bg-[#F5C518] px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Send Doubt"}
            </button>
            <button
              onClick={handleRemovePreview}
              disabled={isUploading}
              className="flex-1 rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {statusMessage && (
        <p
          className={`mt-5 text-sm ${
            statusMessage.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? "✅" : "⚠️"} {statusMessage.text}
        </p>
      )}
    </div>
  );
}