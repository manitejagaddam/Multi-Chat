import uuid
import threading
from typing import Dict, List
from models import Message


def generate_session_id() -> str:
    """Generate a unique session ID."""
    return str(uuid.uuid4())


# In-memory session store
# { session_id: List[dict] } — stores conversation as list of message dicts
session_store: Dict[str, List[dict]] = {}
# Lock to protect session store in concurrent environments
session_lock = threading.RLock()


def get_session_messages(session_id: str) -> List[dict]:
    """Get messages for a session, return empty list if not found."""
    with session_lock:
        # return a shallow copy to avoid external mutation
        return list(session_store.get(session_id, []))


def update_session_messages(session_id: str, messages: List[dict]):
    """Append messages to a session in a thread-safe manner."""
    with session_lock:
        if session_id not in session_store:
            session_store[session_id] = []
        session_store[session_id].extend(messages)


def clear_session(session_id: str):
    """Optional: Clear session history."""
    with session_lock:
        if session_id in session_store:
            del session_store[session_id]



def auto_route_model(messages) -> str:
    """Simple routing logic based on keywords in user messages.

    Extend with NLP/ML-based classification for smarter routing.
    """
    # messages expected to be sequence of Message models or objects with .content
    text = " ".join([getattr(m, "content", "").lower() for m in messages])

    if any(keyword in text for keyword in ["code", "program", "python", "javascript"]):
        return "qwen"
    elif any(keyword in text for keyword in ["research", "study", "knowledge", "paper"]):
        return "deepseek"
    else:
        return "mistral"  # default

