from abc import ABC, abstractmethod
from typing import List, Dict

class BaseLLMConnector(ABC):
    
    def __init__(self, api : str, model : str, url : str):
        self.api_key = api
        self.model = model
        self.url = url
        
    @abstractmethod
    async def chat(self, messages : List[Dict]) -> str:
        "Takes a dictionaries of messages (previous messages chated with the different models) and returns a string as reply form llm"
        
        pass
    
