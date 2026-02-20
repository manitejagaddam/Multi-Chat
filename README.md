# 🤖 MultiChat

*Seamless Conversations Across Multiple LLMs*

![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

---

## 🌍 The Problem

Ever started a chat with one LLM, but then realized another model (say Mistral, DeepSeek, or an open-source gem) would give you better answers?
Right now, switching models means **copy-pasting conversations**, losing context, and wasting time.

That’s broken.

---

## ⚡ The Solution: MultiChat

**MultiChat** is an AI orchestration layer that lets you:

* ✅ Start a chat with one model and seamlessly continue with another.
* ✅ Run **parallel responses** from multiple LLMs and compare answers.
* ✅ Build **pipelines** where different models handle different steps.
* ✅ Support both **closed-source APIs** and **open-source LLMs**.
* ✅ Keep your conversations synced, sessionized, and reusable.

Think of it as your **“multi-agent switchboard”** for the AI world.

---

## ✨ Features

* 🔄 **Continue Anywhere**: Pick up your conversation in DeepSeek, Mistral, Qwen, or any LLM.
* 🧩 **Extensible Connectors**: Add new LLMs with a simple plug-and-play connector.
* ⚡ **Parallel Mode**: Ask multiple models the same thing, compare instantly.
* 📡 **Pipelines**: Chain models (e.g., Mistral for analysis → DeepSeek for summarization → Qwen for creativity).
* 🛠 **Developer Friendly**: Simple API endpoints to integrate into any app.

---

## 🏗 Architecture

MultiChat is powered by:

* **Backend**: FastAPI (Python)
* **Frontend**: React (Next.js/Vite)
* **LLM Connectors**: DeepSeek, Mistral, Qwen, and more
* **Middleware**: Session tracking, orchestration logic

---

## 🚀 Getting Started

### Prerequisites

* Python 3.10+
* Node.js 18+
* API keys for your chosen LLMs (if using hosted ones)

### Clone the Repo

```bash
git clone https://github.com/manitejagaddam/Multi-Chat.git
cd MultiChat
```

### Backend Setup

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
# open another terminal
cd client
npm run start
```

---

## 🧩 Usage

Once running:

* Visit `http://localhost:3000` for the UI.
* Use `/chat` and `/chatall` endpoints for backend orchestration.

Example (parallel chat request):

```json
{
  "session_id": "abc123",
  "message": "Explain quantum computing in simple terms",
  "models": ["deepseek", "mistral", "qwen"]
}
```

---

## 🤝 Contributing

We welcome contributions from the community to make MultiChat even better!

### Contribution Guidelines

1. **Fork the repository** and clone it locally.
2. **Create a new branch** for your feature or bugfix:

   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Write clean, documented code** and include tests if applicable.
4. **Commit your changes** with a descriptive message:

   ```bash
   git commit -m "Add feature: your feature description"
   ```
5. **Push your branch** to your forked repo:

   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request (PR)** describing your changes clearly.
7. Ensure your PR passes all checks and reviews before merging.

### Code of Conduct

We expect contributors to follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a welcoming environment for everyone.

---

## 📜 License

This project is licensed under the **Apache 2.0 License** – see the [LICENSE](./LICENSE) file for details.

---

## ⭐ Vision

MultiChat is just the beginning.
Our goal is to build a **universal orchestration platform** where multiple LLMs and agents collaborate — not compete — to give you the **best possible intelligence layer** for apps, research, and daily life.

---
