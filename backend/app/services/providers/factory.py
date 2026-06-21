from backend.app.core.config import settings
from backend.app.services.providers.anthropic_provider import AnthropicProvider
from backend.app.services.providers.base import LLMProvider
from backend.app.services.providers.mock_provider import MockProvider
from backend.app.services.providers.openai_provider import OpenAIProvider


def get_llm_provider() -> LLMProvider:
    provider = settings.llm_provider.lower()
    if provider == "openai":
        return OpenAIProvider()
    if provider == "anthropic":
        return AnthropicProvider()
    return MockProvider()
