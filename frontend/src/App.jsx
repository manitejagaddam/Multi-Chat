// App.jsx
import { useState } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("mistral");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/chat", {
        model,
        messages: input,
        history: updatedMessages, // send full history if needed
      });

      // Add model response
      setMessages((prev) => [...prev, { sender: "model", text: response.data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "model", text: "Error: Could not get response" }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Multi-LLM Chat</h2>

      <div style={{ border: "1px solid #ccc", padding: 10, height: 400, overflowY: "scroll", marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px 0" }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 15,
                backgroundColor: msg.sender === "user" ? "#007bff" : "#e5e5e5",
                color: msg.sender === "user" ? "white" : "black",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div>Typing...</div>}
      </div>

      <div style={{ display: "flex", gap: 5 }}>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="mistral">Mistral</option>
          <option value="deepseek">DeepSeek</option>
          <option value="qwen">Qwen</option>
        </select>
        <input
          style={{ flex: 1, padding: "8px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
