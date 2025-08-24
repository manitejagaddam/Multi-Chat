import httpx
import os
from .base import BaseLLMConnector
from dotenv import load_dotenv

load_dotenv()

class MistralConnector(BaseLLMConnector):
    def __init__(self):
        api_key = os.getenv("OPENROUTER_API_KEY")
        model = os.getenv(
            "MISTRAL_MODEL", "mistralai/mistral-small-3.2-24b-instruct:free"
        )  # default free model
        url = os.getenv("OPENROUTER_URL")
        
        super().__init__(api=api_key, model=model, url=url)
    
    async def chat(self, messages: list[dict], session_id: str = None) -> str:
        """
        messages: list of dicts like [{"role": "user", "content": "Hello"}]
        session_id: optional string to maintain session/context per user
        """
        headers = {"Authorization": f"Bearer {self.api_key}"}

        payload = {
            "model": self.model,
            "messages": messages
        }

        # Include session_id if provided
        if session_id:
            payload["user"] = session_id  # OpenRouter uses 'user' field to track sessions

        async with httpx.AsyncClient() as client:
            resp = await client.post(self.url, json=payload, headers=headers)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError as e:
                print("Error from OpenRouter API:", resp.text)
                raise e

            data = resp.json()
            # OpenRouter returns the message under choices[0].message.content
            return data["choices"][0]["message"]["content"]
