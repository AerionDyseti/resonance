# Tolkien Name Cleanup - Reconnaissance Summary

## Overview

This reconnaissance identified **178 Tolkien-derived names** across **989 files** in the `test-data/world-curated/` directory that need to be replaced with original names from the Amtreadan (Elven) or Ancient Human language systems.

## Key Findings

### Statistics

- **Total files scanned:** 989
- **Tolkien names found:** 187
- **Already mapped in curated-mappings.json:** 9
- **Need new mappings:** 178

### File Structure

```
test-data/world-curated/
├── locations/        # ~360+ files
├── characters/       # ~550+ files
├── organizations/    # ~80+ files
└── curated-mappings.json
```

## Breakdown by Category

### Locations (83 need mapping)

- **Amtreadan (Elvish):** 14 locations with clear Elvish markers (ë, ó, í, -dor, -lond suffixes)
  - Examples: Alalvinórë, Avallónë, Cuiviénen, Sindanórië
- **Ancient Human:** 69 locations (Mannish/human origins)
  - Examples: Angmar, Eriador, Hithlum, Thangorodrim

### Characters (93 need mapping)

- **Valar/Maiar (Deities):** 16 deity names requiring special handling
  - Examples: Manwë, Varda, Ulmo, Aulë, Yavanna, Melian
  - **Note:** These map to the Pantheon system and may need coordination with existing gods
- **Amtreadan (Elvish):** 36 character names
  - Examples: Elemmírë, Eönwë, Finwë, Ar-Pharazôn
- **Ancient Human:** 40 character names
  - Examples: Fingon, Turgon, Maedhros, Maglor, Glaurung
- **Dwarvish:** 1 character (Gimilkhâd)

### Organizations (2 need mapping)

- **Amtreadan:** 1 (Éoherë)
- **Ancient Human:** 1 (Éored)

## Language Systems for Replacement

### Amtreadan (Elven)

**Use for:** Names with Elvish origins (Sindarin/Quenya)
**Resources:** `elven-vocab.md`, `elven-grammar.md`

**Characteristics:**

- Agglutinative structure (compound words from root concepts)
- Diacritics: ë, ú, í, î, ô, á, é, ó, ä, ö
- Common suffixes: -ion, -iel, -wen, -dor, -lond, -ost, -rim, -roth
- Prefixes: A- (negation), U- (temporary), I-/O- (proximity/distance)

**Examples from curated-mappings.json:**

- Alqualondë → (needs Amtreadan name with meaning "Swan-haven")
- Rómenna → (needs Amtreadan name)

### Ancient Human (Old English/Celtic)

**Use for:** Names with Mannish/Human origins

**Characteristics:**

- Old English/Norse/Celtic style
- Common patterns: -helm, -wyn, -gar, -hold, -land
- Examples from existing mappings:
  - Rohan → Aranada
  - Gondor → Argenthal
  - Angmar → Coldreach (in some contexts)

**Example from file analysis:**
The Angmar file shows it's already partially updated - uses "Specter King of Coldreach" as replacement for "Witch-king of Angmar" but the location name "Angmar" itself still needs replacement.

### Dwarvish

**Use for:** Dwarf-related names

**Characteristics:**

- Guttural consonants: kh, gh, zh
- Common elements: -dûm, -zâram, -zigil, -khâd
- Translation approach: Khazad-dûm → Shadowdeep

## Already Mapped (9 names)

These exist in curated-mappings.json but files may still contain old names:

- **Locations:** Alqualondë, Annúminas, Araman, Helcaraxë, Rómenna, Zirakzigil
- **Characters:** Beren, Éomer (→ Horsehelm), Éowyn (→ Shieldwyn)

## Special Considerations

### Deity Names (Valar/Maiar)

The 16 deity names (Manwë, Varda, Ulmo, etc.) require special handling:

- May need to map to existing Pantheon gods
- May need new deity creation
- Check for theological consistency with existing world pantheon

**Example:** The Manwë file shows he's "King of the The Pantheon" - suggesting these are already being integrated into a Pantheon system.

### Cross-references

Many files have extensive internal cross-references:

- Angmar file references: Specter King, Arnor, Fornost, etc.
- Need systematic replacement to avoid broken references
- Some references already updated (e.g., "Specter King of Coldreach")

### Content Depth

Files contain:

- Frontmatter with structured data (id, name, properties, relationships)
- Body content with history, etymology, adaptations
- References to other locations/characters
- Some files are very detailed (Angmar: 94 lines, Manwë: 94 lines)

## Recommended Workflow

1. **Phase 1: Deity Names**
   - Review 16 Valar/Maiar names
   - Map to existing Pantheon or create new deities
   - Update curated-mappings.json

2. **Phase 2: Major Locations**
   - Prioritize locations referenced frequently (Angmar, Eriador, etc.)
   - Create Amtreadan/Ancient Human names
   - Update curated-mappings.json

3. **Phase 3: Major Characters**
   - Focus on characters with many cross-references
   - Create appropriate language names
   - Update curated-mappings.json

4. **Phase 4: Systematic Replacement**
   - Use curated-mappings.json for find/replace across all files
   - Update frontmatter `name:` fields
   - Update body content references
   - Update relationships/cross-references

## Next Steps

1. Review detailed TODO at: `test-data/world-curated/tolkien-cleanup-todo.md`
2. Consult language resources:
   - `elven-vocab.md` for Amtreadan vocabulary
   - `elven-grammar.md` for Amtreadan grammar rules
3. Create new name mappings following existing patterns in `curated-mappings.json`
4. Consider automation for bulk replacement once mappings are complete

## Files Generated

- **tolkien-cleanup-todo.md** - Detailed table of all names needing replacement
- **TOLKIEN-CLEANUP-SUMMARY.md** - This executive summary
