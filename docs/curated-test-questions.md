# Intelligence System Test Questions (Curated Names)

These questions test the RAG system's ability to retrieve and provide relevant context. They use curated fantasy names to prevent LLM knowledge leakage from training data.

**Important**: These questions should NOT be answerable from base model knowledge. If the system answers correctly, it's using retrieved context. If it hallucinates or says "I don't know," the retrieval failed.

---

## Specific Details (Requires Exact Knowledge)

### 1. What was the name of Jasper's mother, and why was her lineage significant?

**Expected Answer**: Belladonna Ashford. Her lineage was significant because the Ashfords were known for being "adventurous" and less respectable than typical Shirefolk—they were rumored to have had dealings with Amtreadi. This explained Jasper's unusual wanderlust.

**Tests**: Entity retrieval, relationship traversal (Jasper → parent → significance)

---

### 2. How many years did Creepkin possess the Band before Jasper found it?

**Expected Answer**: Approximately 478 years (from around TA 2463 to TA 2941). Creepkin (originally Slivven) murdered his cousin Daglen to obtain it.

**Tests**: Numeric fact retrieval, entity history

---

### 3. What were the names of the two lamps that lit The Mortal Lands before the Trees?

**Expected Answer**: Illuin (in the north) and Ormal (in the south). They were destroyed by Tenebros.

**Tests**: Deep lore retrieval, pre-historical entities

---

### 4. What specific gift did Aelindra give to Thorngar, and why was this significant?

**Expected Answer**: Three strands of her golden hair. This was significant because Faenor had asked her three times for a single strand and she refused—yet she gave three to a Forgekin, traditionally distrustful of Amtreadi. It symbolized the healing of ancient enmity between the races.

**Tests**: Cross-entity relationship, symbolic significance retrieval

---

### 5. What were the Seven Names of Hidden City?

**Expected Answer**: Gondolin's seven names in various languages: Ondolindë (Highspeech), Gondolin (Amtreadan), the Hidden Rock, the Hidden Kingdom, the City of Seven Names, the Stone of Song, and the Tower of the King.

**Tests**: Multi-value attribute retrieval, linguistic knowledge

---

## Minor Characters (Easily Forgotten)

### 6. Who was Beregond, and what law did he break at Silverspire?

**Expected Answer**: Beregond was a Guard of the Citadel who befriended Perrin Ashford. He broke the law by leaving his post without permission and shedding blood in the Hallows (the sacred area around the tombs) when he killed servants who were trying to burn Aldwin alive on Thornhelm's orders. He was pardoned by King Stonehelm but exiled from Silverspire to serve in Moonvale.

**Tests**: Minor character retrieval, event sequence, consequence tracking

---

### 7. What happened to Fatty Barleycorn after Tomlen left the Shirelands?

**Expected Answer**: Fatty Barleycorn stayed behind at Crickethollow to maintain the pretense that Tomlen was still there. When the Shadow Riders came looking, he barely escaped and later helped lead resistance against Morvain's ruffians during the Scouring of the Shirelands.

**Tests**: Parallel narrative tracking, minor character arc

---

### 8. Who was Ghân-buri-Ghân, and how did he aid Aranada?

**Expected Answer**: Ghân-buri-Ghân was the chieftain of the Drúedain (Wild Men of the Woods). He guided the Aranadan army through secret paths in the Stonewain Valley, allowing them to bypass the Grimspawn forces blocking the road to Silverspire. This enabled them to arrive in time for the Battle of Silverspire Fields.

**Tests**: Minor character retrieval, military strategy context

---

### 9. What was the name of the Treewarden who guarded Ironspire with Rootbeard after its fall?

**Expected Answer**: Swiftbranch (also called Quickbough in the old tongue). He was a younger, hastier Treewarden who Marric and Perrin befriended.

**Tests**: Minor character retrieval, specific role identification

---

### 10. Who was Erestor, and what did he suggest at the Council of Thalion?

**Expected Answer**: Erestor was a counselor in Thalion's household at Galel Anastrael. At the Council, he suggested sending the Binding Band to Tom Willowmere or casting it into the Sea. Both suggestions were rejected—Tom might lose interest and forget about it, and the Sea would only delay Malachar, not defeat him.

**Tests**: Council discussion retrieval, alternative proposal tracking

---

## Genealogy/Relationships (Requires Tracing)

### 11. How was Thalion related to both Aldric and Elowyn?

**Expected Answer**:
- To Aldric: Thalion was his distant ancestor (about 60 generations back) through Thalion's brother Elros (who chose mortality and became the first King of Oldshore). Aldric descended from the Oldshore line.
- To Elowyn: She was his daughter.
- This made Aldric and Elowyn very distant cousins, and their marriage reunited the two branches of the Half-blood line.

**Tests**: Multi-path genealogy traversal, complex relationship explanation

---

### 12. What choice did Thalion's brother make, and what was his name?

**Expected Answer**: Elros chose mortality (the Gift of Men) rather than immortality. He became the first King of Oldshore and lived 500 years before dying. His descendants included Aldorion, Valorian, and eventually Aldric.

**Tests**: Sibling retrieval, significant choice/consequence

---

### 13. Through which ancestor did Aldric descend from Luthiel?

**Expected Answer**: Through Elros, who was the son of Aerendil and Elwing, who was the granddaughter of Luthiel and Beren. The line went: Luthiel → Dior → Elwing → Elros → [many generations] → Aldric.

**Tests**: Deep genealogy traversal, lineage chain

---

### 14. Who were Faenor's seven sons, and which survived the longest?

**Expected Answer**: Maedhros, Maglor, Celegorm, Caranthir, Curufin, Amrod, and Amras. Maglor survived the longest—he wandered the shores of The Mortal Lands singing laments after casting his Starstone into the Sea, and his fate is unknown (possibly still wandering).

**Tests**: Multi-entity list retrieval, fate tracking

---

## Chronology (Requires Precision)

### 15. How many years passed between the forging of the Binding Band and its destruction?

**Expected Answer**: Approximately 4,867 years. The Band was forged around SA 1600 (Second Era) and destroyed in TA 3019 (Third Era). The Second Era lasted 3,441 years after the forging.

**Tests**: Cross-era calculation, precise dating

---

### 16. In what year of the Third Era did the Battle of Five Hosts occur?

**Expected Answer**: TA 2941. The five armies were: Forgekin of the Iron Hills, Amtreadi of Gloomwood, Men of Laketown, Grimspawn/Shadowwolves, and Eagles (Skywardens).

**Tests**: Specific date retrieval, event participant enumeration

---

### 17. How long was the siege of The Obsidian Spire at the end of the Second Era?

**Expected Answer**: Seven years (SA 3434 to SA 3441). The Final Alliance besieged Malachar's fortress, and the siege ended when Aldorion was killed but Valorian cut the Band from Malachar's hand.

**Tests**: Duration retrieval, era-ending event details

---

### 18. What was the gap in years between Jasper's "eleventy-first" birthday and Tomlen's departure?

**Expected Answer**: 17 years. Jasper's party was in TA 3001 (when Tomlen was 33), and Tomlen left the Shirelands in TA 3018 (when he was 50).

**Tests**: Event gap calculation, character age tracking

---

## Misleading/Nuanced (Where Base Training May Produce Wrong Answers)

### 19. How many Wraithlords were at the Ford of Bruinen? (Not nine)

**Expected Answer**: Five. Four Wraithlords had attacked Tomlen at Windcrest, and one of those was swept away initially. The remaining Wraithlords caught up at the Ford, making five. The other four were pursuing elsewhere (tracking the Amtreadi decoys and Company who had split from Tomlen's route).

**Tests**: Specific count vs. assumed count, scene detail retrieval

---

### 20. Did Sylvorn ever miss a shot with his bow in the text of Master of the Bands?

**Expected Answer**: The text never explicitly describes Sylvorn missing a shot. Every shot mentioned either hits or isn't described as missing. However, during the Battle of Silverspire Fields, he ran out of arrows, which limited his effectiveness.

**Tests**: Negative fact verification, text-specific knowledge

---

### 21. What color was Valdris's cloak when he was Valdris the Grey? (Not grey)

**Expected Answer**: Blue. Though called "the Grey" due to his grey robes and grey hat, his cloak was actually blue. He was associated with grey but his actual cloak color was blue.

**Tests**: Attribute vs. title distinction, specific detail retrieval

---

### 22. How many of the Seven Bands given to Forgekin were recovered by Malachar?

**Expected Answer**: Three were consumed by dragons (along with their Forgekin bearers), and Malachar recovered the remaining four. So Malachar obtained four of the seven.

**Tests**: Partial count retrieval, fate tracking

---

### 23. Did Thorngar actually receive three hairs from Aelindra, or was that just his request?

**Expected Answer**: Yes, he received them. After Thorngar requested one hair and Aelindra asked why, he said he wanted no gift but to remember her words. She then asked again what he would have, and he requested a single strand. She gave him three instead, which moved the Amtreadi witnesses deeply given Faenor's history.

**Tests**: Request vs. fulfillment distinction, scene detail

---

## Deep Lore (Starstone Tales-Level)

### 24. What was the name of Tenebros's lieutenant who became the Shadow Lord of the Second and Third Eras?

**Expected Answer**: Malachar. He was originally an Ascended of Severin Hayward (smith god) who was corrupted by Tenebros and became his chief lieutenant. After Tenebros's defeat in the War of Wrath, Malachar became the primary antagonist.

**Tests**: Cross-era antagonist continuity, divine hierarchy

---

### 25. Who was Aerendil, and what celestial body did he become?

**Expected Answer**: Aerendil was a Half-blood mariner (son of Tuor and Idril) who sailed to The Blessed Realm to plead for aid against Tenebros. He now sails the sky in his ship Vingilot bearing a Starstone on his brow—he became the morning star (Venus).

**Tests**: Character-to-celestial transformation, mythic lore

---

### 26. What were the names of the Two Trees of The Blessed Realm?

**Expected Answer**: Telperion (the Silver Tree) and Laurelin (the Golden Tree). They were destroyed by Tenebros and The Webmother. The last flower and fruit became the Moon and Sun respectively.

**Tests**: Mythic entity retrieval, creation lore

---

### 27. Who slew Glaurung, and what was his relationship to that dragon?

**Expected Answer**: Turan (son of Huran) killed Glaurung. The relationship was complex: Glaurung had placed a curse/amnesia on Turan and his sister Nienor, leading to their unknowing incestuous marriage. When Glaurung revealed this before dying, both Turan and Nienor killed themselves.

**Tests**: Dragon-slayer retrieval, tragic narrative connection

---

### 28. What was the Oath of Faenor, and why did it doom his house?

**Expected Answer**: Faenor and his seven sons swore an oath by the name of the One (Ilúvatar) to pursue with vengeance anyone who withheld a Starstone from them. This oath led them to kinslayings against fellow Amtreadi (at Alqualondë, Doriath, and the Havens of Sirion) and ultimately destroyed almost all of Faenor's line.

**Tests**: Oath text retrieval, consequence chain

---

## Reasoning/Motivation (Requires Understanding, Not Just Recall)

### 29. Why did the Band have no power over Tom Willowmere?

**Expected Answer**: Tom Willowmere was outside the Band's domain—he was present before Malachar, before the Amtreadi came to The Mortal Lands, possibly before everything. The Band's power was tied to domination and the desire for power, but Tom had no desire to dominate or be dominated. He was utterly content and wanted nothing the Band could offer.

**Tests**: Entity nature explanation, power system understanding

---

### 30. Why couldn't Valdris or Aelindra wield the Band against Malachar?

**Expected Answer**: Any being powerful enough to use the Band against Malachar would be corrupted by it. The Band would twist their good intentions into domination. Valdris would become a tyrant "not dark but beautiful and terrible as the dawn," and Aelindra likewise. Only by destroying the Band could Malachar truly be defeated—not by using his own weapon against him.

**Tests**: Corruption mechanics, strategic reasoning

---

### 31. What was the original purpose of the seeing-stones, and who made them?

**Expected Answer**: The seeing-stones were made by Faenor in The Blessed Realm for communication between distant places. They were brought to The Mortal Lands by the Oldbloods and used to coordinate the kingdoms of Arnor and Argenthal. Their original purpose was benign—networked communication between rulers.

**Tests**: Artifact origin, purpose vs. corrupted use

---

### 32. Why did Malachar take the form of a fair being when he deceived the Amtreadi?

**Expected Answer**: Malachar took the form of "Annavar" (Lord of Gifts) because the Amtreadi, especially the Amtreadi smiths of Eregion like Celebranor, would not have trusted an obviously evil being. By appearing fair and wise, offering knowledge and partnership, he gained their trust and taught them band-making—then forged the Binding Band in secret to control all the others.

**Tests**: Deception strategy, historical cause-and-effect

---

### 33. Why were the Treewardens fading, and what did they lose?

**Expected Answer**: The Treewardens were fading because they had lost the Treewarden-wives, who had wandered away in the First Era and were never found (their gardens were destroyed by Malachar's forces). Without Treewarden-wives, no new Treewardens could be born. The existing Treewardens grew ever more "treeish"—slower, sleepier, more like ordinary trees.

**Tests**: Species decline explanation, loss tracking

---

## Linguistic (Requires Specific Knowledge)

### 34. What does "Shadowdeep" mean in Amtreadan, and who gave it that name?

**Expected Answer**: The original name was "Hadhodrond" in Amtreadan (from "Khazad-dûm" in Forgespeech), meaning "Forgekin-mansion." "Shadowdeep" (Amtreadan: "Moria") means "Black Pit" or "Black Chasm"—a name given by the Amtreadi after the Flamefiend awoke and the Forgekin were driven out. It's a name of fear and sorrow.

**Tests**: Etymology, naming history

---

### 35. What is the Amtreadan name for Galel Anastrael, and what does it mean?

**Expected Answer**: "Imladris" in Amtreadan, meaning "Deep Dale of the Cleft." Galel Anastrael was called the "Last Homely House East of the Sea" in Common Tongue. The name refers to its location in a hidden valley (cleft) in the Misty Mountains.

**Tests**: Location translation, meaning retrieval

---

### 36. What language is "Baruk Khazâd!" and what does the full war-cry mean?

**Expected Answer**: It's Forgespeech (Khuzdul), the secret language of the Forgekin. The full cry is "Baruk Khazâd! Khazâd ai-mênu!" meaning "Axes of the Forgekin! The Forgekin are upon you!" Thorngar shouts this during the Battle of Silverspire Fields.

**Tests**: Language identification, translation retrieval

---

### 37. What was Valdris's name in The Blessed Realm before he came to The Mortal Lands?

**Expected Answer**: Valorin. In The Blessed Realm, he was a Ascended (spirit) who served the Pantheon Gods of wisdom and compassion. He was sent to The Mortal Lands as one of the Greycloaks (five wizards) to oppose Malachar. Other names include Greywanderer (Amtreadan: Mithrandir) and Tharkon (Forgespeech).

**Tests**: Multi-name entity retrieval, cross-realm identity

---

## Usage Notes

- **Pass criteria**: Answer substantially matches expected, using retrieved context
- **Partial pass**: Correct general answer but missing specific details
- **Fail**: Completely wrong, hallucinated, or "I don't know" when data exists
- **Expected fail**: "I don't know" when the entity genuinely doesn't exist in corpus

These questions should be re-evaluated after any significant changes to the corpus or retrieval system.
