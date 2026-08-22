from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class LLMProvider(ABC):
    @abstractmethod
    async def analyze_risk(self, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def select_strategy(self, case_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        pass

class OllamaProvider(LLMProvider):
    def __init__(self, base_url: str, model: str):
        self.base_url = base_url
        self.model = model

    async def analyze_risk(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # TODO: Implement actual Ollama API call
        return {"status": "mock_ollama_risk", "probability": 0.85}

    async def select_strategy(self, case_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        # TODO: Implement actual Ollama API call
        return {"strategy": "SMART_RETRY"}

class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def analyze_risk(self, context: Dict[str, Any]) -> Dict[str, Any]:
        # TODO: Implement Gemini API call
        return {"status": "mock_gemini_risk", "probability": 0.85}

    async def select_strategy(self, case_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        # TODO: Implement Gemini API call
        return {"strategy": "SMART_RETRY"}

class MockProvider(LLMProvider):
    async def analyze_risk(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "root_cause": "TEMPORARY_BANK_FAILURE",
            "recovery_probability": 0.87,
            "confidence": 0.91
        }

    async def select_strategy(self, case_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "recommended_strategy": "SMART_RETRY",
            "expected_recovery": context.get("amount", 0),
            "reason": "Strong payment history and temporary failure pattern."
        }

def get_llm_provider(provider_type: str = "mock", **kwargs) -> LLMProvider:
    if provider_type == "ollama":
        return OllamaProvider(
            base_url=kwargs.get("base_url", "http://localhost:11434"),
            model=kwargs.get("model", "qwen2.5:8b")
        )
    elif provider_type == "gemini":
        return GeminiProvider(api_key=kwargs.get("api_key", ""))
    else:
        return MockProvider()
