from fastapi import FastAPI, HTTPException
import asyncio
import logging
import os
from dotenv import load_dotenv

from models import ChatRequest, MultiChatRequest
from middleware.middleware import setup_cors

from llm_connectors.deepseek import DeepSeekConnector
from llm_connectors.mistral import MistralConnector
from llm_connectors.qwen import QwenConnector
from utils.utils import auto_route_model, generate_session_id, get_session_messages, update_session_messages


load_dotenv()

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Multi-LLM Chat API")

setup_cors(app)

# connectors will be populated at startup; missing API keys are logged, not raising at import
connectors = {}


@app.on_event("startup")
def init_connectors():
    """Instantiate available connectors at startup. Missing API keys are logged but do not prevent startup.
    """
    global connectors
    for name, cls in [("deepseek", DeepSeekConnector), ("mistral", MistralConnector), ("qwen", QwenConnector)]:
        try:
            instance = cls()
        except Exception as e:
            logging.warning(f"Failed to initialize connector {name}: {e}")
            continue

        if not instance.api_key:
            logging.warning(f"API key for {name} not found; skipping connector initialization")
            continue

        connectors[name] = instance

    if not connectors:
        logging.error("No LLM connectors available. Check environment variables for API keys.")

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
    logging.debug(f"session_history: {session_history}")

    # Convert new messages to dict
    new_messages = [m.dict() for m in req.messages]
    logging.debug(f"new_messages: {new_messages} ")

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

    if not req.models:
        raise HTTPException(status_code=400, detail="No target models provided")

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

    # run all models concurrently; collect exceptions per-task
    gathered = await asyncio.gather(*(call_model(m) for m in req.models), return_exceptions=True)

    responses = {}
    for item in gathered:
        # each item is either (model_name, payload) or an exception
        if isinstance(item, Exception):
            logging.error(f"Error calling models: {item}")
            continue
        name, payload = item
        responses[name] = payload

    return {"session_id": session_id, "responses": responses}