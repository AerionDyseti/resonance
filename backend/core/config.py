"""
Resonance Configuration Management

Uses Pydantic Settings for type-safe configuration with environment variable support.
"""

from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Create a .env file in the project root or set environment variables directly.
    See .env.example for available configuration options.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # ============================================
    # Database Configuration
    # ============================================

    chroma_persist_directory: Path = Field(
        default=Path("./data/chroma"),
        description="Directory for Chroma vector database persistence"
    )

    chroma_collection_name: str = Field(
        default="resonance_entities",
        description="Default Chroma collection name for entities"
    )

    sqlite_database_url: str = Field(
        default="sqlite+aiosqlite:///./data/resonance.db",
        description="SQLite database URL for metadata storage"
    )

    # ============================================
    # Embedding Configuration
    # ============================================

    embedding_provider: Literal["local", "openai"] = Field(
        default="local",
        description="Embedding provider: 'local' (sentence-transformers) or 'openai'"
    )

    local_embedding_model: str = Field(
        default="all-MiniLM-L6-v2",
        description="Sentence-transformers model name for local embeddings"
    )

    openai_api_key: str | None = Field(
        default=None,
        description="OpenAI API key (required if embedding_provider='openai')"
    )

    openai_embedding_model: str = Field(
        default="text-embedding-ada-002",
        description="OpenAI embedding model name"
    )

    # ============================================
    # Application Settings
    # ============================================

    environment: Literal["development", "production"] = Field(
        default="development",
        description="Application environment"
    )

    debug: bool = Field(
        default=True,
        description="Enable debug mode"
    )

    api_host: str = Field(
        default="0.0.0.0",
        description="API server host"
    )

    api_port: int = Field(
        default=8000,
        description="API server port"
    )

    api_reload: bool = Field(
        default=True,
        description="Enable auto-reload in development"
    )

    # ============================================
    # Logging
    # ============================================

    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO",
        description="Logging level"
    )

    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log message format"
    )

    @field_validator("chroma_persist_directory")
    @classmethod
    def create_chroma_directory(cls, v: Path) -> Path:
        """Ensure Chroma directory exists."""
        v.mkdir(parents=True, exist_ok=True)
        return v

    @field_validator("sqlite_database_url")
    @classmethod
    def create_sqlite_directory(cls, v: str) -> str:
        """Ensure SQLite database directory exists."""
        if v.startswith("sqlite"):
            # Extract path from URL (e.g., "sqlite+aiosqlite:///./data/resonance.db")
            db_path = v.split("///")[-1]
            db_dir = Path(db_path).parent
            db_dir.mkdir(parents=True, exist_ok=True)
        return v

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment == "production"


# Global settings instance
settings = Settings()
