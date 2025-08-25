import { useState } from "react";
import axios from "axios";

function ChatApp() {
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("deepseek-chat"); // default model
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/chat", {
        model: model,
        message: message,
      });
      setReply(res.data.reply);
    } catch (err) {
      console.error(err);
      setReply("⚠️ Error: Could not get response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-xl font-bold mb-4">Multi-Chat App</h1>

      {/* Model selector */}
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="deepseek-chat">DeepSeek</option>
        <option value="mistral-chat">Mistral</option>
        <option value="gpt-4">OpenAI GPT-4</option>
      </select>

      {/* Input */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="border p-2 w-80 rounded mb-4"
      />

      {/* Button */}
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {/* Reply */}
      <div className="mt-4 p-4 border rounded w-80">
        <strong>AI:</strong> {reply}
      </div>
    </div>
  );
}

export default ChatApp;
