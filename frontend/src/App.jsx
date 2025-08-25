import React, { useState } from "react";
import axios from "axios";

const modelsList = ["mistral", "deepseek", "gpt-4", "llama"];

export default function App() {
  const [selectedModels, setSelectedModels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Handle model selection with max 2
  const toggleModel = (model) => {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter((m) => m !== model));
    } else {
      if (selectedModels.length < 2) {
        setSelectedModels([...selectedModels, model]);
      } else {
        alert("⚠️ You can select a maximum of 2 models.");
      }
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || selectedModels.length === 0) return;

    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      let response;
      if (selectedModels.length === 1) {
        // Single model → /chat
        response = await axios.post("http://localhost:8000/chat", {
          model: selectedModels[0],
          messages: updatedMessages,
        });
      } else {
        // Two models → /chatAll
        response = await axios.post("http://localhost:8000/chatAll", {
          models: selectedModels,
          messages: updatedMessages,
        });
      }

      const botReply = {
        role: "assistant",
        content: JSON.stringify(response.data, null, 2), // Pretty print response
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: " + error.message },
      ]);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Multi-Model Chat</h1>

      {/* Model Selection */}
      <div className="flex flex-wrap gap-3 mb-4">
        {modelsList.map((model) => (
          <label
            key={model}
            className={`px-4 py-2 rounded-lg cursor-pointer border ${
              selectedModels.includes(model)
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            <input
              type="checkbox"
              value={model}
              checked={selectedModels.includes(model)}
              onChange={() => toggleModel(model)}
              className="hidden"
            />
            {model}
          </label>
        ))}
      </div>

      {/* Chat Box */}
      <div className="border rounded-lg p-4 h-80 overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === "user" ? "text-blue-600" : "text-green-600"
            }`}
          >
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-4 py-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
