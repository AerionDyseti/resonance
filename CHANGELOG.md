# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Phase 1: Database & Core Models (in progress)

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
  - Domain types (World, Entity, EntityType, Property, Template, Relationship)
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
