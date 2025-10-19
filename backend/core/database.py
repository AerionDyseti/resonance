"""
Resonance Database Models and Management

Hybrid database architecture:
- SQLite: Schema definitions, metadata, relationships
- Chroma: Entity content with vector embeddings for semantic search
"""

from datetime import datetime
from typing import AsyncGenerator

import chromadb
from chromadb.config import Settings as ChromaSettings
from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from backend.core.config import settings


# ============================================
# SQLAlchemy Base and Models
# ============================================

class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


class World(Base):
    """
    World metadata - top level container for a world-building project.

    A World contains:
    - Custom entity type schemas
    - Mixin definitions
    - All entities and relationships
    - Multiple stories (narrative timelines)
    """
    __tablename__ = "worlds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Chroma collection name for this world's entities
    chroma_collection: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)

    # Metadata
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Settings stored as JSON
    settings: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)


class MixinDefinition(Base):
    """
    Reusable property groups that can be composed into entity type schemas.

    Example: "mortal" mixin with {birth_date, death_date, age}
    """
    __tablename__ = "mixin_definitions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    world_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Property definitions stored as JSON
    # Format: {"property_name": {"type": "text", "required": true, ...}, ...}
    properties: Mapped[dict] = mapped_column(JSON, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Unique constraint: mixin name must be unique within a world
    __table_args__ = (
        {"sqlite_autoincrement": True},
    )


class SchemaDefinition(Base):
    """
    Entity type schema definitions for a world.

    Defines the structure for entity types (e.g., "character", "location").
    Combines custom properties with mixins.
    """
    __tablename__ = "schema_definitions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    world_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    # Entity type name (e.g., "character", "location", "faction")
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Property definitions stored as JSON
    # Format: {"property_name": {"type": "text", "required": true, ...}, ...}
    properties: Mapped[dict] = mapped_column(JSON, nullable=False)

    # List of mixin IDs to compose into this schema
    # Format: [mixin_id1, mixin_id2, ...]
    mixin_ids: Mapped[list] = mapped_column(JSON, default=list, nullable=False)

    # Icon/color for UI display
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    color: Mapped[str | None] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    # Unique constraint: entity type must be unique within a world
    __table_args__ = (
        {"sqlite_autoincrement": True},
    )


class SavedFilter(Base):
    """
    User-created filters/views for querying entities.

    Saved filters allow reusable complex queries with property filters,
    search terms, and sorting options.
    """
    __tablename__ = "saved_filters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    world_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Filter definition stored as JSON
    # Format: {"property_filters": [...], "search_term": "...", "sort_by": "...", ...}
    filter_definition: Mapped[dict] = mapped_column(JSON, nullable=False)

    # Whether this is a "smart collection" that auto-updates
    is_smart_collection: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )


class StorySnapshot(Base):
    """
    Story snapshots capture world state at key narrative moments.

    Stories track narrative progression (e.g., D&D campaigns, novel drafts).
    Snapshots preserve world state at session starts or major events.
    """
    __tablename__ = "story_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    world_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    # Story identifier (e.g., "Campaign 1", "Novel Draft 2")
    story_name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Snapshot metadata
    snapshot_name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Snapshot data stored as JSON (entity states at this point in time)
    # Format: {"entities": [...], "relationships": [...], "metadata": {...}}
    snapshot_data: Mapped[dict] = mapped_column(JSON, nullable=False)

    # Session/chapter information
    session_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    session_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


# ============================================
# Database Manager
# ============================================

class DatabaseManager:
    """
    Singleton manager for database connections.

    Manages both SQLite (metadata) and Chroma (vector store) connections.
    """

    _instance = None
    _engine = None
    _session_factory = None
    _chroma_client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    async def initialize(self) -> None:
        """Initialize database connections and create tables."""
        # Initialize SQLite
        self._engine = create_async_engine(
            settings.sqlite_database_url,
            echo=settings.debug,
            future=True,
        )

        self._session_factory = async_sessionmaker(
            self._engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )

        # Create all tables
        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Initialize Chroma
        self._chroma_client = chromadb.PersistentClient(
            path=str(settings.chroma_persist_directory),
            settings=ChromaSettings(
                anonymized_telemetry=False,
            ),
        )

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """Get async database session."""
        if self._session_factory is None:
            await self.initialize()

        async with self._session_factory() as session:
            yield session

    def get_chroma_client(self) -> chromadb.PersistentClient:
        """Get Chroma client."""
        if self._chroma_client is None:
            raise RuntimeError("Database not initialized. Call initialize() first.")
        return self._chroma_client

    async def close(self) -> None:
        """Close database connections."""
        if self._engine:
            await self._engine.dispose()


# ============================================
# Dependency Injection Helpers
# ============================================

# Global database manager instance
db_manager = DatabaseManager()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for getting database sessions.

    Usage:
        @app.get("/endpoint")
        async def endpoint(db: AsyncSession = Depends(get_db)):
            ...
    """
    async for session in db_manager.get_session():
        yield session


def get_chroma() -> chromadb.PersistentClient:
    """
    FastAPI dependency for getting Chroma client.

    Usage:
        @app.get("/endpoint")
        def endpoint(chroma: chromadb.PersistentClient = Depends(get_chroma)):
            ...
    """
    return db_manager.get_chroma_client()
