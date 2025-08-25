from fastapi import FastAPI, HTTPException
import asyncio
import logging
import os
from dotenv import load_dotenv

from backend.models.models import Message, ChatRequest, MultiChatRequest
from backend.middleware.middleware import setup_cors


from backend.llm_connectors.deepseek import DeepSeekConnector
from backend.llm_connectors.mistral import MistralConnector
from backend.llm_connectors.qwen import QwenConnector
from backend.utils.utils import auto_route_model
from backend.utils.utils import generate_session_id, auto_route_model, get_session_messages, update_session_messages


load_dotenv()

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Multi-LLM Chat API")

setup_cors(app)

connectors = {}
for name, cls in [("deepseek", DeepSeekConnector), 
                  ("mistral", MistralConnector), 
                  ("qwen", QwenConnector)]:
    instance = cls()
    if not instance.api_key:
        raise RuntimeError(f"API key for {name} not found in .env")
    connectors[name] = instance

# ------------------- Endpoints -------------------

@app.post("/chat")
async def chat(req: ChatRequest):
    model_name = req.model or auto_route_model(req.messages)
    connector = connectors.get(model_name)
    if not connector:
        raise HTTPException(status_code=400, detail=f"Unsupported model: {model_name}")

    session_id = req.session_id or generate_session_id()

    # Fetch previous messages from session
    session_history = get_session_messages(session_id)

    # Convert new messages to dict
    new_messages = [m.dict() for m in req.messages]

    # Merge history + new messages
    full_messages = session_history + new_messages

    try:
        reply = await connector.chat(full_messages, session_id=session_id)
        # Append assistant reply to session
        update_session_messages(session_id, new_messages + [{"role": "assistant", "content": reply}])
        return {"session_id": session_id, "model": model_name, "reply": reply}
    except Exception as e:
        logging.error(f"Error from {model_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatAll")
async def multi_chat(req: MultiChatRequest):
    session_id = req.session_id or generate_session_id()
    new_messages = [m.dict() for m in req.messages]

    async def call_model(model_name: str):
        connector = connectors.get(model_name)
        if not connector:
            return model_name, {"error": "Unsupported model"}

        # Fetch session messages for this model
        session_history = get_session_messages(session_id)
        full_messages = session_history + new_messages

        try:
            reply = await connector.chat(full_messages, session_id=session_id)
            # Update session
            update_session_messages(session_id, new_messages + [{"role": "assistant", "content": reply}])
            return model_name, {"reply": reply}
        except Exception as e:
            logging.error(f"Error from {model_name}: {e}")
            return model_name, {"error": str(e)}

    results = await asyncio.gather(*(call_model(m) for m in req.models))
    return {"session_id": session_id, "responses": dict(results)}