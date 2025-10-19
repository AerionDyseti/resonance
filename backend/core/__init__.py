"""
Core backend components - configuration and database management.
"""

from backend.core.config import Settings, settings
from backend.core.database import (
    Base,
    DatabaseManager,
    MixinDefinition,
    SavedFilter,
    SchemaDefinition,
    StorySnapshot,
    World,
    db_manager,
    get_chroma,
    get_db,
)

__all__ = [
    # Configuration
    "Settings",
    "settings",
    # Database Models
    "Base",
    "World",
    "MixinDefinition",
    "SchemaDefinition",
    "SavedFilter",
    "StorySnapshot",
    # Database Manager
    "DatabaseManager",
    "db_manager",
    # Dependency Injection
    "get_db",
    "get_chroma",
]
