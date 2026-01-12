/**
 * MCP Resources for AIRP Server
 *
 * Static resources that provide documentation and context to LLMs.
 */

import type { FastMCP } from 'fastmcp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load the AIRP guide markdown content
 */
function loadGuideContent(): string {
  const guidePath = join(__dirname, 'airp-guide.md');
  return readFileSync(guidePath, 'utf-8');
}

/**
 * Register all resources with the MCP server
 */
export function registerResources(server: FastMCP): void {
  // Cache the guide content at startup
  const guideContent = loadGuideContent();

  server.addResource({
    uri: 'airp://guide',
    name: 'AIRP System Guide',
    description:
      'Comprehensive guide to the AIRP memory system: entity types, schema, workflow, and tool usage patterns.',
    mimeType: 'text/markdown',
    async load() {
      return { text: guideContent };
    },
  });
}
