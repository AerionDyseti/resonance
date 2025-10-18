# Resonance

A flexible, AI-powered world building and tracking system for authors, dungeon masters, and creative worldbuilders.

## Overview

Resonance is a Notion-inspired world building platform that combines structured data ("Page Properties") with freeform markdown content ("Page Body"). Each world can define its own entity types, making it infinitely customizable for any setting.

## Key Features

- **Fully Customizable Schema**: Define your own entity types per world with custom properties
- **Mixin/Trait System**: Reusable property groups that can be composed together
- **Semantic Search**: AI-powered search using vector embeddings (Chroma)
- **Relationship Mapping**: Track and visualize connections between entities
- **Timeline Management**: Chronological consistency checking and event tracking
- **Campaign Tracking**: Session notes, world changes, and spoiler protection
- **MCP Integration**: Query your world through LLMs with natural language
- **Property References**: Use `{{property}}` in markdown to reference property values
- **Entity Transclusion**: Include content from other entities with `[[entity]]` syntax

## Architecture

### Core Components

- **Backend**: Python, FastAPI, Pydantic
- **Databases**:
  - Chroma (vector store for semantic search)
  - SQLite (metadata and schema definitions)
- **MCP Server**: Python MCP SDK for LLM integration
- **Frontend**: TBD (to be evaluated)

### Data Model

Each world contains:
- **Custom entity types** (e.g., Characters, Locations, Factions)
- **Mixins** (reusable property groups)
- **Entities** (instances with properties + markdown body)
- **Relationships** (typed connections between entities)
- **Campaigns** (snapshots and session tracking)

## Project Structure

```
resonance/
├── backend/              # Core backend application
│   ├── core/            # Database and configuration
│   ├── schema/          # Schema management and validation
│   ├── entities/        # Entity CRUD and processing
│   ├── relationships/   # Relationship management
│   ├── search/          # Search and filtering
│   ├── campaigns/       # Campaign and snapshot system
│   ├── timeline/        # Timeline management
│   ├── import_export/   # Data import/export
│   └── app.py          # FastAPI application
├── mcp_server/          # MCP server for LLM integration
│   ├── tools/          # MCP tool definitions
│   └── handlers/       # Request handlers
├── frontend/            # Web UI (TBD)
├── shared/             # Shared types and utilities
├── data/               # Sample data and templates
└── tests/              # Test suites
```

## Getting Started

### Prerequisites

- Python 3.11+
- pip or poetry for dependency management

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd resonance

# Install dependencies
pip install -r requirements.txt

# Run the backend
cd backend
uvicorn app:app --reload
```

### Running the MCP Server

```bash
cd mcp_server
python server.py
```

## Development Status

🚧 **Early Development** - This project is actively being built. See the implementation plan in the project documentation.

## License

TBD

## Contributing

TBD
