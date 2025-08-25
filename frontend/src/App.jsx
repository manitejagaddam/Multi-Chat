import { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState("mistral");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Build the payload exactly as your backend schema expects
    const payload = {
      model,
      messages: [
        ...messages,
        { role: "user", content: input }, // 👈 matches Pydantic "Message"
      ],
    };

    // Debug: log what’s being sent
    console.log("🔍 Sending payload to backend:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post("http://localhost:8000/chat", payload);

      console.log("✅ Backend response:", response.data);

      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: response.data.reply },
      ]);
      setInput("");
    } catch (error) {
      console.error("❌ Error from backend:", error);

      if (error.response) {
        console.error("📩 Backend status:", error.response.status);
        console.error("📄 Backend response data:", error.response.data);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <h1>Multi Chat Debug</h1>
      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role}:</strong> {m.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />
    </div>
  );
}

export default App;
