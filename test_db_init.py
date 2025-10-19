"""
Quick test script to verify database initialization.

This will be deleted after verification - proper tests will be in Issue #14.
"""

import asyncio
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))


async def test_database_init():
    """Test database initialization."""
    print("=" * 60)
    print("Testing Resonance Database Initialization")
    print("=" * 60)

    try:
        # Import configuration
        print("\n1. Loading configuration...")
        from backend.core.config import settings
        print(f"   ✓ Config loaded")
        print(f"   - SQLite URL: {settings.sqlite_database_url}")
        print(f"   - Chroma directory: {settings.chroma_persist_directory}")
        print(f"   - Embedding provider: {settings.embedding_provider}")

        # Import database components
        print("\n2. Importing database components...")
        from backend.core.database import (
            DatabaseManager,
            World,
            MixinDefinition,
            SchemaDefinition,
            SavedFilter,
            StorySnapshot,
            db_manager,
        )
        print(f"   ✓ All models imported successfully")

        # Initialize database
        print("\n3. Initializing databases...")
        await db_manager.initialize()
        print(f"   ✓ SQLite database initialized")
        print(f"   ✓ Chroma client initialized")

        # Test SQLite session
        print("\n4. Testing SQLite session...")
        async for session in db_manager.get_session():
            print(f"   ✓ Database session created")
            # Query to verify tables exist
            from sqlalchemy import text
            result = await session.execute(
                text("SELECT name FROM sqlite_master WHERE type='table'")
            )
            tables = [row[0] for row in result.fetchall()]
            print(f"   ✓ Tables created: {', '.join(tables)}")
            break

        # Test Chroma client
        print("\n5. Testing Chroma client...")
        chroma_client = db_manager.get_chroma_client()
        print(f"   ✓ Chroma client retrieved")
        print(f"   ✓ Chroma version: {chroma_client.get_version()}")

        # Cleanup
        print("\n6. Cleaning up...")
        await db_manager.close()
        print(f"   ✓ Database connections closed")

        print("\n" + "=" * 60)
        print("✅ All tests passed! Database setup is working correctly.")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Error during initialization: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(test_database_init())
