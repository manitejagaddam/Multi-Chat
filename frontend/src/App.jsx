import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);

  const availableModels = ["mistral", "deepseek", "llama"];

  // Toggle model selection (max 2)
  const handleModelToggle = (model) => {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter((m) => m !== model));
    } else if (selectedModels.length < 2) {
      setSelectedModels([...selectedModels, model]);
    } else {
      alert("⚠️ You can select at most 2 models");
    }
  };

  // Send message depending on model count
  const sendMessage = async () => {
    if (!input.trim() || selectedModels.length === 0) {
      alert("⚠️ Please enter a message and select at least one model");
      return;
    }

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

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

      // Backend returns assistant response
      const assistantMessage = {
        role: "assistant",
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setInput("");
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error.message);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧑‍💻 Multi-Chat</h1>

      {/* Model Selection */}
      <div className="mb-4">
        <h2 className="font-semibold">Select Models (max 2):</h2>
        <div className="flex gap-4 mt-2">
          {availableModels.map((model) => (
            <label key={model} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedModels.includes(model)}
                onChange={() => handleModelToggle(model)}
              />
              <span>{model}</span>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Selected: {selectedModels.join(", ") || "None"}
        </p>
      </div>

      {/* Chat Window */}
      <div className="border rounded-lg p-4 h-80 overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-lg ${
              msg.role === "user" ? "bg-blue-100 text-right" : "bg-green-100 text-left"
            }`}
          >
            <strong>{msg.role}: </strong> {msg.content}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
