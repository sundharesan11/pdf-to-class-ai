"""
Configuration and environment settings.
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # OpenAI Configuration
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = "gpt-4o-mini"

    # Database Configuration
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/pdf_to_class"
    )
    database_echo: bool = False

    # Qdrant Vector Database
    qdrant_url: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    qdrant_api_key: Optional[str] = os.getenv("QDRANT_API_KEY", None)
    qdrant_collection_name: str = "course_content"

    # Agent Configuration
    agent_max_turns: int = 10
    agent_temperature: float = 0.7
    agent_top_p: float = 1.0

    # Session Configuration
    session_history_length: int = 10
    session_ttl_seconds: int = 86400  # 24 hours

    # API Configuration
    api_title: str = "PDF to Class - AI Agents"
    api_version: str = "0.1.0"
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    api_debug: bool = os.getenv("DEBUG", "false").lower() == "true"

    class Config:
        env_file = ".env"
        case_sensitive = False


def get_settings() -> Settings:
    """Get application settings."""
    return Settings()


# Import Optional for type hints
from typing import Optional

settings = get_settings()
