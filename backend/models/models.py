from pydantic import BaseModel, Field
from typing import List, Optional

class Message(BaseModel):
    role: str = Field(..., description="Role of the message: 'user' or 'assistant'")
    content: str = Field(..., description="Message text content")

class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    session_id: Optional[str] = None

class MultiChatRequest(BaseModel):
    models: List[str]
    messages: List[Message]
    session_id: Optional[str] = None
