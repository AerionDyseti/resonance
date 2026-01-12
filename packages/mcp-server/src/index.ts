#!/usr/bin/env bun
/**
 * AIRP MCP Server
 *
 * Memory system for AI-assisted solo roleplaying campaigns.
 * Provides tools for LLMs to query and persist world state.
 */

import { FastMCP } from 'fastmcp';
import { getDatabase, closeDatabase } from './db/index.js';
import { registerEntityTools } from './tools/entities.js';
import { registerConnectionTools } from './tools/connections.js';
import { registerSceneTools } from './tools/scenes.js';
import { registerSearchTools } from './tools/search.js';
import { registerResources } from './resources/index.js';

// Initialize database on startup
const db = getDatabase();

// Create MCP server
const server = new FastMCP({
  name: 'Resonance AIRP',
  version: '0.1.0',
  instructions: `You are connected to the Resonance AIRP memory system for AI-assisted solo roleplaying.

**Read the AIRP System Guide resource (airp://guide) for complete documentation on entity types, schema, and workflows.**

Quick reference:
- All entities belong to a Chronicle (campaign/setting) — scope queries by chronicleId
- Use search_entities for full-text search, find_by_name for quick lookups
- Use persist_entities for batch operations
- Check get_lookup_types before creating new type categories`,
});

// Register tool groups
registerEntityTools(server, db);
registerConnectionTools(server, db);
registerSceneTools(server, db);
registerSearchTools(server, db);

// Register resources (documentation)
registerResources(server);

// Handle shutdown gracefully
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

// Start the server
server.start({
  transportType: 'stdio',
});
