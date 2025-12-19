#!/usr/bin/env bun
/**
 * Notion Export Converter
 *
 * Converts Notion export (CSV + MD files) into frontmatter markdown files
 * for use as test data in the Intelligence system.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';

// Configuration
const NOTION_EXPORT_DIR = join(import.meta.dir, '..', 'notion-export');
const OUTPUT_DIR = join(import.meta.dir, '..', 'test-data', 'world');

// Entity type configs
const ENTITY_CONFIGS = {
  characters: {
    sourceDir: 'Characters',
    csvPattern: /Characters DB.*_all\.csv$/,
    dbFolder: 'Characters DB',
    idPrefix: 'char',
    type: 'character',
  },
  locations: {
    sourceDir: 'Locations',
    csvPattern: /Locations DB.*_all\.csv$/,
    dbFolder: 'Locations DB',
    idPrefix: 'loc',
    type: 'location',
  },
  organizations: {
    sourceDir: 'Organizations',
    csvPattern: /Organizations DB.*_all\.csv$/,
    dbFolder: 'Organizations DB',
    idPrefix: 'org',
    type: 'organization',
  },
};

// Types
interface NotionEntity {
  name: string;
  notionId: string;
  properties: Record<string, string>;
  body: string;
  relationships: Array<{ type: string; targetNotionId: string; targetName: string }>;
}

interface ConvertedEntity {
  id: string;
  type: string;
  name: string;
  slug: string;
  summary: string;
  properties: Record<string, string>;
  relationships: Array<{ type: string; target: string }>;
  tags: string[];
  body: string;
}

// Global lookup maps
const notionIdToEntityId = new Map<string, string>();
const nameToEntityId = new Map<string, string>();

// Utility functions
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

function extractNotionId(text: string): string | null {
  // Match patterns like (https://www.notion.so/ID?pvs=21) or ID in filename
  const urlMatch = text.match(/notion\.so\/([a-f0-9]{32})/i);
  if (urlMatch) return urlMatch[1];

  const fileMatch = text.match(/([a-f0-9]{32})\.md$/i);
  if (fileMatch) return fileMatch[1];

  return null;
}

function extractNameFromLink(text: string): string {
  // Extract name from "Name (https://...)" pattern
  const match = text.match(/^([^(]+)\s*\(/);
  if (match) return match[1].trim();
  return text.trim();
}

function parseCSV(content: string): Array<Record<string, string>> {
  const lines = content.split('\n');
  if (lines.length < 2) return [];

  // Parse header (handle BOM)
  const headerLine = lines[0].replace(/^\uFEFF/, '');
  const headers = parseCSVLine(headerLine);

  const results: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const row: Record<string, string> = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || '';
    }

    results.push(row);
  }

  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function findCSVFile(dir: string, pattern: RegExp): string | null {
  const files = readdirSync(dir);
  const csvFile = files.find(f => pattern.test(f));
  return csvFile ? join(dir, csvFile) : null;
}

function findMDFile(dbFolder: string, name: string): string | null {
  if (!existsSync(dbFolder)) return null;

  const files = readdirSync(dbFolder);

  // Try exact name match first (with notion ID suffix)
  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = join(dbFolder, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) continue;

    // Check if filename starts with entity name
    const nameSlug = slugify(name);
    const fileSlug = slugify(file.replace(/\s+[a-f0-9]{32}\.md$/i, ''));

    if (fileSlug === nameSlug || file.toLowerCase().startsWith(name.toLowerCase().substring(0, 20))) {
      return filePath;
    }
  }

  return null;
}

function extractMDBody(content: string): { properties: Record<string, string>; body: string } {
  const lines = content.split('\n');
  const properties: Record<string, string> = {};
  let bodyStartIndex = 0;
  let foundHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip H1 header
    if (line.startsWith('# ') && !foundHeader) {
      foundHeader = true;
      continue;
    }

    // Parse property lines (Key: Value format)
    const propMatch = line.match(/^([A-Za-z][A-Za-z\s&]+):\s*(.+)$/);
    if (propMatch && foundHeader) {
      const key = propMatch[1].trim();
      const value = propMatch[2].trim();

      // Skip if this looks like body content
      if (key.length > 30 || line.startsWith('##')) {
        bodyStartIndex = i;
        break;
      }

      properties[key] = value;
      continue;
    }

    // If we hit an empty line or content after properties, start body
    if (foundHeader && (line.trim() === '' || line.startsWith('!') || line.startsWith('>') || line.startsWith('##'))) {
      bodyStartIndex = i;
      break;
    }
  }

  // Extract body content (skip image references and clean up)
  const bodyLines = lines.slice(bodyStartIndex);
  let body = bodyLines.join('\n').trim();

  // Remove image references like ![name](path)
  body = body.replace(/!\[.*?\]\([^)]+\)\n*/g, '');

  return { properties, body };
}

function inferRelationshipType(sourceType: string, targetType: string, propertyName: string): string {
  const propLower = propertyName.toLowerCase();

  if (propLower.includes('affiliation')) return 'affiliated_with';
  if (propLower.includes('headquarter')) return 'headquartered_at';
  if (propLower.includes('controlled by')) return 'controlled_by';
  if (propLower.includes('contains')) return 'contains';
  if (propLower.includes('part of')) return 'part_of';
  if (propLower.includes('notable character')) return 'has_member';
  if (propLower.includes('ancestry')) return 'has_ancestry';
  if (propLower.includes('campaign')) return 'appears_in_campaign';

  // Default based on types
  if (sourceType === 'character' && targetType === 'organization') return 'affiliated_with';
  if (sourceType === 'character' && targetType === 'location') return 'associated_with';
  if (sourceType === 'organization' && targetType === 'location') return 'located_in';
  if (sourceType === 'location' && targetType === 'location') return 'connected_to';

  return 'related_to';
}

function parseRelationshipLinks(value: string): Array<{ notionId: string; name: string }> {
  const results: Array<{ notionId: string; name: string }> = [];

  // Split by comma, but be careful with nested parens
  const parts = value.split(/,\s*(?=[A-Z]|[a-z])/);

  for (const part of parts) {
    const notionId = extractNotionId(part);
    const name = extractNameFromLink(part);

    if (notionId && name && name !== 'Untitled') {
      results.push({ notionId, name });
    }
  }

  return results;
}

function generateEntityId(prefix: string, name: string): string {
  return `${prefix}-${slugify(name)}`;
}

function serializeYAML(obj: Record<string, unknown>, indent = 0): string {
  const pad = '  '.repeat(indent);
  let result = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined || value === '') continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      result += `${pad}${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object') {
          result += `${pad}  -\n`;
          for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
            result += `${pad}    ${k}: ${v}\n`;
          }
        } else {
          result += `${pad}  - ${item}\n`;
        }
      }
    } else if (typeof value === 'object') {
      result += `${pad}${key}:\n`;
      result += serializeYAML(value as Record<string, unknown>, indent + 1);
    } else if (typeof value === 'string' && (value.includes('\n') || value.includes('"') || value.includes(':'))) {
      result += `${pad}${key}: "${value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`;
    } else {
      result += `${pad}${key}: ${value}\n`;
    }
  }

  return result;
}

function processEntityType(config: typeof ENTITY_CONFIGS.characters): ConvertedEntity[] {
  const sourceDir = join(NOTION_EXPORT_DIR, config.sourceDir);
  const dbFolder = join(sourceDir, config.dbFolder);

  console.log(`\nProcessing ${config.type}s from ${sourceDir}...`);

  // Find and parse CSV
  const csvPath = findCSVFile(sourceDir, config.csvPattern);
  if (!csvPath) {
    console.log(`  No CSV file found matching ${config.csvPattern}`);
    return [];
  }

  console.log(`  Found CSV: ${basename(csvPath)}`);
  const csvContent = readFileSync(csvPath, 'utf-8');
  const csvRows = parseCSV(csvContent);
  console.log(`  Parsed ${csvRows.length} rows from CSV`);

  const entities: ConvertedEntity[] = [];

  for (const row of csvRows) {
    const name = row['Name'] || row['Location Name'];
    if (!name || name === 'No content') continue;

    // Generate ID and register in lookup
    const entityId = generateEntityId(config.idPrefix, name);
    nameToEntityId.set(name.toLowerCase(), entityId);

    // Find matching MD file for body content
    let mdContent = '';
    let mdProperties: Record<string, string> = {};

    const mdPath = findMDFile(dbFolder, name);
    if (mdPath) {
      const rawContent = readFileSync(mdPath, 'utf-8');
      const parsed = extractMDBody(rawContent);
      mdContent = parsed.body;
      mdProperties = parsed.properties;

      // Extract Notion ID from filename
      const notionId = extractNotionId(mdPath);
      if (notionId) {
        notionIdToEntityId.set(notionId, entityId);
      }
    }

    // Build properties from CSV
    const properties: Record<string, string> = {};
    const relationships: Array<{ type: string; targetNotionId: string; targetName: string }> = [];
    const tags: string[] = [];

    for (const [key, value] of Object.entries(row)) {
      if (!value || value === 'No content') continue;

      const keyLower = key.toLowerCase();

      // Skip name field
      if (keyLower === 'name' || keyLower === 'location name') continue;

      // Handle tags
      if (keyLower === 'tags') {
        tags.push(...value.split(',').map(t => t.trim()).filter(Boolean));
        continue;
      }

      // Handle relationship fields
      if (value.includes('notion.so/')) {
        const links = parseRelationshipLinks(value);
        for (const link of links) {
          relationships.push({
            type: inferRelationshipType(config.type, 'unknown', key),
            targetNotionId: link.notionId,
            targetName: link.name,
          });
        }
        continue;
      }

      // Handle files & media (skip)
      if (keyLower.includes('files') || keyLower.includes('media')) continue;

      // Regular property
      properties[key] = value;
    }

    // Extract summary
    const summary = row['AI summary'] || row['Location Description'] || '';

    entities.push({
      id: entityId,
      type: config.type,
      name,
      slug: slugify(name),
      summary: summary.substring(0, 500),
      properties,
      relationships,
      tags,
      body: mdContent,
    });
  }

  console.log(`  Created ${entities.length} ${config.type} entities`);
  return entities;
}

function resolveRelationships(entities: ConvertedEntity[]): void {
  console.log('\nResolving relationships...');
  let resolved = 0;
  let unresolved = 0;

  for (const entity of entities) {
    const resolvedRels: Array<{ type: string; target: string }> = [];

    for (const rel of entity.relationships) {
      // Try to resolve by Notion ID first
      let targetId = notionIdToEntityId.get(rel.targetNotionId);

      // Fallback to name lookup
      if (!targetId) {
        targetId = nameToEntityId.get(rel.targetName.toLowerCase());
      }

      if (targetId) {
        resolvedRels.push({ type: rel.type, target: targetId });
        resolved++;
      } else {
        // Keep unresolved as name reference
        resolvedRels.push({ type: rel.type, target: `unresolved:${rel.targetName}` });
        unresolved++;
      }
    }

    entity.relationships = resolvedRels;
  }

  console.log(`  Resolved: ${resolved}, Unresolved: ${unresolved}`);
}

function writeEntity(entity: ConvertedEntity, outputDir: string): void {
  const frontmatter: Record<string, unknown> = {
    id: entity.id,
    type: entity.type,
    name: entity.name,
    slug: entity.slug,
  };

  if (entity.summary) {
    frontmatter.summary = entity.summary;
  }

  if (Object.keys(entity.properties).length > 0) {
    frontmatter.properties = entity.properties;
  }

  // Filter out unresolved relationships for cleaner output
  const validRels = entity.relationships.filter(r => !r.target.startsWith('unresolved:'));
  if (validRels.length > 0) {
    frontmatter.relationships = validRels;
  }

  if (entity.tags.length > 0) {
    frontmatter.tags = entity.tags;
  }

  const content = `---
${serializeYAML(frontmatter).trim()}
---

# ${entity.name}

${entity.body || '*No detailed content available.*'}
`;

  const filename = `${entity.slug}.md`;
  const outputPath = join(outputDir, filename);
  writeFileSync(outputPath, content);
}

async function main() {
  console.log('Notion Export Converter');
  console.log('=======================\n');
  console.log(`Source: ${NOTION_EXPORT_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);

  // Process all entity types
  const allEntities: ConvertedEntity[] = [];

  for (const [key, config] of Object.entries(ENTITY_CONFIGS)) {
    const entities = processEntityType(config);
    allEntities.push(...entities);
  }

  // Resolve cross-entity relationships
  resolveRelationships(allEntities);

  // Write output files
  console.log('\nWriting output files...');

  for (const entity of allEntities) {
    const typeDir = join(OUTPUT_DIR, `${entity.type}s`);
    writeEntity(entity, typeDir);
  }

  // Summary
  console.log('\n=== Summary ===');
  const byType = allEntities.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}s: ${count}`);
  }
  console.log(`  Total: ${allEntities.length}`);

  console.log('\nDone!');
}

main().catch(console.error);
