# LotR Intelligence System: Entity Gap Analysis

Analysis of which entities from the scraped Tolkien wiki data can answer the test questions, and what's missing.

## Summary

| Category | Questions | Answerable | Partial | Missing Data |
|----------|-----------|------------|---------|--------------|
| Specific Details | 5 | 2 | 2 | 1 |
| Minor Characters | 5 | 4 | 1 | 0 |
| Genealogy | 4 | 3 | 1 | 0 |
| Chronology | 4 | 1 | 2 | 1 |
| Misleading/Nuanced | 5 | 2 | 1 | 2 |
| Deep Lore | 5 | 4 | 1 | 0 |
| Reasoning | 5 | 3 | 2 | 0 |
| Linguistic | 4 | 2 | 1 | 1 |
| **TOTAL** | **37** | **21** | **11** | **5** |

---

## Detailed Analysis by Question

### Specific Details (Requires Exact Knowledge)

**Q1: What was the name of Bilbo's mother, and why was her lineage significant?**
- ✅ **ANSWERABLE** - `bilbo-baggins.md` contains: "parentage: Bungo Baggins and Belladonna Took" and discusses the "Tookish side"
- Entities present: `bilbo-baggins`
- Missing: Standalone `belladonna-took` entry would strengthen genealogy traversal

**Q2: How many years did Gollum possess the Ring before Bilbo found it?**
- ⚠️ **PARTIAL** - `gollum.md` exists but needs verification of timeline details
- Entities present: `gollum`, `bilbo-baggins`
- Missing: `one-ring` artifact entity with dates (forged SA 1600, found by Déagol TA 2463, to Bilbo TA 2941)

**Q3: What were the names of the two lamps that lit Middle-earth before the Trees?**
- ❌ **MISSING** - No entities for Illuin or Ormal
- Entities needed: `illuin` (location), `ormal` (location), or `two-lamps` (artifact/concept)
- Related: `almaren` exists (the island between them)

**Q4: What specific gift did Galadriel give to Gimli, and why was this significant?**
- ✅ **ANSWERABLE** - `galadriel.md` explicitly states: "she rewarded him with three strands, which he promised to put into an imperishable crystal"
- Entities present: `galadriel`, `gimli`

**Q5: What were the Seven Names of Gondolin?**
- ⚠️ **PARTIAL** - `gondolin` location exists, need to verify if names are included
- Entities present: `gondolin`
- May need: Content enhancement or `turgon` character details

---

### Minor Characters (Easily Forgotten)

**Q6: Who was Beregond, and what law did he break at Minas Tirith?**
- ✅ **ANSWERABLE** - Both `beregond` and `beregond-captain` exist
- Entities present: `beregond`, `beregond-captain`

**Q7: What happened to Fatty Bolger after Frodo left the Shire?**
- ✅ **ANSWERABLE** - `fredegar-bolger` exists (Fatty's real name)
- Entities present: `fredegar-bolger`, `the-shire`

**Q8: Who was Ghân-buri-Ghân, and how did he aid Rohan?**
- ✅ **ANSWERABLE** - `gh-n-buri-gh-n` exists
- Entities present: `gh-n-buri-gh-n`, `rohan`

**Q9: What was the name of the Ent who guarded Isengard with Treebeard after its fall?**
- ⚠️ **PARTIAL** - `treebeard` and `isengard` exist, but `quickbeam`/`bregalad` may be missing
- Entities present: `treebeard`, `isengard`, `ents`
- Missing: `quickbeam` or `bregalad` character

**Q10: Who was Erestor, and what did he suggest at the Council of Elrond?**
- ✅ **ANSWERABLE** - `erestor` exists
- Entities present: `erestor`, `elrond`, `rivendell`

---

### Genealogy/Relationships (Requires Tracing)

**Q11: How was Elrond related to both Aragorn and Arwen?**
- ✅ **ANSWERABLE** - `elrond`, `aragorn-ii`, `arwen` all exist with relationship data
- Entities present: `elrond`, `aragorn-ii`, `arwen`
- Traversal path: Elrond → Celebrían → Arwen (daughter); Elrond → Elros → ... → Aragorn (distant descendant)

**Q12: What choice did Elrond's brother make, and what was his name?**
- ✅ **ANSWERABLE** - `elros` exists
- Entities present: `elros`, `elrond`

**Q13: Through which ancestor did Aragorn descend from Lúthien?**
- ✅ **ANSWERABLE** - Chain exists: `l-thien` → `dior` → `elwing` → `e-rendil` → `elros` → ... → `aragorn-ii`
- Entities present: `l-thien`, `dior`, `elwing`, `e-rendil`, `elros`, `aragorn-ii`

**Q14: Who were Fëanor's seven sons, and which survived the longest?**
- ⚠️ **PARTIAL** - All seven sons exist but need to verify "who survived longest" is in content
- Entities present: `f-anor`, `maedhros`, `maglor`, `celegorm`, `caranthir`, `curufin`, `amrod`, `amras`

---

### Chronology (Requires Precision)

**Q15: How many years passed between the forging of the One Ring and its destruction?**
- ⚠️ **PARTIAL** - Needs artifact entity with dates
- Entities present: `sauron`
- Missing: `one-ring` artifact with dates (SA 1600 forged, TA 3019 destroyed = ~4,861 years)

**Q16: In what year of the Third Age did the Battle of Five Armies occur?**
- ❌ **MISSING** - No battle/event entities
- Missing: `battle-of-five-armies` event entity
- Related entities: `bilbo-baggins`, `thorin-ii`, `bard`, `smaug` (may contain date in content)

**Q17: How long was the siege of Barad-dûr at the end of the Second Age?**
- ⚠️ **PARTIAL** - `last-alliance-of-elves-and-men` org exists
- Entities present: `last-alliance-of-elves-and-men`
- Missing: `barad-dur` location

**Q18: What was the gap in years between Bilbo's "eleventy-first" birthday and Frodo's departure?**
- ✅ **ANSWERABLE** - Both characters exist with dates in properties
- Entities present: `bilbo-baggins`, `frodo-baggins`

---

### Misleading/Nuanced (Where Training May Produce Wrong Answers)

**Q19: How many Nazgûl were at the Ford of Bruinen? (Not nine)**
- ❌ **MISSING** - No Nazgûl/Ringwraith entities
- Entities present: `witch-king-of-angmar`, `bruinen` (river)
- Missing: `nazgul` or `ringwraiths` group entity

**Q20: Did Legolas ever miss a shot with his bow in the text of LotR?**
- ⚠️ **PARTIAL** - `legolas` exists, would need detailed content verification
- Entities present: `legolas`

**Q21: What color was Gandalf's cloak when he was Gandalf the Grey? (Not grey)**
- ✅ **ANSWERABLE** - `gandalf` exists with detailed description
- Entities present: `gandalf`

**Q22: How many of the Seven Rings given to Dwarves were recovered by Sauron?**
- ❌ **MISSING** - No Rings of Power entities
- Entities present: `dwarves`, `sauron`
- Missing: `seven-rings` or `rings-of-power` artifact entity

**Q23: Did Gimli actually receive three hairs from Galadriel, or was that just his request?**
- ✅ **ANSWERABLE** - Explicitly stated in `galadriel.md`: "she rewarded him with three strands"
- Entities present: `galadriel`, `gimli`

---

### Deep Lore (Silmarillion-Level)

**Q24: What was the name of Morgoth's lieutenant who became the Dark Lord of the Second and Third Ages?**
- ✅ **ANSWERABLE** - `morgoth` and `sauron` both exist
- Entities present: `morgoth`, `sauron`

**Q25: Who was Eärendil, and what celestial body did he become?**
- ✅ **ANSWERABLE** - Multiple Eärendil entries exist
- Entities present: `e-rendil`, `e-rendil-of-and-ni`, `e-rendil-of-arnor`, `e-rendil-of-n-menor`

**Q26: What were the names of the Two Trees of Valinor?**
- ⚠️ **PARTIAL** - `valinor` exists but need dedicated tree entities
- Entities present: `valinor`
- Missing: `telperion`, `laurelin`, or `two-trees` entity

**Q27: Who slew Glaurung, and what was his relationship to that dragon?**
- ✅ **ANSWERABLE** - `glaurung` and `t-rin` (Túrin) both exist
- Entities present: `glaurung`, `t-rin`

**Q28: What was the Oath of Fëanor, and why did it doom his house?**
- ✅ **ANSWERABLE** - `f-anor` exists with detailed lore
- Entities present: `f-anor`, plus all seven sons

---

### Reasoning/Motivation (Requires Understanding, Not Just Recall)

**Q29: Why did the Ring have no power over Tom Bombadil?**
- ⚠️ **PARTIAL** - `tom-bombadil` exists but needs content about his nature
- Entities present: `tom-bombadil`
- Missing: `one-ring` artifact with detailed properties

**Q30: Why couldn't Gandalf or Galadriel wield the Ring against Sauron?**
- ✅ **ANSWERABLE** - Both characters exist with detailed lore about their nature
- Entities present: `gandalf`, `galadriel`, `sauron`

**Q31: What was the original purpose of the palantíri, and who made them?**
- ⚠️ **PARTIAL** - `f-anor` (maker) exists
- Entities present: `f-anor`
- Missing: `palantiri` artifact entity

**Q32: Why did Sauron take the form of a fair being when he deceived the Elves?**
- ✅ **ANSWERABLE** - `sauron` and `galadriel` contain this context (Annatar period)
- Entities present: `sauron`, `galadriel`, `celebrimbor`

**Q33: Why were the Ents fading, and what did they lose?**
- ✅ **ANSWERABLE** - `ents` org and `treebeard` exist
- Entities present: `ents`, `treebeard`
- Note: Entwives story should be in content

---

### Linguistic (Requires Specific Knowledge)

**Q34: What does "Moria" mean in Sindarin, and who gave it that name?**
- ✅ **ANSWERABLE** - `moria.md` contains: "Sindarin, 'The Black Chasm', 'The Black Pit'" and "given by the Elves 'without love'"
- Entities present: `moria`

**Q35: What is the Sindarin name for Rivendell, and what does it mean?**
- ✅ **ANSWERABLE** - `rivendell` exists (Imladris)
- Entities present: `rivendell`

**Q36: What language is "Baruk Khazâd!" and what does the full war-cry mean?**
- ⚠️ **PARTIAL** - `dwarves` and `gimli` exist
- Entities present: `dwarves`, `gimli`, `moria` (has Khuzdul etymology)
- May need: Khuzdul language details in content

**Q37: What was Gandalf's name in Valinor before he came to Middle-earth?**
- ❌ **MISSING** - Need to verify if "Olórin" is in `gandalf` content
- Entities present: `gandalf`
- Need: Maiar origin details (Olórin)

---

## Entities to Add

### High Priority (Required for Multiple Questions)

| Entity | Type | Questions Affected |
|--------|------|-------------------|
| `one-ring` | artifact | Q2, Q15, Q19, Q22, Q29 |
| `nazgul` / `ringwraiths` | organization | Q19 |
| `rings-of-power` or `seven-rings` | artifact | Q22 |
| `palantiri` | artifact | Q31 |
| `two-trees` (Telperion & Laurelin) | location/artifact | Q26 |
| `two-lamps` (Illuin & Ormal) | location/artifact | Q3 |

### Medium Priority (Strengthen Existing Coverage)

| Entity | Type | Questions Affected |
|--------|------|-------------------|
| `barad-dur` | location | Q17 |
| `quickbeam` / `bregalad` | character | Q9 |
| `battle-of-five-armies` | event | Q16 |
| `council-of-elrond` | event | Q10 |
| `belladonna-took` | character | Q1 (genealogy traversal) |

### Low Priority (Content Enhancements)

These entities exist but may need content verification/enhancement:
- `gandalf` - verify Olórin name is present (Q37)
- `legolas` - verify archery details (Q20)
- `gondolin` - verify Seven Names (Q5)
- `gollum` - verify timeline details (Q2)

---

## Relationship Traversals Needed

For genealogy questions to work, the intelligence system needs to traverse these paths:

1. **Bilbo's Heritage (Q1)**
   ```
   bilbo-baggins → [parentage] → belladonna-took → [member_of] → took-family
   ```

2. **Aragorn to Lúthien (Q13)**
   ```
   aragorn-ii → [descendant_of] → elros → [child_of] → e-rendil → [child_of] → elwing → [child_of] → dior → [child_of] → l-thien
   ```

3. **Elrond's Dual Relation (Q11)**
   ```
   elrond → [parent_of] → celebrian → [parent_of] → arwen
   elrond → [sibling_of] → elros → [ancestor_of] → aragorn-ii
   ```

---

## Recommended Scraper Category Additions

To fill the gaps, add these wiki categories to the scraper:

```typescript
const CATEGORIES = {
  // ... existing ...
  artifacts: [
    'Category:Rings of Power',
    'Category:Weapons',
    'Category:Palantíri',
    'Category:Artifacts',
  ],
  events: [
    'Category:Battles',
    'Category:Wars',
    'Category:Councils',
  ],
};
```
