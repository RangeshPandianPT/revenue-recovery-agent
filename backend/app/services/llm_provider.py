from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx
import json

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
        prompt = f"""
        Analyze the risk of the following failed transaction/invoice and output ONLY a JSON object.
        Context: {json.dumps(context)}
        
        Required JSON structure:
        {{
            "root_cause": "string explaining the cause",
            "recovery_probability": float between 0 and 1,
            "confidence": float between 0 and 1
        }}
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json"
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return json.loads(data.get("response", "{}"))
        except Exception as e:
            print(f"Ollama analyze_risk error: {e}")
            return {
                "root_cause": "UNKNOWN_ERROR",
                "recovery_probability": 0.5,
                "confidence": 0.5
            }

    async def select_strategy(self, case_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        Select the best recovery strategy for this case and output ONLY a JSON object.
        Case ID: {case_id}
        Context: {json.dumps(context)}
        
        Available strategies: SMART_RETRY, PAYMENT_LINK, EMAIL_REMINDER, WHATSAPP_REMINDER, CALL_AGENT, LEGAL_ESCALATION
        
        Required JSON structure:
        {{
            "recommended_strategy": "string (one of the available strategies)",
            "expected_recovery": float (expected amount to recover),
            "reason": "string explaining the reason"
        }}
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json"
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return json.loads(data.get("response", "{}"))
        except Exception as e:
            print(f"Ollama select_strategy error: {e}")
            return {
                "recommended_strategy": "SMART_RETRY",
                "expected_recovery": context.get("amount", 0.0),
                "reason": "Fallback strategy due to AI provider error."
            }

class OpenRouterProvider(LLMProvider):
    def __init__(self, api_key: str, model: str = "openrouter/free"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"

    async def analyze_risk(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        Analyze the risk of the following failed transaction/invoice and output ONLY a JSON object.
        Context: {json.dumps(context)}
        
        Required JSON structure:
        {{
            "root_cause": "string explaining the cause",
            "recovery_probability": float between 0 and 1,
            "confidence": float between 0 and 1
        }}
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}]
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                content = content.replace("```json", "").replace("```", "").strip()
                return json.loads(content)
        except Exception as e:
            print(f"OpenRouter analyze_risk error: {e}")
            return {
                "root_cause": "UNKNOWN_ERROR",
                "recovery_probability": 0.5,
                "confidence": 0.5
            }

    async def select_strategy(self, case_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        Select the best recovery strategy for this case and output ONLY a JSON object.
        Case ID: {case_id}
        Context: {json.dumps(context)}
        
        Available strategies: SMART_RETRY, PAYMENT_LINK, EMAIL_REMINDER, WHATSAPP_REMINDER, CALL_AGENT, LEGAL_ESCALATION
        
        Required JSON structure:
        {{
            "recommended_strategy": "string (one of the available strategies)",
            "expected_recovery": float (expected amount to recover),
            "reason": "string explaining the reason"
        }}
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}]
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                content = content.replace("```json", "").replace("```", "").strip()
                return json.loads(content)
        except Exception as e:
            print(f"OpenRouter select_strategy error: {e}")
            return {
                "recommended_strategy": "SMART_RETRY",
                "expected_recovery": context.get("amount", 0.0),
                "reason": "Fallback strategy due to AI provider error."
            }

class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model = model
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    async def analyze_risk(self, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        Analyze the risk of the following failed transaction/invoice and output ONLY a JSON object.
        Context: {json.dumps(context)}
        
        Required JSON structure:
        {{
            "root_cause": "string explaining the cause",
            "recovery_probability": float between 0 and 1,
            "confidence": float between 0 and 1
        }}
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"responseMimeType": "application/json"}
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                content = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(content)
        except Exception as e:
            print(f"Gemini analyze_risk error: {e}")
            return {
                "root_cause": "UNKNOWN_ERROR",
                "recovery_probability": 0.5,
                "confidence": 0.5
            }

    async def select_strategy(self, case_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""
        Select the best recovery strategy for this case and output ONLY a JSON object.
        Case ID: {case_id}
        Context: {json.dumps(context)}
        
        Available strategies: SMART_RETRY, PAYMENT_LINK, EMAIL_REMINDER, WHATSAPP_REMINDER, CALL_AGENT, LEGAL_ESCALATION
        
        Required JSON structure:
        {{
            "recommended_strategy": "string (one of the available strategies)",
            "expected_recovery": float (expected amount to recover),
            "reason": "string explaining the reason"
        }}
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {"responseMimeType": "application/json"}
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                content = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(content)
        except Exception as e:
            print(f"Gemini select_strategy error: {e}")
            return {
                "recommended_strategy": "SMART_RETRY",
                "expected_recovery": context.get("amount", 0.0),
                "reason": "Fallback strategy due to AI provider error."
            }

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
    elif provider_type == "openrouter":
        return OpenRouterProvider(
            api_key=kwargs.get("api_key", ""),
            model=kwargs.get("model", "openrouter/free")
        )
    else:
        return MockProvider()
