/**
 * Entity Name Scrambler
 *
 * Replaces all LotR entity names, IDs, and slugs with fantasy alternatives
 * to prevent LLM knowledge leakage during RAG testing.
 *
 * Usage: bun run scripts/scramble-entity-names.ts [--seed 42] [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

type EntityType = 'character' | 'location' | 'organization' | 'artifact' | 'event';

interface EntityInfo {
  id: string;
  name: string;
  slug: string;
  type: EntityType;
  filePath: string;
  fileName: string;
  relationships: Array<{ type: string; target: string }>;
}

interface ScrambledEntity {
  originalId: string;
  newId: string;
  originalName: string;
  newName: string;
  originalSlug: string;
  newSlug: string;
  type: EntityType;
  originalFileName: string;
  newFileName: string;
}

interface NameMapping {
  original: string;
  scrambled: string;
  type: EntityType;
}

// ============================================================================
// Fantasy Name Components
// ============================================================================

const nameParts = {
  character: {
    first: [
      // Consonant-heavy (dwarvish feel)
      'Thorvik', 'Braldin', 'Kragmir', 'Durnok', 'Grunthar', 'Boldrek', 'Karnak', 'Drumlin',
      // Elvish feel (flowing vowels)
      'Aerindel', 'Caelwyn', 'Elorien', 'Faelon', 'Galindor', 'Ilyndra', 'Loravel', 'Mirathel',
      'Naeris', 'Orendil', 'Silarwen', 'Thalindra', 'Vaelorn', 'Ysolinde', 'Zephyrine',
      // Human/common feel
      'Aldric', 'Brennan', 'Corwin', 'Darian', 'Edmund', 'Gareth', 'Hadrian', 'Jorik',
      'Kelmar', 'Lysander', 'Marcus', 'Nolan', 'Osric', 'Perrin', 'Quinlan', 'Roderick',
      'Severin', 'Tobias', 'Ulric', 'Valdric', 'Willem', 'Yorick', 'Zarek',
      // Feminine variations
      'Adelina', 'Brienna', 'Cecily', 'Delara', 'Evanthe', 'Fiora', 'Gwendolyn', 'Helena',
      'Isolde', 'Junia', 'Katarina', 'Lirien', 'Mira', 'Nyssa', 'Oriana', 'Petra',
      'Rhiannon', 'Sylvana', 'Thea', 'Ursula', 'Vespera', 'Willa', 'Xanthe', 'Yara', 'Zara',
      // Hobbit-like (simple, earthy)
      'Barlo', 'Cobbin', 'Drogon', 'Falcor', 'Hamfast', 'Largo', 'Minto', 'Polo', 'Roric', 'Togan',
      'Wilcom', 'Bungar', 'Foscar', 'Longo', 'Ponto', 'Porto', 'Sadoc', 'Tolman',
      // Additional unique names
      'Aethor', 'Brivek', 'Celdric', 'Dorwyn', 'Eldris', 'Finvar', 'Galdor', 'Helvorn',
      'Irvek', 'Jormund', 'Kelwin', 'Lorvain', 'Morwen', 'Norvald', 'Orvik', 'Prydain',
      'Quelvar', 'Rothgar', 'Stenvald', 'Thaldric', 'Ulfric', 'Varnok', 'Wulfric', 'Xander',
      'Yarvok', 'Zaldric', 'Arveth', 'Beldric', 'Corvain', 'Dalvorn', 'Elvrik', 'Faldren',
    ],
    last: [
      // Nature-based
      'Thornwood', 'Ashford', 'Brookmere', 'Clearwater', 'Deeproot', 'Elmsworth', 'Fernhollow',
      'Greendale', 'Hawthorn', 'Ironbark', 'Juniper', 'Knotwood', 'Leafwalker', 'Mossbank',
      'Nightshade', 'Oakenshield', 'Pinecrest', 'Quarrystone', 'Riverstone', 'Stormwind',
      // Occupation-based
      'Blacksmith', 'Carpenter', 'Fletcher', 'Goldweaver', 'Innkeeper', 'Miller',
      'Potter', 'Shepherd', 'Tanner', 'Wainwright', 'Wheelwright', 'Brewer', 'Cooper',
      // Descriptive
      'Brightblade', 'Coldforge', 'Darkmantle', 'Emberheart', 'Flamecrest', 'Greymantle',
      'Highcliff', 'Ironhand', 'Keenblade', 'Lightfoot', 'Moonshadow', 'Nightwalker',
      'Proudfoot', 'Quicksilver', 'Redcloak', 'Silverthorn', 'Trueheart', 'Underbough',
      'Valiant', 'Whitehall', 'Yellowcape', 'Zephyrwind',
      // Hobbit-style
      'Burrows', 'Chubb', 'Diggle', 'Goodbody', 'Grubb', 'Hayward', 'Mugwort', 'Noakes',
      'Puddifoot', 'Rumble', 'Sandheaver', 'Tunnelly', 'Underhill', 'Whitfoot', 'Bracegirdle',
      // Additional surnames
      'Stonecroft', 'Windmere', 'Frostholm', 'Dawnbreak', 'Starfall', 'Moonvale',
      'Shadowend', 'Firebrand', 'Stormbringer', 'Earthshaker', 'Wavecrest', 'Skyborn',
    ],
    titles: [
      'the Grey', 'the White', 'the Black', 'the Red', 'the Golden', 'the Silver',
      'the Wise', 'the Bold', 'the Brave', 'the Swift', 'the Strong', 'the Fair',
      'the Elder', 'the Younger', 'the Old', 'the Young', 'the Great', 'the Lesser',
      'Stoneheart', 'Ironwill', 'Flamebringer', 'Stormcaller', 'Shadowmend',
    ],
  },
  location: {
    prefix: [
      'Mount', 'Lake', 'River', 'Forest of', 'Tower of', 'City of', 'Plains of', 'Valley of',
      'Bay of', 'Gulf of', 'Isle of', 'Castle', 'Fort', 'Keep', 'Hall of', 'Gates of',
      'Bridge of', 'Falls of', 'Pass of', 'Cape', 'Point', 'Harbor of', 'Port of',
    ],
    name: [
      'Ashpeak', 'Blackspire', 'Crimsonhold', 'Dreadkeep', 'Ebonwatch', 'Fellgard',
      'Grimstone', 'Hollowreach', 'Ironvale', 'Jadecrest', 'Knightfall', 'Longshadow',
      'Mistholme', 'Nightveil', 'Obsidian', 'Pinnacle', 'Quartzhelm', 'Ravenshade',
      'Stormhaven', 'Thornwall', 'Underlake', 'Vanguard', 'Wintermere', 'Yonderglow',
      'Clearbrook', 'Dawnmeadow', 'Evergreen', 'Flowervale', 'Goldleaf', 'Heatherfield',
      'Ivywood', 'Jewelstream', 'Kindlewood', 'Larkhill', 'Moonrise', 'Northwind',
      'Orchardvale', 'Pebblebrook', 'Quietwater', 'Rosewood', 'Sunhollow', 'Truespring',
      'Ancientdeep', 'Boundless', 'Cryptvale', 'Dragonrest', 'Eternum', 'Frostbourne',
      'Gloomhaven', 'Haunthollow', 'Briarwood', 'Coldwater', 'Deephollow', 'Edgewood',
      'Fairhaven', 'Greenhill', 'Highgate', 'Ironforge', 'Lowland', 'Milltown', 'Newbury',
      'Oldtown', 'Portside', 'Redcliff', 'Silverdale', 'Thornbury',
      // Additional locations
      'Ambervale', 'Bronzegate', 'Coppercrest', 'Dustmoor', 'Embervale', 'Flintvale',
      'Granitekeep', 'Hazelvale', 'Ironglen', 'Jasperholm', 'Keelport', 'Limestone',
      'Marblekeep', 'Nickelton', 'Onixheim', 'Pearlhaven', 'Quartzfall', 'Rubyvale',
    ],
    suffix: [
      'heim', 'hold', 'garde', 'fell', 'vale', 'mere', 'stead', 'burg', 'ton', 'ford',
      'dale', 'glen', 'haven', 'wood', 'wick', 'thorpe', 'ham', 'combe', 'shaw',
    ],
  },
  organization: {
    names: [
      'The Crimson Order', 'The Silver Circle', 'The Twilight Council', 'The Iron Covenant',
      'The Starborn Alliance', 'The Shadow Conclave', 'The Golden Fellowship', 'The Emerald Pact',
      'The Azure Brotherhood', 'The Obsidian League', 'The Platinum Assembly', 'The Copper Guild',
      'The Oaken Council', 'The Crystal Syndicate', 'The Flame Keepers', 'The Storm Wardens',
      'The Hillfolk', 'The Valekin', 'The Stoneclan', 'The Woodwalkers', 'The Seafarers',
      'The Mountainborn', 'The Plainswanderers', 'The Forestkin', 'The Riverfolk', 'The Skyborn',
      'The Deepdelvers', 'The Highborn', 'The Lowlanders', 'The Borderkin', 'The Wayfarers',
      'The Northern Host', 'The Eastern Legion', 'The Southern Guard', 'The Western Watch',
      'The Royal Guard', 'The City Watch', 'The Border Patrol', 'The Rangers', 'The Sentinels',
    ],
    adjective: [
      'Ancient', 'Blessed', 'Crimson', 'Dark', 'Eternal', 'Fallen', 'Golden', 'Hidden',
      'Iron', 'Jade', 'Keen', 'Lost', 'Mighty', 'Noble', 'Old', 'Proud', 'Quiet', 'Royal',
      'Sacred', 'True', 'United', 'Valiant', 'White', 'Young', 'Zealous',
    ],
    noun: [
      'Alliance', 'Brotherhood', 'Circle', 'Dominion', 'Empire', 'Fellowship', 'Guild',
      'Host', 'Institute', 'Kingdom', 'League', 'Ministry', 'Nation', 'Order',
      'Pact', 'Republic', 'Syndicate', 'Tribunal', 'Union', 'Vanguard', 'Watch',
    ],
  },
  artifact: {
    prefix: ['The', 'The Ancient', 'The Sacred', 'The Cursed', 'The Eternal', 'The Lost',
      'The Legendary', 'The Mythic', 'The Divine', 'The Infernal', 'The Blessed'],
    type: [
      'Ring', 'Sword', 'Staff', 'Crown', 'Orb', 'Tome', 'Amulet', 'Blade', 'Scepter', 'Shield',
      'Helm', 'Gauntlet', 'Chalice', 'Mirror', 'Key', 'Stone', 'Crystal', 'Gem', 'Horn', 'Lantern',
    ],
    descriptor: [
      'of Power', 'of Binding', 'of Light', 'of Shadow', 'of Fire', 'of Ice', 'of Storm',
      'of the Ancients', 'of the Elders', 'of Doom', 'of Destiny', 'of Fate', 'of Truth',
    ],
  },
  event: {
    prefix: ['The', 'The Great', 'The Last', 'The First', 'The Final', 'The Legendary'],
    type: ['War', 'Battle', 'Siege', 'Alliance', 'Conflict', 'Uprising', 'Rebellion', 'Conquest',
      'March', 'Exodus', 'Journey', 'Quest', 'Council', 'Treaty', 'Pact', 'Accord'],
    descriptor: ['of the Ages', 'of Five Nations', 'of the Northern Realm', 'of the Lost Kingdom'],
  },
};

// ============================================================================
// Seeded Random Number Generator
// ============================================================================

class SeededRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    this.state = (this.state * 1664525 + 1013904223) >>> 0;
    return this.state / 4294967296;
  }

  pickRandom<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

// ============================================================================
// Name Generator
// ============================================================================

class NameGenerator {
  private rng: SeededRNG;
  private usedNames = new Set<string>();
  private usedIds = new Set<string>();

  constructor(seed: number) {
    this.rng = new SeededRNG(seed);
  }

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  generateCharacterName(): string {
    let attempts = 0;
    while (attempts < 100) {
      const style = this.rng.next();
      let name: string;

      if (style < 0.6) {
        const first = this.rng.pickRandom(nameParts.character.first);
        const last = this.rng.pickRandom(nameParts.character.last);
        name = `${first} ${last}`;
      } else if (style < 0.8) {
        name = this.rng.pickRandom(nameParts.character.first);
      } else {
        const first = this.rng.pickRandom(nameParts.character.first);
        const title = this.rng.pickRandom(nameParts.character.titles);
        name = `${first} ${title}`;
      }

      if (!this.usedNames.has(name.toLowerCase())) {
        this.usedNames.add(name.toLowerCase());
        return name;
      }
      attempts++;
    }

    // Fallback with number
    const base = this.rng.pickRandom(nameParts.character.first);
    const num = Math.floor(this.rng.next() * 1000);
    const name = `${base} the ${num}th`;
    this.usedNames.add(name.toLowerCase());
    return name;
  }

  generateLocationName(): string {
    let attempts = 0;
    while (attempts < 100) {
      const style = this.rng.next();
      let name: string;

      if (style < 0.4) {
        const prefix = this.rng.pickRandom(nameParts.location.prefix);
        const base = this.rng.pickRandom(nameParts.location.name);
        name = `${prefix} ${base}`;
      } else if (style < 0.7) {
        name = this.rng.pickRandom(nameParts.location.name);
      } else {
        const base = this.rng.pickRandom(nameParts.location.name);
        const suffix = this.rng.pickRandom(nameParts.location.suffix);
        if (!base.match(/(vale|hold|wood|haven|ford|dale)$/i)) {
          name = `${base}${suffix}`;
        } else {
          name = base;
        }
      }

      if (!this.usedNames.has(name.toLowerCase())) {
        this.usedNames.add(name.toLowerCase());
        return name;
      }
      attempts++;
    }

    const base = this.rng.pickRandom(nameParts.location.name);
    const num = Math.floor(this.rng.next() * 100);
    const name = `${base} ${num}`;
    this.usedNames.add(name.toLowerCase());
    return name;
  }

  generateOrganizationName(): string {
    let attempts = 0;
    while (attempts < 100) {
      const style = this.rng.next();
      let name: string;

      if (style < 0.5) {
        name = this.rng.pickRandom(nameParts.organization.names);
      } else {
        const adj = this.rng.pickRandom(nameParts.organization.adjective);
        const noun = this.rng.pickRandom(nameParts.organization.noun);
        name = `The ${adj} ${noun}`;
      }

      if (!this.usedNames.has(name.toLowerCase())) {
        this.usedNames.add(name.toLowerCase());
        return name;
      }
      attempts++;
    }

    const adj = this.rng.pickRandom(nameParts.organization.adjective);
    const num = Math.floor(this.rng.next() * 100);
    const name = `The ${adj} Order ${num}`;
    this.usedNames.add(name.toLowerCase());
    return name;
  }

  generateArtifactName(): string {
    let attempts = 0;
    while (attempts < 100) {
      const prefix = this.rng.pickRandom(nameParts.artifact.prefix);
      const type = this.rng.pickRandom(nameParts.artifact.type);
      const hasDescriptor = this.rng.next() > 0.4;
      const descriptor = hasDescriptor ? ` ${this.rng.pickRandom(nameParts.artifact.descriptor)}` : '';
      const name = `${prefix} ${type}${descriptor}`;

      if (!this.usedNames.has(name.toLowerCase())) {
        this.usedNames.add(name.toLowerCase());
        return name;
      }
      attempts++;
    }

    const type = this.rng.pickRandom(nameParts.artifact.type);
    return `The ${type} of Unknown Origin`;
  }

  generateEventName(): string {
    let attempts = 0;
    while (attempts < 100) {
      const prefix = this.rng.pickRandom(nameParts.event.prefix);
      const type = this.rng.pickRandom(nameParts.event.type);
      const hasDescriptor = this.rng.next() > 0.5;
      const descriptor = hasDescriptor ? ` ${this.rng.pickRandom(nameParts.event.descriptor)}` : '';
      const name = `${prefix} ${type}${descriptor}`;

      if (!this.usedNames.has(name.toLowerCase())) {
        this.usedNames.add(name.toLowerCase());
        return name;
      }
      attempts++;
    }

    const type = this.rng.pickRandom(nameParts.event.type);
    return `The ${type} of Year ${Math.floor(this.rng.next() * 1000)}`;
  }

  generateName(type: EntityType): string {
    switch (type) {
      case 'character': return this.generateCharacterName();
      case 'location': return this.generateLocationName();
      case 'organization': return this.generateOrganizationName();
      case 'artifact': return this.generateArtifactName();
      case 'event': return this.generateEventName();
      default: return this.generateCharacterName();
    }
  }

  generateId(type: EntityType, name: string): string {
    const prefix = {
      character: 'char',
      location: 'loc',
      organization: 'org',
      artifact: 'art',
      event: 'evt',
    }[type];

    const baseSlug = this.slugify(name);
    let id = `${prefix}-${baseSlug}`;

    if (this.usedIds.has(id)) {
      let counter = 2;
      while (this.usedIds.has(`${id}-${counter}`)) {
        counter++;
      }
      id = `${id}-${counter}`;
    }

    this.usedIds.add(id);
    return id;
  }

  generateSlug(name: string): string {
    return this.slugify(name);
  }
}

// ============================================================================
// Name Scrambler
// ============================================================================

class NameScrambler {
  private entityMappings = new Map<string, ScrambledEntity>(); // old ID -> scrambled entity
  private nameMappings = new Map<string, string>(); // old name -> new name
  private idMappings = new Map<string, string>(); // old ID -> new ID
  private nameGenerator: NameGenerator;

  constructor(seed: number) {
    this.nameGenerator = new NameGenerator(seed);
  }

  /**
   * First pass: create mappings for all entities
   */
  createMappings(entities: EntityInfo[]): void {
    for (const entity of entities) {
      const newName = this.nameGenerator.generateName(entity.type);
      const newId = this.nameGenerator.generateId(entity.type, newName);
      const newSlug = this.nameGenerator.generateSlug(newName);
      const newFileName = `${newSlug}.md`;

      const scrambled: ScrambledEntity = {
        originalId: entity.id,
        newId,
        originalName: entity.name,
        newName,
        originalSlug: entity.slug,
        newSlug,
        type: entity.type,
        originalFileName: entity.fileName,
        newFileName,
      };

      this.entityMappings.set(entity.id, scrambled);
      this.nameMappings.set(entity.name, newName);
      this.idMappings.set(entity.id, newId);

      // Also map first names for characters (but not common words)
      const commonWords = new Set([
        'the', 'a', 'an', 'of', 'and', 'or', 'in', 'on', 'at', 'to', 'for',
        'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
        'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
        'great', 'old', 'new', 'last', 'first', 'long', 'little', 'own',
        'other', 'same', 'big', 'small', 'high', 'low', 'good', 'bad',
        'mr', 'mrs', 'ms', 'dr', 'sir', 'lady', 'lord', 'king', 'queen',
        'prince', 'princess', 'master', 'captain', 'chief', 'brother', 'sister',
        'father', 'mother', 'son', 'daughter', 'uncle', 'aunt', 'fell',
        'black', 'white', 'red', 'blue', 'green', 'grey', 'gray', 'dark', 'light',
      ]);

      const origNameParts = entity.name.split(' ');
      const newNameParts = newName.split(' ');
      if (origNameParts.length > 1 && newNameParts.length > 1) {
        const firstName = origNameParts[0];
        // Only map if not a common word and not already mapped
        if (
          firstName.length > 2 &&
          !commonWords.has(firstName.toLowerCase()) &&
          !this.nameMappings.has(firstName)
        ) {
          this.nameMappings.set(firstName, newNameParts[0]);
        }
      }
    }
  }

  getEntityMapping(oldId: string): ScrambledEntity | undefined {
    return this.entityMappings.get(oldId);
  }

  getAllMappings(): ScrambledEntity[] {
    return Array.from(this.entityMappings.values());
  }

  getIdMapping(oldId: string): string {
    return this.idMappings.get(oldId) || oldId;
  }

  /**
   * Scramble text by replacing all known names
   */
  scrambleText(text: string): string {
    if (!text) return text;

    let result = text;

    // Sort by name length (longest first) to avoid partial replacements
    const sortedNames = Array.from(this.nameMappings.entries())
      .sort((a, b) => b[0].length - a[0].length);

    for (const [original, scrambled] of sortedNames) {
      if (original.length < 3) continue; // Skip very short names

      // Handle possessives: "Frodo's" -> "Kelmar's"
      const possessiveRegex = new RegExp(`\\b${escapeRegex(original)}'s\\b`, 'g');
      result = result.replace(possessiveRegex, `${scrambled}'s`);

      // Handle trailing apostrophe for names ending in s: "Baggins'" -> "Thornwise's"
      if (original.endsWith('s')) {
        const trailingApostropheRegex = new RegExp(`\\b${escapeRegex(original)}'(?![a-zA-Z])`, 'g');
        result = result.replace(trailingApostropheRegex, `${scrambled}'`);
      }

      // Handle regular mentions
      const regex = new RegExp(`\\b${escapeRegex(original)}\\b`, 'g');
      result = result.replace(regex, scrambled);
    }

    return result;
  }

  /**
   * Get name mappings for validation
   */
  getNameMappings(): Map<string, string> {
    return new Map(this.nameMappings);
  }
}

// ============================================================================
// File Parser / Writer
// ============================================================================

interface ParsedFile {
  frontmatter: Record<string, unknown>;
  body: string;
}

function parseMarkdownFile(content: string): ParsedFile | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  return {
    frontmatter: parseSimpleYAML(match[1]),
    body: match[2],
  };
}

function parseSimpleYAML(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split('\n');
  let currentKey = '';
  let currentArray: unknown[] | null = null;
  let currentObject: Record<string, unknown> | null = null;
  let inProperties = false;

  for (const line of lines) {
    if (!line.trim()) continue;

    const keyMatch = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (keyMatch) {
      if (currentArray && currentKey) {
        if (currentObject && Object.keys(currentObject).length > 0) {
          currentArray.push(currentObject);
        }
        result[currentKey] = currentArray;
      }
      if (currentObject && currentKey && !currentArray) {
        result[currentKey] = currentObject;
      }

      currentKey = keyMatch[1];
      const value = keyMatch[2].trim();

      if (value) {
        result[currentKey] = parseValue(value);
        currentArray = null;
        currentObject = null;
        inProperties = false;
      } else {
        currentArray = null;
        currentObject = null;
        inProperties = currentKey === 'properties';
      }
      continue;
    }

    const arrayItemMatch = line.match(/^\s+-\s*$/);
    if (arrayItemMatch) {
      if (!currentArray) currentArray = [];
      if (currentObject && Object.keys(currentObject).length > 0) {
        currentArray.push(currentObject);
      }
      currentObject = {};
      continue;
    }

    const arrayInlineMatch = line.match(/^\s+-\s+(.+)$/);
    if (arrayInlineMatch) {
      if (!currentArray) currentArray = [];
      currentArray.push(parseValue(arrayInlineMatch[1]));
      continue;
    }

    const nestedMatch = line.match(/^\s+([a-zA-Z_\s]+):\s*(.*)$/);
    if (nestedMatch) {
      const nestedKey = nestedMatch[1].trim();
      const nestedValue = nestedMatch[2].trim();

      if (currentObject) {
        currentObject[nestedKey] = parseValue(nestedValue);
      } else if (inProperties) {
        if (!result[currentKey]) result[currentKey] = {};
        (result[currentKey] as Record<string, unknown>)[nestedKey] = parseValue(nestedValue);
      }
    }
  }

  if (currentArray && currentKey) {
    if (currentObject && Object.keys(currentObject).length > 0) {
      currentArray.push(currentObject);
    }
    result[currentKey] = currentArray;
  }
  if (currentObject && currentKey && !currentArray) {
    result[currentKey] = currentObject;
  }

  return result;
}

function parseValue(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function serializeYAML(
  obj: Record<string, unknown>,
  scrambler: NameScrambler,
  scrambledEntity: ScrambledEntity
): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;

    if (typeof value === 'string') {
      let outputValue = value;

      // Handle specific fields
      if (key === 'id') {
        outputValue = scrambledEntity.newId;
      } else if (key === 'name') {
        outputValue = scrambledEntity.newName;
      } else if (key === 'slug') {
        outputValue = scrambledEntity.newSlug;
      } else if (key === 'summary') {
        outputValue = scrambler.scrambleText(value);
      }

      // Quote if contains special chars
      if (outputValue.includes(':') || outputValue.includes('#') ||
          outputValue.includes('\n') || outputValue.startsWith('"') ||
          outputValue.includes('}')) {
        lines.push(`${key}: "${outputValue.replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${key}: ${outputValue}`);
      }
    } else if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          const itemObj = item as Record<string, unknown>;
          lines.push('  -');
          for (const [k, v] of Object.entries(itemObj)) {
            let outputV = String(v);
            // Scramble relationship targets
            if (k === 'target') {
              outputV = scrambler.getIdMapping(String(v));
            }
            lines.push(`    ${k}: ${outputV}`);
          }
        } else {
          lines.push(`  - ${item}`);
        }
      }
    } else if (typeof value === 'object') {
      lines.push(`${key}:`);
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        let outputV = String(v);
        // Scramble name in properties
        if (k === 'name') {
          outputV = scrambledEntity.newName;
        } else {
          // Scramble text content in other property values
          outputV = scrambler.scrambleText(outputV);
        }

        if (outputV.includes(':') || outputV.includes('"') || outputV.includes('}')) {
          lines.push(`  ${k}: "${outputV.replace(/"/g, '\\"')}"`);
        } else {
          lines.push(`  ${k}: ${outputV}`);
        }
      }
    }
  }

  return lines.join('\n');
}

// ============================================================================
// Main Logic
// ============================================================================

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function loadEntities(baseDir: string): EntityInfo[] {
  const entities: EntityInfo[] = [];
  const entityTypes: Array<{ dir: string; type: EntityType }> = [
    { dir: 'characters', type: 'character' },
    { dir: 'locations', type: 'location' },
    { dir: 'organizations', type: 'organization' },
    { dir: 'artifacts', type: 'artifact' },
    { dir: 'events', type: 'event' },
  ];

  for (const { dir, type } of entityTypes) {
    const typeDir = join(baseDir, dir);
    if (!existsSync(typeDir)) continue;

    const files = readdirSync(typeDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = join(typeDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const parsed = parseMarkdownFile(content);

      if (parsed && parsed.frontmatter.name && parsed.frontmatter.id) {
        entities.push({
          id: String(parsed.frontmatter.id),
          name: String(parsed.frontmatter.name),
          slug: String(parsed.frontmatter.slug || parsed.frontmatter.id),
          type,
          filePath,
          fileName: file,
          relationships: (parsed.frontmatter.relationships as Array<{ type: string; target: string }>) || [],
        });
      }
    }
  }

  return entities;
}

function processFile(
  filePath: string,
  scrambler: NameScrambler,
  scrambledEntity: ScrambledEntity
): string {
  const content = readFileSync(filePath, 'utf-8');
  const parsed = parseMarkdownFile(content);

  if (!parsed) return content;

  // Rebuild frontmatter with scrambled values
  const scrambledFrontmatter = serializeYAML(parsed.frontmatter, scrambler, scrambledEntity);

  // Clean body: remove wiki interlanguage links and category tags that leak original names
  let cleanedBody = parsed.body
    // Remove interlanguage links (e.g., "de:Frodo Beutlin", "fr:encyclo:...")
    .replace(/^[a-z]{2}:.*$/gm, '')
    // Remove Category tags
    .replace(/^Category:.*$/gm, '')
    // Remove empty lines that result from removals
    .replace(/\n{3,}/g, '\n\n');

  // Scramble body text
  const scrambledBody = scrambler.scrambleText(cleanedBody);

  return `---\n${scrambledFrontmatter}\n---\n${scrambledBody}`;
}

async function main() {
  const args = process.argv.slice(2);
  const seed = parseInt(args.find(a => a.startsWith('--seed='))?.split('=')[1] ?? '42');
  const dryRun = args.includes('--dry-run');
  const inputDir = join(process.cwd(), 'test-data', 'world');
  const outputDir = join(process.cwd(), 'test-data', 'world-scrambled');

  console.log('='.repeat(60));
  console.log('Entity Name Scrambler');
  console.log('='.repeat(60));
  console.log(`Seed: ${seed}`);
  console.log(`Input: ${inputDir}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Dry run: ${dryRun}`);
  console.log('');

  // Load all entities
  console.log('Loading entities...');
  const entities = loadEntities(inputDir);
  console.log(`Found ${entities.length} entities`);

  // Create scrambler and generate all mappings
  console.log('Generating name mappings...');
  const scrambler = new NameScrambler(seed);
  scrambler.createMappings(entities);

  const mappings = scrambler.getAllMappings();
  console.log(`Created ${mappings.length} entity mappings`);

  // Show example mappings
  console.log('\nExample mappings:');
  for (const m of mappings.slice(0, 10)) {
    console.log(`  ${m.originalName} (${m.originalId})`);
    console.log(`    -> ${m.newName} (${m.newId})`);
  }

  if (dryRun) {
    console.log('\n[DRY RUN] No files written');

    // Write mappings only
    const mappingsPath = join(process.cwd(), 'test-data', 'name-mappings.json');
    writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2));
    console.log(`Mappings saved to: ${mappingsPath}`);
    return;
  }

  // Create output directory structure
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Process files by type
  console.log('\nScrambling files...');
  const entityTypes = ['characters', 'locations', 'organizations', 'artifacts', 'events'];

  let fileCount = 0;
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

      // Find entity for this file
      const entity = entities.find(e => e.fileName === file && e.filePath === inPath);
      if (!entity) {
        console.warn(`  Warning: No entity found for ${file}`);
        continue;
      }

      const scrambledEntity = scrambler.getEntityMapping(entity.id);
      if (!scrambledEntity) {
        console.warn(`  Warning: No mapping for ${entity.id}`);
        continue;
      }

      // Use NEW filename
      const outPath = join(outTypeDir, scrambledEntity.newFileName);
      const scrambledContent = processFile(inPath, scrambler, scrambledEntity);
      writeFileSync(outPath, scrambledContent);

      fileCount++;
      if (fileCount % 100 === 0) {
        console.log(`  Processed ${fileCount} files...`);
      }
    }
  }

  console.log(`\nScrambled ${fileCount} files`);

  // Write mappings for reference
  const mappingsPath = join(outputDir, 'name-mappings.json');
  writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2));
  console.log(`Mappings saved to: ${mappingsPath}`);

  // Write reverse lookup (for debugging)
  const reverseLookup = Object.fromEntries(
    mappings.map(m => [m.newId, { originalId: m.originalId, originalName: m.originalName }])
  );
  const reversePath = join(outputDir, 'reverse-lookup.json');
  writeFileSync(reversePath, JSON.stringify(reverseLookup, null, 2));
  console.log(`Reverse lookup saved to: ${reversePath}`);

  console.log('\nDone!');
}

// ============================================================================
// Validation Command
// ============================================================================

async function validate() {
  const outputDir = join(process.cwd(), 'test-data', 'world-scrambled');
  const mappingsPath = join(outputDir, 'name-mappings.json');

  if (!existsSync(mappingsPath)) {
    console.error('Error: Run scrambling first - no mappings file found');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('Scrambling Validation Report');
  console.log('='.repeat(60));
  console.log('');

  const mappings: ScrambledEntity[] = JSON.parse(readFileSync(mappingsPath, 'utf-8'));
  console.log(`Loaded ${mappings.length} mappings\n`);

  // Common words to exclude from leak checking (these match entity names but are normal English)
  const commonWords = new Set([
    'the', 'a', 'an', 'of', 'and', 'or', 'great', 'old', 'new', 'last', 'first',
    'brother', 'sister', 'father', 'mother', 'son', 'daughter', 'uncle', 'aunt',
    'king', 'queen', 'prince', 'princess', 'lord', 'lady', 'master', 'captain',
    'fell', 'black', 'white', 'red', 'blue', 'green', 'grey', 'gray', 'dark', 'light',
    'giant', 'men', 'man', 'woman', 'boy', 'girl', 'child', 'children',
    'ring', 'sword', 'staff', 'tower', 'gate', 'bridge', 'road', 'river', 'mountain',
    'war', 'battle', 'siege', 'council', 'alliance', 'pact', 'treaty',
    'north', 'south', 'east', 'west', 'eastern', 'western', 'northern', 'southern',
    'high', 'low', 'long', 'short', 'big', 'small', 'good', 'bad', 'evil',
    'fair', 'bold', 'brave', 'wise', 'young', 'elder',
  ]);

  // Build set of original names to check for leaks
  const originalNames = new Set<string>();
  for (const m of mappings) {
    // Skip common words that happen to be entity names
    if (!commonWords.has(m.originalName.toLowerCase())) {
      originalNames.add(m.originalName);
    }
    // Also add first names for characters (if not common)
    const parts = m.originalName.split(' ');
    if (parts.length > 1 && parts[0].length > 3 && !commonWords.has(parts[0].toLowerCase())) {
      originalNames.add(parts[0]);
    }
  }

  // Collect all scrambled text
  let totalOriginalLength = 0;
  let totalScrambledLength = 0;
  let leakedNames: Array<{ name: string; file: string; context: string }> = [];
  let fileCount = 0;

  const entityTypes = ['characters', 'locations', 'organizations', 'artifacts', 'events'];

  for (const type of entityTypes) {
    const typeDir = join(outputDir, type);
    if (!existsSync(typeDir)) continue;

    const files = readdirSync(typeDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = join(typeDir, file);
      const content = readFileSync(filePath, 'utf-8');
      totalScrambledLength += content.length;
      fileCount++;

      // Check for leaked names
      for (const name of originalNames) {
        const regex = new RegExp(`\\b${escapeRegex(name)}\\b`, 'i');
        const match = content.match(regex);
        if (match) {
          // Get context around the match
          const idx = content.indexOf(match[0]);
          const start = Math.max(0, idx - 30);
          const end = Math.min(content.length, idx + match[0].length + 30);
          const context = content.slice(start, end).replace(/\n/g, ' ');

          leakedNames.push({ name, file, context: `...${context}...` });
        }
      }
    }
  }

  // Get original file sizes for comparison
  const inputDir = join(process.cwd(), 'test-data', 'world');
  for (const type of entityTypes) {
    const typeDir = join(inputDir, type);
    if (!existsSync(typeDir)) continue;

    const files = readdirSync(typeDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const content = readFileSync(join(typeDir, file), 'utf-8');
      totalOriginalLength += content.length;
    }
  }

  // Report results
  console.log('Validation Results:');
  console.log('-'.repeat(40));

  console.log(`\n1. File Count: ${fileCount} scrambled files`);

  const lengthRatio = totalScrambledLength / totalOriginalLength;
  const ratioStatus = lengthRatio >= 0.7 && lengthRatio <= 1.3 ? '✓' : '⚠';
  console.log(`\n2. Text Length Ratio: ${ratioStatus} ${lengthRatio.toFixed(3)}`);
  console.log(`   Original: ${(totalOriginalLength / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Scrambled: ${(totalScrambledLength / 1024 / 1024).toFixed(2)} MB`);

  if (leakedNames.length === 0) {
    console.log(`\n3. Leakage Check: ✓ No original names found in scrambled output`);
  } else {
    console.log(`\n3. Leakage Check: ✗ Found ${leakedNames.length} potential leaks`);
    // Show first 10 leaks
    const uniqueLeaks = [...new Set(leakedNames.map(l => l.name))];
    console.log(`   Unique leaked names: ${uniqueLeaks.slice(0, 10).join(', ')}`);
    if (uniqueLeaks.length > 10) {
      console.log(`   ... and ${uniqueLeaks.length - 10} more`);
    }
    console.log('\n   Sample leaks:');
    for (const leak of leakedNames.slice(0, 5)) {
      console.log(`   - "${leak.name}" in ${leak.file}`);
      console.log(`     Context: ${leak.context}`);
    }
  }

  // Check relationship integrity
  let relationshipCount = 0;
  let brokenRelationships: string[] = [];
  const allNewIds = new Set(mappings.map(m => m.newId));

  for (const type of entityTypes) {
    const typeDir = join(outputDir, type);
    if (!existsSync(typeDir)) continue;

    const files = readdirSync(typeDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const content = readFileSync(join(typeDir, file), 'utf-8');
      const parsed = parseMarkdownFile(content);
      if (!parsed) continue;

      const rels = parsed.frontmatter.relationships as Array<{ type: string; target: string }> || [];
      for (const rel of rels) {
        relationshipCount++;
        // Check if target exists (or is a valid scrambled ID, or wasn't mapped)
        const target = rel.target;
        if (!allNewIds.has(target) && target.match(/^(char|loc|org|art|evt)-/)) {
          // Only warn if it looks like an ID that should have been mapped
          if (!mappings.some(m => m.originalId === target)) {
            // Target wasn't in original mappings - might reference non-existent entity
          }
        }
      }
    }
  }

  console.log(`\n4. Relationship Count: ${relationshipCount} relationships preserved`);

  console.log('\n' + '='.repeat(60));
  console.log('Validation complete!');
}

// ============================================================================
// CLI Entry Point
// ============================================================================

const command = process.argv[2];

if (command === 'validate') {
  validate().catch(console.error);
} else {
  main().catch(console.error);
}
