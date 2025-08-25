import httpx
import os
from dotenv import load_dotenv
from .base import BaseLLMConnector

load_dotenv()

class DeepSeekConnector(BaseLLMConnector):
    def __init__(self):
        # Load key from env
        api_key = os.getenv("OPENROUTER_API_KEY")
        
            # API endpoint
        url = os.getenv("OPENROUTER_URL")
        # print(url)
        
        # Default model
        model = os.getenv("DEEPSEEK_MODEL", "deepseek/deepseek-r1:free")
        
        super().__init__(api=api_key, url=url, model=model)

    async def chat(self, messages: list[dict], session_id: str = None) -> str:
        """
        messages: list of dicts like [{"role": "user", "content": "Hello"}]
        session_id: optional string to maintain session/context per user
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
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
                print("Error from DeepSeek API:", resp.text)
                raise e
            
            data = resp.json()
            print("DeepSeek Response:", data)
            
            return data["choices"][0]["message"]["content"]
