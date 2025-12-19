#!/usr/bin/env bun
/**
 * LotR Fandom Wiki Scraper
 *
 * Scrapes character, location, and organization data from the LotR Fandom wiki
 * and converts it to the test-data markdown format.
 *
 * Usage:
 *   bun run scripts/scrape-lotr-wiki.ts [--limit=100] [--type=characters]
 *
 * Options:
 *   --limit=N     Limit number of articles per category (default: no limit)
 *   --type=TYPE   Only scrape one type: characters, locations, or organizations
 *   --dry-run     Don't write files, just show what would be scraped
 */

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

// ==================== Configuration ====================

const BASE_URL = 'https://lotr.fandom.com/api.php';
const OUTPUT_DIR = 'test-data/lotr';
const RATE_LIMIT_MS = 200; // Be respectful to the wiki

// Categories to scrape
const CATEGORIES = {
  characters: [
    'Category:The Lord of the Rings characters',
    'Category:The Hobbit characters',
    'Category:The Silmarillion characters',
  ],
  locations: [
    'Category:Cities',
    'Category:Realms',
    'Category:Regions',
    'Category:Mountains',
    'Category:Rivers',
    'Category:Forests',
  ],
  organizations: [
    'Category:Groups',
    'Category:Races',
    'Category:Armies',
  ],
};

// Infobox templates to parse
const INFOBOX_PATTERNS = [
  /\{\{Infobox\s+([^|}]+)/gi,
  /\{\{Character\s+infobox/gi,
  /\{\{Location\s+infobox/gi,
];

// ==================== Types ====================

interface WikiPage {
  pageid: number;
  title: string;
  ns: number;
}

interface ParsedArticle {
  title: string;
  type: 'character' | 'location' | 'organization';
  infobox: Record<string, string>;
  summary: string;
  body: string;
  relationships: Array<{ type: string; target: string }>;
  wikiLinks: string[];
}

interface CategoryMembersResponse {
  query?: {
    categorymembers: WikiPage[];
  };
  continue?: {
    cmcontinue: string;
  };
}

interface ParseResponse {
  parse?: {
    title: string;
    wikitext: {
      '*': string;
    };
  };
}

// ==================== API Client ====================

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function getCategoryMembers(category: string, limit?: number): Promise<WikiPage[]> {
  const members: WikiPage[] = [];
  let continueToken: string | undefined;

  console.log(`  Fetching category: ${category}`);

  while (true) {
    const params = new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      cmlimit: '50',
      cmtype: 'page', // Only pages, not subcategories
      format: 'json',
    });

    if (continueToken) {
      params.set('cmcontinue', continueToken);
    }

    const url = `${BASE_URL}?${params}`;
    const data = await fetchJson<CategoryMembersResponse>(url);

    if (data.query?.categorymembers) {
      members.push(...data.query.categorymembers);
      process.stdout.write(`\r    Found ${members.length} pages...`);
    }

    if (limit && members.length >= limit) {
      console.log(`\n    Reached limit of ${limit}`);
      return members.slice(0, limit);
    }

    if (data.continue?.cmcontinue) {
      continueToken = data.continue.cmcontinue;
      await sleep(RATE_LIMIT_MS);
    } else {
      break;
    }
  }

  console.log(`\n    Total: ${members.length} pages`);
  return members;
}

async function getArticleWikitext(title: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'wikitext',
    format: 'json',
  });

  const url = `${BASE_URL}?${params}`;

  try {
    const data = await fetchJson<ParseResponse>(url);
    return data.parse?.wikitext?.['*'] || null;
  } catch (error) {
    console.warn(`    Warning: Failed to fetch "${title}": ${error}`);
    return null;
  }
}

// ==================== Parsing ====================

function parseInfobox(wikitext: string): Record<string, string> {
  const infobox: Record<string, string> = {};

  // Find infobox start
  const infoboxMatch = wikitext.match(/\{\{Infobox[^}]*\n([\s\S]*?)\n\}\}/i);
  if (!infoboxMatch) return infobox;

  const infoboxContent = infoboxMatch[1];

  // Parse key-value pairs
  const fieldRegex = /\|\s*([^=]+?)\s*=\s*([^\n|]*(?:\n(?!\|)[^\n|]*)*)/g;
  let match;

  while ((match = fieldRegex.exec(infoboxContent)) !== null) {
    const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
    let value = match[2].trim();

    // Clean up wiki markup
    value = cleanWikiText(value);

    if (value && value !== 'N/A' && value !== 'Unknown') {
      infobox[key] = value;
    }
  }

  return infobox;
}

function cleanWikiText(text: string): string {
  return (
    text
      // Remove file/image links
      .replace(/\[\[File:[^\]]+\]\]/gi, '')
      .replace(/\[\[Image:[^\]]+\]\]/gi, '')
      // Convert wiki links to just text: [[Link|Text]] -> Text, [[Link]] -> Link
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      // Remove templates like {{cite}}, {{ref}}, etc.
      .replace(/\{\{[^}]+\}\}/g, '')
      // Remove HTML tags
      .replace(/<[^>]+>/g, '')
      // Remove references
      .replace(/<ref[^>]*>.*?<\/ref>/gi, '')
      .replace(/<ref[^>]*\/>/gi, '')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function extractSummary(wikitext: string): string {
  // Get text after infobox, before first section
  const afterInfobox = wikitext.replace(/\{\{Infobox[\s\S]*?\}\}/i, '');
  const beforeSection = afterInfobox.split(/^==/m)[0];

  // Clean and truncate
  const cleaned = cleanWikiText(beforeSection);
  const sentences = cleaned.split(/(?<=[.!?])\s+/).slice(0, 3);
  return sentences.join(' ').slice(0, 500);
}

function extractWikiLinks(wikitext: string): string[] {
  const links: string[] = [];
  const linkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  let match;

  while ((match = linkRegex.exec(wikitext)) !== null) {
    const link = match[1].trim();
    // Skip file/image/category links
    if (
      !link.startsWith('File:') &&
      !link.startsWith('Image:') &&
      !link.startsWith('Category:')
    ) {
      links.push(link);
    }
  }

  return [...new Set(links)]; // Dedupe
}

function extractRelationships(
  infobox: Record<string, string>,
  wikiLinks: string[]
): Array<{ type: string; target: string }> {
  const relationships: Array<{ type: string; target: string }> = [];

  // Map infobox fields to relationship types
  const fieldMappings: Record<string, string> = {
    father: 'child_of',
    mother: 'child_of',
    spouse: 'married_to',
    siblings: 'sibling_of',
    children: 'parent_of',
    location: 'located_in',
    realm: 'part_of',
    realms: 'part_of',
    ruler: 'ruled_by',
    affiliation: 'affiliated_with',
    race: 'member_of',
    culture: 'member_of',
  };

  for (const [field, relType] of Object.entries(fieldMappings)) {
    if (infobox[field]) {
      // Split on common separators
      const targets = infobox[field].split(/[,;]|\band\b/i).map((t) => t.trim());
      for (const target of targets) {
        if (target && target.length > 1) {
          relationships.push({
            type: relType,
            target: slugify(target),
          });
        }
      }
    }
  }

  return relationships;
}

function wikitextToMarkdown(wikitext: string): string {
  // Remove infobox
  let text = wikitext.replace(/\{\{Infobox[\s\S]*?\}\}/i, '');

  // Convert headers
  text = text.replace(/^======\s*(.+?)\s*======$/gm, '###### $1');
  text = text.replace(/^=====\s*(.+?)\s*=====$/gm, '##### $1');
  text = text.replace(/^====\s*(.+?)\s*====$/gm, '#### $1');
  text = text.replace(/^===\s*(.+?)\s*===$/gm, '### $1');
  text = text.replace(/^==\s*(.+?)\s*==$/gm, '## $1');

  // Convert bold/italic
  text = text.replace(/'''([^']+)'''/g, '**$1**');
  text = text.replace(/''([^']+)''/g, '*$1*');

  // Convert links
  text = text.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  text = text.replace(/\[\[([^\]]+)\]\]/g, '$1');

  // Remove templates
  text = text.replace(/\{\{[^}]+\}\}/g, '');

  // Remove files/images
  text = text.replace(/\[\[File:[^\]]+\]\]/gi, '');
  text = text.replace(/\[\[Image:[^\]]+\]\]/gi, '');

  // Remove references
  text = text.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');
  text = text.replace(/<ref[^>]*\/>/gi, '');

  // Remove HTML
  text = text.replace(/<[^>]+>/g, '');

  // Clean up excessive newlines
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function parseArticle(
  title: string,
  wikitext: string,
  type: 'character' | 'location' | 'organization'
): ParsedArticle {
  const infobox = parseInfobox(wikitext);
  const summary = extractSummary(wikitext);
  const wikiLinks = extractWikiLinks(wikitext);
  const relationships = extractRelationships(infobox, wikiLinks);
  const body = wikitextToMarkdown(wikitext);

  return {
    title,
    type,
    infobox,
    summary,
    body,
    relationships,
    wikiLinks,
  };
}

// ==================== Output ====================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateId(type: string, title: string): string {
  const prefix = type === 'character' ? 'char' : type === 'location' ? 'loc' : 'org';
  return `${prefix}-lotr-${slugify(title)}`;
}

function articleToMarkdown(article: ParsedArticle): string {
  const id = generateId(article.type, article.title);
  const slug = slugify(article.title);

  // Build YAML frontmatter
  const frontmatter: Record<string, unknown> = {
    id,
    type: article.type,
    name: article.title,
    slug,
    summary: article.summary || `${article.title} from Middle-earth.`,
    source: 'lotr-fandom-wiki',
  };

  // Add relevant infobox properties
  if (Object.keys(article.infobox).length > 0) {
    frontmatter.properties = article.infobox;
  }

  // Add relationships
  if (article.relationships.length > 0) {
    frontmatter.relationships = article.relationships;
  }

  // Build markdown
  const yaml = toYaml(frontmatter);
  const content = `---\n${yaml}---\n\n# ${article.title}\n\n${article.body}`;

  return content;
}

function toYaml(obj: Record<string, unknown>, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          yaml += `${spaces}  -\n`;
          for (const [k, v] of Object.entries(item)) {
            yaml += `${spaces}    ${k}: ${formatYamlValue(v as string)}\n`;
          }
        } else {
          yaml += `${spaces}  - ${formatYamlValue(item as string)}\n`;
        }
      }
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n`;
      yaml += toYaml(value as Record<string, unknown>, indent + 1);
    } else {
      yaml += `${spaces}${key}: ${formatYamlValue(value as string)}\n`;
    }
  }

  return yaml;
}

function formatYamlValue(value: string | number | boolean): string {
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  // Quote strings that need it
  if (
    value.includes(':') ||
    value.includes('#') ||
    value.includes('\n') ||
    value.startsWith('"') ||
    value.startsWith("'")
  ) {
    return `"${value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
  }
  return value;
}

async function writeArticle(
  article: ParsedArticle,
  outputDir: string,
  dryRun: boolean
): Promise<void> {
  const typeDir = `${article.type}s`; // characters, locations, organizations
  const dir = join(outputDir, typeDir);
  const filename = `${slugify(article.title)}.md`;
  const filepath = join(dir, filename);

  const content = articleToMarkdown(article);

  if (dryRun) {
    console.log(`    Would write: ${filepath}`);
  } else {
    await mkdir(dir, { recursive: true });
    await writeFile(filepath, content, 'utf-8');
  }
}

// ==================== Main ====================

interface ScraperOptions {
  limit?: number;
  type?: 'characters' | 'locations' | 'organizations';
  dryRun?: boolean;
}

async function scrape(options: ScraperOptions = {}): Promise<void> {
  const { limit, type, dryRun = false } = options;

  console.log('\n=== LotR Fandom Wiki Scraper ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Limit per category: ${limit || 'none'}`);
  console.log(`Type filter: ${type || 'all'}`);
  console.log(`Dry run: ${dryRun}\n`);

  const typesToScrape = type ? [type] : (Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>);

  const stats = {
    total: 0,
    success: 0,
    failed: 0,
  };

  for (const entityType of typesToScrape) {
    console.log(`\n--- Scraping ${entityType} ---\n`);

    const categories = CATEGORIES[entityType];
    const allPages: WikiPage[] = [];
    const seenIds = new Set<number>();

    // Collect pages from all categories
    for (const category of categories) {
      const pages = await getCategoryMembers(category, limit);
      for (const page of pages) {
        if (!seenIds.has(page.pageid)) {
          seenIds.add(page.pageid);
          allPages.push(page);
        }
      }
      await sleep(RATE_LIMIT_MS);
    }

    console.log(`\n  Total unique pages: ${allPages.length}\n`);

    // Apply overall limit if set
    const pagesToProcess = limit ? allPages.slice(0, limit) : allPages;

    // Process each page
    for (let i = 0; i < pagesToProcess.length; i++) {
      const page = pagesToProcess[i];
      stats.total++;

      process.stdout.write(
        `\r  Processing ${i + 1}/${pagesToProcess.length}: ${page.title.slice(0, 40).padEnd(40)}`
      );

      try {
        const wikitext = await getArticleWikitext(page.title);
        if (!wikitext) {
          stats.failed++;
          continue;
        }

        const article = parseArticle(
          page.title,
          wikitext,
          entityType.slice(0, -1) as 'character' | 'location' | 'organization'
        );

        await writeArticle(article, OUTPUT_DIR, dryRun);
        stats.success++;
      } catch (error) {
        stats.failed++;
        console.warn(`\n    Error processing "${page.title}": ${error}`);
      }

      await sleep(RATE_LIMIT_MS);
    }

    console.log('\n');
  }

  console.log('\n=== Summary ===');
  console.log(`Total processed: ${stats.total}`);
  console.log(`Successful: ${stats.success}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`\nOutput: ${OUTPUT_DIR}/`);
}

// Parse CLI arguments
function parseArgs(): ScraperOptions {
  const args = process.argv.slice(2);
  const options: ScraperOptions = {};

  for (const arg of args) {
    if (arg.startsWith('--limit=')) {
      options.limit = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1] as 'characters' | 'locations' | 'organizations';
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

// Run
const options = parseArgs();
scrape(options).catch(console.error);
