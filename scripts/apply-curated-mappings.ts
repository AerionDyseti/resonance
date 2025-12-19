/**
 * Apply Curated Name Mappings
 *
 * Uses the hand-crafted mappings from curated-name-mappings.ts
 * to replace LotR names with semantically-similar alternatives.
 * Also transforms IDs and slugs to prevent LotR training data leakage.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { allMappings, idReplacementMap, type CuratedMapping } from './curated-name-mappings';

// ============================================================================
// Text Replacement Engine
// ============================================================================

class TextReplacer {
  private sortedMappings: CuratedMapping[];
  private idMap: Map<string, string>;

  constructor() {
    // Sort by length descending to replace longer matches first
    this.sortedMappings = [...allMappings].sort(
      (a, b) => b.original.length - a.original.length
    );
    this.idMap = idReplacementMap;
  }

  /**
   * Replace all known terms in text
   */
  replaceText(text: string): string {
    if (!text) return text;

    let result = text;

    for (const mapping of this.sortedMappings) {
      const { original, replacement } = mapping;

      // Skip very short terms that might cause issues
      if (original.length < 3) continue;

      // Handle possessive forms
      result = result.replace(
        new RegExp(`\\b${escapeRegex(original)}'s\\b`, 'g'),
        `${replacement}'s`
      );

      // Handle regular word boundaries
      result = result.replace(
        new RegExp(`\\b${escapeRegex(original)}\\b`, 'g'),
        replacement
      );
    }

    return result;
  }

  /**
   * Transform an ID by replacing known terms
   */
  replaceId(id: string): string {
    if (!id) return id;

    let result = id;

    // Sort by length descending
    const sortedEntries = Array.from(this.idMap.entries())
      .sort((a, b) => b[0].length - a[0].length);

    for (const [original, replacement] of sortedEntries) {
      if (original.length < 3) continue;
      // Replace in ID (which uses dashes)
      const regex = new RegExp(`(^|-)${escapeRegex(original)}(-|$)`, 'g');
      result = result.replace(regex, `$1${replacement}$2`);
    }

    return result;
  }

  /**
   * Get all mappings for export
   */
  getMappings(): CuratedMapping[] {
    return this.sortedMappings;
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================================
// File Processing
// ============================================================================

interface ParsedFile {
  frontmatter: string;
  body: string;
}

function parseMarkdownFile(content: string): ParsedFile | null {
  const match = content.match(/^(---\n[\s\S]*?\n---)\n([\s\S]*)$/);
  if (!match) return null;

  return {
    frontmatter: match[1],
    body: match[2],
  };
}

function processFile(content: string, replacer: TextReplacer): string {
  const parsed = parseMarkdownFile(content);
  if (!parsed) return replacer.replaceText(content);

  // Process frontmatter - need to be careful with structure
  let processedFrontmatter = parsed.frontmatter;

  // Replace IDs in frontmatter
  processedFrontmatter = processedFrontmatter.replace(
    /^(id:\s*)(.+)$/gm,
    (match, prefix, id) => `${prefix}${replacer.replaceId(id.trim())}`
  );

  // Replace slugs in frontmatter
  processedFrontmatter = processedFrontmatter.replace(
    /^(slug:\s*)(.+)$/gm,
    (match, prefix, slug) => `${prefix}${replacer.replaceId(slug.trim())}`
  );

  // Replace relationship targets
  processedFrontmatter = processedFrontmatter.replace(
    /^(\s*target:\s*)(.+)$/gm,
    (match, prefix, target) => `${prefix}${replacer.replaceId(target.trim())}`
  );

  // Replace text content in frontmatter (name, summary, etc.)
  processedFrontmatter = replacer.replaceText(processedFrontmatter);

  // Process body
  const processedBody = replacer.replaceText(parsed.body);

  return `${processedFrontmatter}\n${processedBody}`;
}

/**
 * Generate new filename from old filename using ID replacements
 */
function transformFilename(filename: string, replacer: TextReplacer): string {
  // Remove .md extension
  const slug = filename.replace(/\.md$/, '');
  const newSlug = replacer.replaceId(slug);
  return `${newSlug}.md`;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const inputDir = join(process.cwd(), 'test-data', 'world');
  const outputDir = join(process.cwd(), 'test-data', 'world-curated');

  console.log('='.repeat(60));
  console.log('Apply Curated Name Mappings');
  console.log('='.repeat(60));
  console.log(`Input: ${inputDir}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  const replacer = new TextReplacer();
  const mappings = replacer.getMappings();

  console.log(`Loaded ${mappings.length} curated mappings`);
  console.log(`ID mappings: ${idReplacementMap.size}`);

  console.log('\nSample text mappings:');
  console.log('  Species:');
  mappings.filter(m => m.category === 'species').slice(0, 5).forEach(m =>
    console.log(`    ${m.original} → ${m.replacement}`)
  );
  console.log('  Characters:');
  mappings.filter(m => m.category === 'character').slice(0, 5).forEach(m =>
    console.log(`    ${m.original} → ${m.replacement}`)
  );
  console.log('  Locations:');
  mappings.filter(m => m.category === 'location').slice(0, 5).forEach(m =>
    console.log(`    ${m.original} → ${m.replacement}`)
  );

  console.log('\nSample ID transformations:');
  const sampleIds = ['char-frodo-baggins', 'loc-mordor', 'loc-rivendell', 'org-fellowship-of-the-ring'];
  for (const id of sampleIds) {
    console.log(`  ${id} → ${replacer.replaceId(id)}`);
  }

  if (dryRun) {
    console.log('\n[DRY RUN] No files written');

    // Show a sample transformation
    const sampleFile = join(inputDir, 'characters', 'frodo-baggins.md');
    if (existsSync(sampleFile)) {
      console.log('\nSample transformation (frodo-baggins.md):');
      console.log('-'.repeat(40));
      const content = readFileSync(sampleFile, 'utf-8');
      const transformed = processFile(content, replacer);
      // Show first 60 lines
      console.log(transformed.split('\n').slice(0, 60).join('\n'));
      console.log('...');

      console.log('\nNew filename:', transformFilename('frodo-baggins.md', replacer));
    }

    return;
  }

  // Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Process all entity files
  console.log('\nProcessing files...');
  const entityTypes = ['characters', 'locations', 'organizations', 'artifacts', 'events'];

  let fileCount = 0;
  const filenameMap: Record<string, string> = {};

  for (const type of entityTypes) {
    const typeDir = join(inputDir, type);
    const outTypeDir = join(outputDir, type);

    if (!existsSync(typeDir)) continue;

    if (!existsSync(outTypeDir)) {
      mkdirSync(outTypeDir, { recursive: true });
    }

    const files = readdirSync(typeDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const inPath = join(typeDir, file);
      const newFilename = transformFilename(file, replacer);
      const outPath = join(outTypeDir, newFilename);

      const content = readFileSync(inPath, 'utf-8');
      const processed = processFile(content, replacer);

      writeFileSync(outPath, processed);

      if (file !== newFilename) {
        filenameMap[file] = newFilename;
      }

      fileCount++;

      if (fileCount % 100 === 0) {
        console.log(`  Processed ${fileCount} files...`);
      }
    }
  }

  console.log(`\nProcessed ${fileCount} files`);
  console.log(`Renamed ${Object.keys(filenameMap).length} files`);

  // Write mappings for reference
  const mappingsPath = join(outputDir, 'curated-mappings.json');
  writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2));
  console.log(`Mappings saved to: ${mappingsPath}`);

  // Write filename changes
  if (Object.keys(filenameMap).length > 0) {
    const filenameMapPath = join(outputDir, 'filename-changes.json');
    writeFileSync(filenameMapPath, JSON.stringify(filenameMap, null, 2));
    console.log(`Filename changes saved to: ${filenameMapPath}`);
  }

  console.log('\nDone!');
}

main().catch(console.error);
