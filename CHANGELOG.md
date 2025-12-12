# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Phase 1: Database & Core Models** (67% complete)
  - Complete database schema with 6 tables (worlds, entity_definitions, property_definitions, entity_definition_property_definitions, entities, relationships)
  - Branded ID types for type-safe identifiers (WorldId, EntityId, EntityDefinitionId, PropertyDefinitionId, RelationshipId)
  - Vector utility functions (l2Distance, cosineDistance, innerProduct, vector validation and normalization)
  - Comprehensive test coverage for type system (1,785 lines of tests)
  - Zod validation schemas for all domain types with extensive test coverage
  - PostgreSQL 17 with pgvector extension for native vector support
  - Docker Compose setup for local development with PostgreSQL

### Changed

- **BREAKING**: Migrated from libSQL to PostgreSQL 17 with pgvector extension
- Renamed `EntityType` to `EntityDefinition` for consistency with domain terminology

## [0.1.0] - 2025-12-12

### Added

- **Monorepo Structure**: npm workspaces with three packages (backend, frontend, shared)
- **Backend Package**: Express.js server with tRPC v10 API layer
  - Drizzle ORM with libSQL database client
  - Zod-validated environment configuration
  - Health check endpoint
  - CORS configuration
- **Frontend Package**: Vue 3 application with Vite
  - Vue Router with pages (Home, Worlds, WorldDetail)
  - TailwindCSS styling with PostCSS
  - tRPC client integration
  - TanStack Query for state management
  - Default layout component
- **Shared Package**: TypeScript types and Zod schemas
  - Domain types (World, Entity, EntityDefinition, Property, Template, Relationship)
  - API response types (ApiResponse, ApiError, PaginatedResponse)
  - Zod validation schemas for all domain types
- **Development Tooling**
  - ESLint 9 with flat config (TypeScript + Vue support)
  - Prettier for code formatting
  - Husky with lint-staged for pre-commit hooks
  - TypeScript strict mode across all packages
- **Environment Configuration**
  - Zod-based environment validation for backend
  - Type-safe Vite env config for frontend
  - `.env.example` files for both packages
- **Docker Setup**
  - Multi-stage production Dockerfile
  - Development Dockerfile with hot reload
  - docker-compose.yml for local development
  - Production profile for deployment

[Unreleased]: https://github.com/AerionDyseti/resonance/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AerionDyseti/resonance/releases/tag/v0.1.0
