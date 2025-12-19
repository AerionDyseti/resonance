/**
 * Curated Name Mappings for LotR → Enym-inspired Fantasy
 *
 * Design principles:
 * - Preserve semantic meaning (species feel like species, not organizations)
 * - Use Enym world terminology where appropriate for maximum distance
 * - Keep similar "feel" (hobbits get earthy names, elves get flowing names)
 * - Handle plurals, possessives, and compound forms
 * - Maintain relationship types (uncle is still uncle)
 */

export interface CuratedMapping {
  original: string;
  replacement: string;
  category: 'species' | 'character' | 'location' | 'artifact' | 'organization' | 'event' | 'term';
  notes?: string;
}

// ============================================================================
// SPECIES / RACES - Using Enym-style naming
// ============================================================================
export const speciesMappings: CuratedMapping[] = [
  // Hobbits → Shirefolk (using Enym "Halfling Shires" concept)
  { original: 'Hobbits', replacement: 'Shirefolk', category: 'species', notes: 'Small folk who live in hillside burrows' },
  { original: 'Hobbit', replacement: 'Shirefolk', category: 'species' },
  { original: 'hobbits', replacement: 'shirefolk', category: 'species' },
  { original: 'hobbit', replacement: 'shirefolk', category: 'species' },
  { original: 'Halfling', replacement: 'Shirefolk', category: 'species' },
  { original: 'Halflings', replacement: 'Shirefolk', category: 'species' },
  { original: 'halfling', replacement: 'shirefolk', category: 'species' },
  { original: 'halflings', replacement: 'shirefolk', category: 'species' },
  { original: 'Hobbit-', replacement: 'Shire-', category: 'species' },
  { original: 'hobbit-', replacement: 'shire-', category: 'species' },

  // Elves → Amtreadi (Enym High Elves name)
  { original: 'Elves', replacement: 'Amtreadi', category: 'species', notes: 'Immortal, graceful, magical beings (Enym elven race)' },
  { original: 'Elf', replacement: 'Amtreadi', category: 'species' },
  { original: 'elves', replacement: 'amtreadi', category: 'species' },
  { original: 'elf', replacement: 'amtreadi', category: 'species' },
  { original: 'Elven', replacement: 'Amtreadi', category: 'species' },
  { original: 'elven', replacement: 'amtreadi', category: 'species' },
  { original: 'Elvish', replacement: 'Amtreadan', category: 'species' },
  { original: 'elvish', replacement: 'amtreadan', category: 'species' },
  { original: 'Elfish', replacement: 'Amtreadan', category: 'species' },
  { original: 'Elf-', replacement: 'Amtread-', category: 'species' },

  // Elven sub-groups → Enym elven varieties
  { original: 'Noldor', replacement: 'Amtreadi', category: 'species', notes: 'High Elves' },
  { original: 'Sindar', replacement: 'Liinadi', category: 'species', notes: 'Grey/Wood Elves' },
  { original: 'Silvan', replacement: 'Liinadi', category: 'species', notes: 'Wood Elves' },
  { original: 'Teleri', replacement: 'Liinadi', category: 'species' },
  { original: 'Vanyar', replacement: 'Amtreadi', category: 'species' },
  { original: 'High Elves', replacement: 'Amtreadi', category: 'species' },
  { original: 'High Elf', replacement: 'Amtreadi', category: 'species' },
  { original: 'Wood Elves', replacement: 'Liinadi', category: 'species' },
  { original: 'Wood Elf', replacement: 'Liinadi', category: 'species' },
  { original: 'Dark Elves', replacement: 'Raknagadi', category: 'species' },
  { original: 'Dark Elf', replacement: 'Raknagadi', category: 'species' },

  // Dwarves → Forgekin (Enym dwarves are ancestor-revering smiths)
  { original: 'Dwarves', replacement: 'Forgekin', category: 'species', notes: 'Mountain-dwelling miners and smiths' },
  { original: 'Dwarf', replacement: 'Forgekin', category: 'species' },
  { original: 'dwarves', replacement: 'forgekin', category: 'species' },
  { original: 'dwarf', replacement: 'forgekin', category: 'species' },
  { original: 'Dwarven', replacement: 'Forgekin', category: 'species' },
  { original: 'dwarven', replacement: 'forgekin', category: 'species' },
  { original: 'Dwarfish', replacement: 'Forgekin', category: 'species' },
  { original: 'Dwarf-', replacement: 'Forge-', category: 'species' },

  // Orcs → Grimspawn
  { original: 'Orcs', replacement: 'Grimspawn', category: 'species', notes: 'Corrupted, brutal creatures' },
  { original: 'Orc', replacement: 'Grimspawn', category: 'species' },
  { original: 'orcs', replacement: 'grimspawn', category: 'species' },
  { original: 'orc', replacement: 'grimspawn', category: 'species' },
  { original: 'Orcish', replacement: 'Grimspawn', category: 'species' },
  { original: 'orcish', replacement: 'grimspawn', category: 'species' },
  { original: 'Orc-', replacement: 'Grim-', category: 'species' },

  // Uruk-hai → Ironspawn
  { original: 'Uruk-hai', replacement: 'Ironspawn', category: 'species', notes: 'Elite bred warriors' },
  { original: 'Uruks', replacement: 'Ironspawn', category: 'species' },
  { original: 'Uruk', replacement: 'Ironspawn', category: 'species' },

  // Ents → Treewardens (Enym-style)
  { original: 'Ents', replacement: 'Treewardens', category: 'species', notes: 'Ancient tree shepherds' },
  { original: 'Ent', replacement: 'Treewarden', category: 'species' },
  { original: 'Entish', replacement: 'Treewarden', category: 'species' },
  { original: 'Entwives', replacement: 'Treewarden-wives', category: 'species' },
  { original: 'Entmoot', replacement: 'Treewarden-moot', category: 'species' },

  // Trolls
  { original: 'Trolls', replacement: 'Stonelurks', category: 'species' },
  { original: 'Troll', replacement: 'Stonelurk', category: 'species' },
  { original: 'trolls', replacement: 'stonelurks', category: 'species' },
  { original: 'troll', replacement: 'stonelurk', category: 'species' },

  // Nazgûl/Ringwraiths → Wraithlords
  { original: 'Nazgûl', replacement: 'Wraithlords', category: 'species', notes: 'Ring-corrupted specter kings' },
  { original: 'Nazgul', replacement: 'Wraithlords', category: 'species' },
  { original: 'Ringwraith', replacement: 'Wraithlord', category: 'species' },
  { original: 'Ringwraiths', replacement: 'Wraithlords', category: 'species' },
  { original: 'ringwraith', replacement: 'wraithlord', category: 'species' },
  { original: 'Black Riders', replacement: 'Shadow Riders', category: 'species' },
  { original: 'Black Rider', replacement: 'Shadow Rider', category: 'species' },
  { original: 'Nine Riders', replacement: 'Nine Shadows', category: 'species' },
  { original: 'the Nine', replacement: 'the Shadows', category: 'species' },

  // Balrog → Flamefiend
  { original: 'Balrog', replacement: 'Flamefiend', category: 'species' },
  { original: 'Balrogs', replacement: 'Flamefiends', category: 'species' },
  { original: "Durin's Bane", replacement: 'The Deepflame', category: 'species' },

  // Wargs
  { original: 'Wargs', replacement: 'Shadowwolves', category: 'species' },
  { original: 'Warg', replacement: 'Shadowwolf', category: 'species' },
  { original: 'wargs', replacement: 'shadowwolves', category: 'species' },
  { original: 'warg', replacement: 'shadowwolf', category: 'species' },

  // Eagles
  { original: 'Great Eagles', replacement: 'Skywardens', category: 'species' },
  { original: 'Great Eagle', replacement: 'Skywarden', category: 'species' },
  { original: 'Eagles of Manwë', replacement: 'Skywardens', category: 'species' },

  // Human groups
  { original: 'Rohirrim', replacement: 'Aranadan', category: 'species', notes: 'Horse-lords (using Enym sword-lord culture)' },
  { original: 'Eorlingas', replacement: 'Aranadan', category: 'species' },
  { original: 'Dúnedain', replacement: 'Duskwardens', category: 'species', notes: 'Rangers descended from ancient kings' },
  { original: 'Dunedain', replacement: 'Duskwardens', category: 'species' },
  { original: 'Númenórean', replacement: 'Oldbloods', category: 'species' },
  { original: 'Númenóreans', replacement: 'Oldbloods', category: 'species' },
  { original: 'Numenorean', replacement: 'Oldbloods', category: 'species' },
  { original: 'Numenoreans', replacement: 'Oldbloods', category: 'species' },
  { original: 'Men of the West', replacement: 'Tyrran folk', category: 'species' },
  { original: 'Men of Gondor', replacement: 'Solaarans', category: 'species' },
  { original: 'Gondorian', replacement: 'Solaaran', category: 'species' },
  { original: 'Gondorians', replacement: 'Solaarans', category: 'species' },

  // Maiar/Ainur
  { original: 'Maiar', replacement: 'Ascended', category: 'species' },
  { original: 'Maia', replacement: 'Ascended', category: 'species' },
  { original: 'Ainur', replacement: 'Firstborn', category: 'species' },
  { original: 'Valar', replacement: 'The Pantheon', category: 'species' },
  { original: 'Vala', replacement: 'Pantheon God', category: 'species' },
];

// ============================================================================
// KEY CHARACTERS - Hobbits (earthy, simple names)
// ============================================================================
export const hobbitMappings: CuratedMapping[] = [
  // Main hobbits - using Enym-style simple names
  { original: 'Frodo Baggins', replacement: 'Tomlen Burrows', category: 'character', notes: 'Ring-bearer protagonist' },
  { original: 'Frodo', replacement: 'Tomlen', category: 'character' },

  { original: 'Bilbo Baggins', replacement: 'Jasper Burrows', category: 'character', notes: 'Older ring-bearer, uncle figure' },
  { original: 'Bilbo', replacement: 'Jasper', category: 'character' },

  { original: 'Samwise Gamgee', replacement: 'Colben Greenhand', category: 'character', notes: 'Loyal gardener companion' },
  { original: 'Samwise', replacement: 'Colben', category: 'character' },
  { original: 'Sam Gamgee', replacement: 'Colben Greenhand', category: 'character' },
  // Note: "Sam" alone is too common, skip it

  { original: 'Meriadoc Brandybuck', replacement: 'Marric Clearbrook', category: 'character' },
  { original: 'Merry Brandybuck', replacement: 'Marric Clearbrook', category: 'character' },
  { original: 'Merry', replacement: 'Marric', category: 'character' },
  { original: 'Meriadoc', replacement: 'Marric', category: 'character' },

  { original: 'Peregrin Took', replacement: 'Perrin Ashford', category: 'character' },
  { original: 'Pippin Took', replacement: 'Perrin Ashford', category: 'character' },
  { original: 'Pippin', replacement: 'Perrin', category: 'character' },
  { original: 'Peregrin', replacement: 'Perrin', category: 'character' },

  // Family names
  { original: 'Baggins', replacement: 'Burrows', category: 'character' },
  { original: 'Bagginses', replacement: 'Burrowses', category: 'character' },
  { original: 'Gamgee', replacement: 'Greenhand', category: 'character' },
  { original: 'Gamgees', replacement: 'Greenhands', category: 'character' },
  { original: 'Brandybuck', replacement: 'Clearbrook', category: 'character' },
  { original: 'Brandybucks', replacement: 'Clearbrooks', category: 'character' },
  { original: 'Took', replacement: 'Ashford', category: 'character' },
  { original: 'Tooks', replacement: 'Ashfords', category: 'character' },
  { original: 'Sackville-Baggins', replacement: 'Sackwell-Burrows', category: 'character' },
  { original: 'Sackville-Bagginses', replacement: 'Sackwell-Burrowses', category: 'character' },
  { original: 'Bolger', replacement: 'Barleycorn', category: 'character' },
  { original: 'Bolgers', replacement: 'Barleycorns', category: 'character' },
  { original: 'Boffin', replacement: 'Millbrook', category: 'character' },
  { original: 'Boffins', replacement: 'Millbrooks', category: 'character' },
  { original: 'Proudfoot', replacement: 'Stoutfoot', category: 'character' },
  { original: 'Proudfoots', replacement: 'Stoutfoots', category: 'character' },
  { original: 'Proudfeet', replacement: 'Stoutfeet', category: 'character' },

  // Parents
  { original: 'Drogo Baggins', replacement: 'Dramon Burrows', category: 'character' },
  { original: 'Drogo', replacement: 'Dramon', category: 'character' },
  { original: 'Primula Brandybuck', replacement: 'Primrose Clearbrook', category: 'character' },
  { original: 'Primula', replacement: 'Primrose', category: 'character' },

  // Gaffer
  { original: 'Gaffer Gamgee', replacement: 'Gaffer Greenhand', category: 'character' },
  { original: 'Hamfast Gamgee', replacement: 'Hamlen Greenhand', category: 'character' },
  { original: 'Hamfast', replacement: 'Hamlen', category: 'character' },
  { original: 'the Gaffer', replacement: 'old Greenhand', category: 'character' },

  // Gollum/Sméagol
  { original: 'Gollum', replacement: 'Creepkin', category: 'character', notes: 'Corrupted former ring-bearer' },
  { original: 'Sméagol', replacement: 'Slivven', category: 'character', notes: "Gollum's original name" },
  { original: 'Smeagol', replacement: 'Slivven', category: 'character' },

  // Other hobbits
  { original: 'Farmer Maggot', replacement: 'Farmer Turnip', category: 'character' },
  { original: 'Maggot', replacement: 'Turnip', category: 'character' },
  { original: 'Rosie Cotton', replacement: 'Lily Hayward', category: 'character' },
  { original: 'Rosie', replacement: 'Lily', category: 'character' },
  { original: 'Rose Cotton', replacement: 'Lily Hayward', category: 'character' },
  { original: 'Cotton', replacement: 'Hayward', category: 'character' },
  { original: 'Lobelia Sackville-Baggins', replacement: 'Lavinia Sackwell-Burrows', category: 'character' },
  { original: 'Lobelia', replacement: 'Lavinia', category: 'character' },
  { original: 'Otho Sackville-Baggins', replacement: 'Otwin Sackwell-Burrows', category: 'character' },
  { original: 'Otho', replacement: 'Otwin', category: 'character' },

  { original: 'Fredegar Bolger', replacement: 'Fredric Barleycorn', category: 'character' },
  { original: 'Fatty Bolger', replacement: 'Fatty Barleycorn', category: 'character' },
  { original: 'Fredegar', replacement: 'Fredric', category: 'character' },

  { original: 'Folco Boffin', replacement: 'Falco Millbrook', category: 'character' },
  { original: 'Folco', replacement: 'Falco', category: 'character' },

  { original: 'Old Took', replacement: 'Old Ashford', category: 'character' },
  { original: 'Gerontius Took', replacement: 'Gerold Ashford', category: 'character' },
  { original: 'Gerontius', replacement: 'Gerold', category: 'character' },
  { original: 'Bandobras Took', replacement: 'Banric Ashford', category: 'character' },
  { original: 'Bandobras', replacement: 'Banric', category: 'character' },
  { original: 'Bullroarer', replacement: 'Bullhorn', category: 'character' },

  { original: 'Déagol', replacement: 'Daglen', category: 'character' },
  { original: 'Deagol', replacement: 'Daglen', category: 'character' },
];

// ============================================================================
// KEY CHARACTERS - Wizards (using Enym "Council of Mages" style)
// ============================================================================
export const wizardMappings: CuratedMapping[] = [
  { original: 'Gandalf the Grey', replacement: 'Valdris the Grey', category: 'character' },
  { original: 'Gandalf the White', replacement: 'Valdris the White', category: 'character' },
  { original: 'Gandalf', replacement: 'Valdris', category: 'character', notes: 'Grey/White wizard guide' },
  { original: 'Mithrandir', replacement: 'Greywanderer', category: 'character', notes: 'Elvish name for Gandalf' },
  { original: 'Grey Pilgrim', replacement: 'Grey Wanderer', category: 'character' },
  { original: 'White Rider', replacement: 'White Pilgrim', category: 'character' },
  { original: 'Olórin', replacement: 'Valorin', category: 'character' },
  { original: 'Olorin', replacement: 'Valorin', category: 'character' },
  { original: 'Incánus', replacement: 'Incara', category: 'character' },
  { original: 'Tharkûn', replacement: 'Tharkon', category: 'character' },

  { original: 'Saruman the White', replacement: 'Morvain the White', category: 'character' },
  { original: 'Saruman', replacement: 'Morvain', category: 'character', notes: 'Corrupted white wizard' },
  { original: 'Curunír', replacement: 'Curanir', category: 'character' },
  { original: 'Sharkey', replacement: 'Sharkin', category: 'character' },

  { original: 'Radagast the Brown', replacement: 'Thornwick the Brown', category: 'character' },
  { original: 'Radagast', replacement: 'Thornwick', category: 'character', notes: 'Brown wizard, nature-focused' },

  { original: 'Istari', replacement: 'Greycloaks', category: 'organization', notes: 'Order of wizards (Enym: Council of Mages)' },
  { original: 'the Five Wizards', replacement: 'the Five Greycloaks', category: 'organization' },
  { original: 'Blue Wizards', replacement: 'Blue Greycloaks', category: 'organization' },
];

// ============================================================================
// KEY CHARACTERS - Elves (using Enym flowing elven names)
// ============================================================================
export const elfMappings: CuratedMapping[] = [
  // Lothlórien
  { original: 'Galadriel', replacement: 'Aelindra', category: 'character', notes: 'Lady of the Golden Wood' },
  { original: 'Lady of Lórien', replacement: 'Lady of Goldwood', category: 'character' },
  { original: 'Lady of Light', replacement: 'Lady of Starlight', category: 'character' },
  { original: 'Celeborn', replacement: 'Caelorn', category: 'character', notes: 'Lord of the Golden Wood' },
  { original: 'Lord of Lórien', replacement: 'Lord of Goldwood', category: 'character' },

  // Rivendell
  { original: 'Elrond Half-elven', replacement: 'Thalion Half-blood', category: 'character' },
  { original: 'Elrond', replacement: 'Thalion', category: 'character', notes: 'Lord of Rivendell, healer' },
  { original: 'Arwen Undómiel', replacement: 'Elowyn Dawnstar', category: 'character' },
  { original: 'Arwen Evenstar', replacement: 'Elowyn Dawnstar', category: 'character' },
  { original: 'Arwen', replacement: 'Elowyn', category: 'character', notes: "Evenstar, Elrond's daughter" },
  { original: 'Evenstar', replacement: 'Dawnstar', category: 'character' },
  { original: 'Undómiel', replacement: 'Dawnstar', category: 'character' },
  { original: 'Elladan', replacement: 'Elloran', category: 'character' },
  { original: 'Elrohir', replacement: 'Elrodan', category: 'character' },

  // Mirkwood
  { original: 'Legolas Greenleaf', replacement: 'Sylvorn Greenbough', category: 'character' },
  { original: 'Legolas', replacement: 'Sylvorn', category: 'character', notes: 'Woodland prince, archer' },
  { original: 'Thranduil', replacement: 'Thornael', category: 'character', notes: 'King of Woodland realm' },
  { original: 'Elvenking', replacement: 'Amtreadi King', category: 'character' },

  // Other elves
  { original: 'Glorfindel', replacement: 'Aurindel', category: 'character', notes: 'Powerful elf lord' },
  { original: 'Gildor Inglorion', replacement: 'Calendor Ithlorion', category: 'character' },
  { original: 'Gildor', replacement: 'Calendor', category: 'character' },
  { original: 'Haldir', replacement: 'Vorniel', category: 'character' },

  // Ancient elves
  { original: 'Gil-galad', replacement: 'Astorion', category: 'character', notes: 'Last High King' },
  { original: 'Ereinion Gil-galad', replacement: 'Ereinion Astorion', category: 'character' },
  { original: 'Círdan', replacement: 'Harborel', category: 'character', notes: 'Shipwright' },
  { original: 'Cirdan', replacement: 'Harborel', category: 'character' },
  { original: 'Fëanor', replacement: 'Faenor', category: 'character' },
  { original: 'Feanor', replacement: 'Faenor', category: 'character' },
  { original: 'Fingolfin', replacement: 'Fingalor', category: 'character' },
  { original: 'Finrod', replacement: 'Finoran', category: 'character' },
  { original: 'Celebrimbor', replacement: 'Celebranor', category: 'character' },
  { original: 'Eärendil', replacement: 'Aerendil', category: 'character' },
  { original: 'Earendil', replacement: 'Aerendil', category: 'character' },
  { original: 'Lúthien', replacement: 'Luthiel', category: 'character' },
  { original: 'Luthien', replacement: 'Luthiel', category: 'character' },
];

// ============================================================================
// KEY CHARACTERS - Humans/Rangers (using Enym naming: cel Tradat style)
// ============================================================================
export const humanMappings: CuratedMapping[] = [
  // Rangers / Gondor
  { original: 'Aragorn son of Arathorn', replacement: 'Aldric cel Arathen', category: 'character' },
  { original: 'Aragorn', replacement: 'Aldric', category: 'character', notes: 'Heir to throne, ranger' },
  { original: 'Strider', replacement: 'Wanderer', category: 'character', notes: "Aragorn's ranger name" },
  { original: 'Elessar', replacement: 'Stonehelm', category: 'character', notes: "Aragorn's king name" },
  { original: 'King Elessar', replacement: 'King Stonehelm', category: 'character' },
  { original: 'Thorongil', replacement: 'Eaglecrown', category: 'character' },
  { original: 'Longshanks', replacement: 'Longstride', category: 'character' },

  { original: 'Boromir son of Denethor', replacement: 'Valdric cel Thornhelm', category: 'character' },
  { original: 'Boromir', replacement: 'Valdric', category: 'character', notes: "Steward's heir, warrior" },
  { original: 'Faramir', replacement: 'Aldwin', category: 'character', notes: "Steward's second son" },
  { original: 'Denethor', replacement: 'Thornhelm', category: 'character', notes: 'Steward of Gondor' },
  { original: 'Steward of Gondor', replacement: 'Steward of Argenthal', category: 'character' },
  { original: 'Ruling Steward', replacement: 'Lord Steward', category: 'character' },

  { original: 'Isildur', replacement: 'Valorian', category: 'character', notes: 'Ancient king who cut the Ring' },
  { original: 'Elendil', replacement: 'Aldorion', category: 'character', notes: "High King, Isildur's father" },
  { original: 'Anárion', replacement: 'Anareth', category: 'character' },
  { original: 'Anarion', replacement: 'Anareth', category: 'character' },

  // Rohan (→ Aranada, using Enym sword-lord culture)
  { original: 'Théoden King', replacement: 'Aldking Theron', category: 'character' },
  { original: 'Théoden', replacement: 'Theron', category: 'character', notes: 'King of the horse-lords' },
  { original: 'Theoden', replacement: 'Theron', category: 'character' },
  { original: 'King of Rohan', replacement: 'King of Aranada', category: 'character' },
  { original: 'King of the Mark', replacement: 'Lord of Aranada', category: 'character' },
  { original: 'Éowyn', replacement: 'Shieldwyn', category: 'character', notes: 'Shield-maiden' },
  { original: 'Eowyn', replacement: 'Shieldwyn', category: 'character' },
  { original: 'Lady of Rohan', replacement: 'Lady of Aranada', category: 'character' },
  { original: 'Éomer', replacement: 'Horsehelm', category: 'character', notes: 'Marshal, later king' },
  { original: 'Eomer', replacement: 'Horsehelm', category: 'character' },
  { original: 'Third Marshal', replacement: 'Marshal', category: 'character' },

  { original: 'Grima Wormtongue', replacement: 'Verin Snakewhisper', category: 'character' },
  { original: 'Wormtongue', replacement: 'Snakewhisper', category: 'character' },
  { original: 'Gríma', replacement: 'Verin', category: 'character' },
  { original: 'Grima', replacement: 'Verin', category: 'character' },

  { original: 'Háma', replacement: 'Hagan', category: 'character' },
  { original: 'Hama', replacement: 'Hagan', category: 'character' },
  { original: 'Gamling', replacement: 'Garmund', category: 'character' },
  { original: 'Erkenbrand', replacement: 'Erikbrand', category: 'character' },
  { original: 'Théodred', replacement: 'Theodric', category: 'character' },
  { original: 'Theodred', replacement: 'Theodric', category: 'character' },

  // Other humans
  { original: 'Bard the Bowman', replacement: 'Braden the Archer', category: 'character' },
  { original: 'Bard', replacement: 'Braden', category: 'character' },
  { original: 'Beorn', replacement: 'Bjorn', category: 'character' },
  { original: 'Beren', replacement: 'Beren', category: 'character' }, // Keep, it's generic
  { original: 'Húrin', replacement: 'Huran', category: 'character' },
  { original: 'Hurin', replacement: 'Huran', category: 'character' },
  { original: 'Túrin', replacement: 'Turan', category: 'character' },
  { original: 'Turin', replacement: 'Turan', category: 'character' },
];

// ============================================================================
// KEY CHARACTERS - Villains (using Enym dark terminology)
// ============================================================================
export const villainMappings: CuratedMapping[] = [
  // Sauron → Malachar (Enym-style dark lord)
  { original: 'Sauron', replacement: 'Malachar', category: 'character', notes: 'The Dark Lord (Enym: Xenirith style)' },
  { original: 'Dark Lord', replacement: 'Shadow Lord', category: 'character' },
  { original: 'the Dark Lord', replacement: 'the Shadow Lord', category: 'character' },
  { original: 'Lord of the Rings', replacement: 'Master of the Binding', category: 'character' },
  { original: 'Lord of Mordor', replacement: 'Lord of Ashvale', category: 'character' },
  { original: 'the Enemy', replacement: 'the Shadow', category: 'character' },
  { original: 'the Eye', replacement: 'the Watcher', category: 'character' },
  { original: 'Eye of Sauron', replacement: 'Eye of Malachar', category: 'character' },
  { original: 'Lidless Eye', replacement: 'Sleepless Eye', category: 'character' },
  { original: 'Annatar', replacement: 'Annavar', category: 'character' },
  { original: 'Lord of Gifts', replacement: 'Giver of Gifts', category: 'character' },
  { original: 'Necromancer', replacement: 'Dark Sorcerer', category: 'character' },

  // Morgoth
  { original: 'Morgoth', replacement: 'Tenebros', category: 'character', notes: 'First Dark Lord' },
  { original: 'Melkor', replacement: 'Tenebros', category: 'character' },
  { original: 'Bauglir', replacement: 'Tenebros', category: 'character' },
  { original: 'the Great Enemy', replacement: 'the First Shadow', category: 'character' },

  // Witch-king
  { original: 'Witch-king of Angmar', replacement: 'Specter King of Coldreach', category: 'character' },
  { original: 'Witch-king', replacement: 'Specter King', category: 'character' },
  { original: 'Lord of the Nazgûl', replacement: 'Lord of the Wraithlords', category: 'character' },
  { original: 'Lord of the Nazgul', replacement: 'Lord of the Wraithlords', category: 'character' },

  // Spiders
  { original: 'Shelob', replacement: 'Venomweave', category: 'character', notes: 'Giant spider' },
  { original: 'Ungoliant', replacement: 'The Webmother', category: 'character' },
  { original: "Shelob's Lair", replacement: "Venomweave's Lair", category: 'location' },

  // Other villains
  { original: 'Mouth of Sauron', replacement: 'Voice of Malachar', category: 'character' },
  { original: 'the Mouth', replacement: 'the Voice', category: 'character' },
  { original: 'Gothmog', replacement: 'Gorthak', category: 'character' },
  { original: 'Azog', replacement: 'Azrak', category: 'character' },
  { original: 'Bolg', replacement: 'Bolgrak', category: 'character' },
];

// ============================================================================
// KEY CHARACTERS - Others
// ============================================================================
export const otherCharacterMappings: CuratedMapping[] = [
  // Dwarves (using Enym Forgekin style)
  { original: 'Gimli son of Glóin', replacement: 'Thorngar Ironhelm', category: 'character' },
  { original: 'Gimli', replacement: 'Thorngar', category: 'character', notes: 'Dwarf of the Fellowship' },
  { original: 'Glóin', replacement: 'Glorin', category: 'character' },
  { original: 'Gloin', replacement: 'Glorin', category: 'character' },
  { original: 'Thorin Oakenshield', replacement: 'Durgan Ironbark', category: 'character' },
  { original: 'Thorin', replacement: 'Durgan', category: 'character' },
  { original: 'Oakenshield', replacement: 'Ironbark', category: 'character' },
  { original: 'Balin', replacement: 'Borin', category: 'character' },
  { original: 'Durin', replacement: 'Grundin', category: 'character' },
  { original: "Durin's Folk", replacement: 'Grundin Folk', category: 'character' },
  { original: 'Dáin', replacement: 'Dagor', category: 'character' },
  { original: 'Dain', replacement: 'Dagor', category: 'character' },
  { original: 'Thrór', replacement: 'Thragor', category: 'character' },
  { original: 'Thror', replacement: 'Thragor', category: 'character' },
  { original: 'Thráin', replacement: 'Thrain', category: 'character' },
  { original: 'Thrain', replacement: 'Thragol', category: 'character' },

  // Ents
  { original: 'Treebeard', replacement: 'Rootbeard', category: 'character' },
  { original: 'Fangorn', replacement: 'Deeproot', category: 'character' },
  { original: 'Quickbeam', replacement: 'Swiftbranch', category: 'character' },
  { original: 'Bregalad', replacement: 'Quickbough', category: 'character' },

  // Tom Bombadil
  { original: 'Tom Bombadil', replacement: 'Tom Willowmere', category: 'character' },
  { original: 'Bombadil', replacement: 'Willowmere', category: 'character' },
  { original: 'Goldberry', replacement: 'Silverbrook', category: 'character' },

  // Eagles
  { original: 'Gwaihir', replacement: 'Skycrest', category: 'character' },
  { original: 'Lord of the Eagles', replacement: 'Lord of the Skywardens', category: 'character' },
  { original: 'Landroval', replacement: 'Windcrest', category: 'character' },
  { original: 'Meneldor', replacement: 'Stormwing', category: 'character' },

  // Horses
  { original: 'Shadowfax', replacement: 'Swiftmane', category: 'character' },
  { original: 'Lord of Horses', replacement: 'King of Steeds', category: 'character' },
  { original: 'Asfaloth', replacement: 'Starrunner', category: 'character' },
  { original: 'Bill the Pony', replacement: 'Bill the Pony', category: 'character' }, // Keep, generic

  // Other
  { original: 'Smaug', replacement: 'Scorath', category: 'character' },
  { original: 'Smaug the Golden', replacement: 'Scorath the Golden', category: 'character' },
  { original: 'the dragon', replacement: 'the wyrm', category: 'character' },
];

// ============================================================================
// LOCATIONS - Major Realms (using Enym locations where possible)
// ============================================================================
export const realmMappings: CuratedMapping[] = [
  // The Shire → The Shirelands (Enym has "Halfling Shires")
  { original: 'the Shire', replacement: 'the Shirelands', category: 'location', notes: 'Peaceful shirefolk homeland' },
  { original: 'The Shire', replacement: 'The Shirelands', category: 'location' },
  { original: 'Shire', replacement: 'Shirelands', category: 'location' },
  { original: 'Hobbiton', replacement: 'Willowdale', category: 'location' },
  { original: 'Bag End', replacement: "Burrow's End", category: 'location' },
  { original: 'Bagshot Row', replacement: 'Burrow Row', category: 'location' },
  { original: 'Buckland', replacement: 'Brookshire', category: 'location' },
  { original: 'Bucklebury', replacement: 'Brookbury', category: 'location' },
  { original: 'Bucklebury Ferry', replacement: 'Brookbury Ferry', category: 'location' },
  { original: 'Brandywine', replacement: 'Clearbrook', category: 'location' },
  { original: 'Brandywine Bridge', replacement: 'Clearbrook Bridge', category: 'location' },
  { original: 'Brandywine River', replacement: 'Clearbrook River', category: 'location' },
  { original: 'Bywater', replacement: 'Bybrook', category: 'location' },
  { original: 'Michel Delving', replacement: 'Michel Hollow', category: 'location' },
  { original: 'Crickhollow', replacement: 'Crickethollow', category: 'location' },
  { original: 'Brandy Hall', replacement: 'Brook Hall', category: 'location' },
  { original: 'Great Smials', replacement: 'Great Burrows', category: 'location' },
  { original: 'Green Dragon', replacement: 'Green Griffin', category: 'location' },
  { original: 'the Water', replacement: 'the Brook', category: 'location' },
  { original: 'Water-valley', replacement: 'Brook-valley', category: 'location' },
  { original: 'Westfarthing', replacement: 'Westshire', category: 'location' },
  { original: 'Eastfarthing', replacement: 'Eastshire', category: 'location' },
  { original: 'Northfarthing', replacement: 'Northshire', category: 'location' },
  { original: 'Southfarthing', replacement: 'Southshire', category: 'location' },

  // Mordor → Ashvale
  { original: 'Mordor', replacement: 'Ashvale', category: 'location', notes: "Dark Lord's domain" },
  { original: 'Mount Doom', replacement: 'Doomfire Peak', category: 'location', notes: 'Volcano where Ring was forged' },
  { original: 'Orodruin', replacement: 'Doomfire Peak', category: 'location' },
  { original: 'Sammath Naur', replacement: 'Chambers of Fire', category: 'location' },
  { original: 'Crack of Doom', replacement: 'Chasm of Fire', category: 'location' },
  { original: 'Cracks of Doom', replacement: 'Chasm of Fire', category: 'location' },
  { original: 'Barad-dûr', replacement: 'The Obsidian Spire', category: 'location', notes: "Dark Lord's tower" },
  { original: 'Barad-dur', replacement: 'The Obsidian Spire', category: 'location' },
  { original: 'Dark Tower', replacement: 'Obsidian Spire', category: 'location' },
  { original: 'Black Gate', replacement: 'Obsidian Gate', category: 'location' },
  { original: 'Morannon', replacement: 'Obsidian Gate', category: 'location' },
  { original: 'Cirith Ungol', replacement: 'Spider Pass', category: 'location' },
  { original: 'Tower of Cirith Ungol', replacement: 'Tower of Spider Pass', category: 'location' },
  { original: 'Gorgoroth', replacement: 'Ashplain', category: 'location' },
  { original: 'Plateau of Gorgoroth', replacement: 'Plateau of Ashplain', category: 'location' },
  { original: 'Udûn', replacement: 'The Ashdeep', category: 'location' },
  { original: 'Udun', replacement: 'The Ashdeep', category: 'location' },
  { original: 'Minas Morgul', replacement: 'Specterhold', category: 'location' },
  { original: 'Morgul Vale', replacement: 'Specter Vale', category: 'location' },
  { original: 'Ered Lithui', replacement: 'Ash Mountains', category: 'location' },
  { original: 'Ephel Dúath', replacement: 'Shadow Mountains', category: 'location' },
  { original: 'Ephel Duath', replacement: 'Shadow Mountains', category: 'location' },
  { original: 'Mountains of Shadow', replacement: 'Shadow Mountains', category: 'location' },

  // Gondor → Argenthal (or Solaarus from Enym)
  { original: 'Gondor', replacement: 'Argenthal', category: 'location', notes: 'Southern kingdom of men' },
  { original: 'Minas Tirith', replacement: 'Silverspire', category: 'location', notes: 'White city, capital' },
  { original: 'Tower of Guard', replacement: 'Silverspire', category: 'location' },
  { original: 'White City', replacement: 'Silver City', category: 'location' },
  { original: 'City of Kings', replacement: 'City of Kings', category: 'location' }, // Keep
  { original: 'Osgiliath', replacement: 'Starbridge', category: 'location' },
  { original: 'Minas Anor', replacement: 'Tower of Dawn', category: 'location' },
  { original: 'Minas Ithil', replacement: 'Tower of Moon', category: 'location' },
  { original: 'Pelennor Fields', replacement: 'Silverspire Fields', category: 'location' },
  { original: 'Pelennor', replacement: 'Silverspire Fields', category: 'location' },
  { original: 'Ithilien', replacement: 'Moonvale', category: 'location' },
  { original: 'South Ithilien', replacement: 'South Moonvale', category: 'location' },
  { original: 'North Ithilien', replacement: 'North Moonvale', category: 'location' },
  { original: 'Henneth Annûn', replacement: 'Hidden Falls', category: 'location' },
  { original: 'Henneth Annun', replacement: 'Hidden Falls', category: 'location' },
  { original: 'Cair Andros', replacement: 'River Keep', category: 'location' },
  { original: 'Dol Amroth', replacement: 'Swan Keep', category: 'location' },
  { original: 'Lossarnach', replacement: 'Flowerdale', category: 'location' },
  { original: 'Lebennin', replacement: 'Five Rivers', category: 'location' },
  { original: 'Anduin', replacement: 'Greatwater', category: 'location' },
  { original: 'Great River', replacement: 'Greatwater', category: 'location' },
  { original: 'River Anduin', replacement: 'River Greatwater', category: 'location' },

  // Rohan → Aranada (Enym sword-lord culture)
  { original: 'Rohan', replacement: 'Aranada', category: 'location', notes: 'Land of horse-lords (Enym: sword-lords)' },
  { original: 'Riddermark', replacement: 'Aranada', category: 'location' },
  { original: 'the Mark', replacement: 'Aranada', category: 'location' },
  { original: 'Edoras', replacement: 'Horsehold', category: 'location' },
  { original: 'Meduseld', replacement: 'Goldenhall', category: 'location' },
  { original: 'Golden Hall', replacement: 'Golden Hall', category: 'location' }, // Keep
  { original: "Helm's Deep", replacement: 'Thornwall Keep', category: 'location' },
  { original: 'Helms Deep', replacement: 'Thornwall Keep', category: 'location' },
  { original: 'Hornburg', replacement: 'Thornwall', category: 'location' },
  { original: 'the Hornburg', replacement: 'the Thornwall', category: 'location' },
  { original: "Helm's Gate", replacement: 'Thornwall Gate', category: 'location' },
  { original: "Helm's Dike", replacement: 'Thornwall Dike', category: 'location' },
  { original: 'Dunharrow', replacement: 'Darkharrow', category: 'location' },
  { original: 'Paths of the Dead', replacement: 'Ghost Road', category: 'location' },
  { original: 'Aldburg', replacement: 'Oldfort', category: 'location' },
  { original: 'Fords of Isen', replacement: 'Fords of Iron', category: 'location' },
  { original: 'Eastfold', replacement: 'Eastmark', category: 'location' },
  { original: 'Westfold', replacement: 'Westmark', category: 'location' },
  { original: 'the Wold', replacement: 'the Downs', category: 'location' },
  { original: 'Entwash', replacement: 'Treewater', category: 'location' },

  // Elven realms (using Enym: Galel Anastrael style)
  { original: 'Rivendell', replacement: 'Galel Anastrael', category: 'location', notes: 'Hidden elven valley (Enym sacred city)' },
  { original: 'Imladris', replacement: 'Galel Anastrael', category: 'location' },
  { original: 'Last Homely House', replacement: 'Last Refuge', category: 'location' },
  { original: 'House of Elrond', replacement: 'House of Thalion', category: 'location' },
  { original: 'Lothlórien', replacement: 'Goldwood', category: 'location', notes: 'Golden elven forest' },
  { original: 'Lothlorien', replacement: 'Goldwood', category: 'location' },
  { original: 'Lórien', replacement: 'Goldwood', category: 'location' },
  { original: 'Lorien', replacement: 'Goldwood', category: 'location' },
  { original: 'Golden Wood', replacement: 'Goldwood', category: 'location' },
  { original: 'Caras Galadhon', replacement: 'Silvertree', category: 'location' },
  { original: 'Mirkwood', replacement: 'Gloomwood', category: 'location' },
  { original: 'Greenwood the Great', replacement: 'Greenwood', category: 'location' },
  { original: 'Greenwood', replacement: 'Greenwood', category: 'location' }, // Keep, generic
  { original: 'Grey Havens', replacement: 'Mistport', category: 'location' },
  { original: 'Mithlond', replacement: 'Mistport', category: 'location' },
  { original: 'Lindon', replacement: 'Westshore', category: 'location' },
  { original: "Thranduil's Halls", replacement: "Thornael's Halls", category: 'location' },
  { original: 'Doriath', replacement: 'Greyvale', category: 'location' },
  { original: 'Nargothrond', replacement: 'Deephold', category: 'location' },
  { original: 'Gondolin', replacement: 'Hidden City', category: 'location' },

  // Dwarven realms (Enym: Adamantine Oath style)
  { original: 'Moria', replacement: 'Shadowdeep', category: 'location', notes: 'Abandoned dwarf mines' },
  { original: 'Khazad-dûm', replacement: 'Shadowdeep', category: 'location' },
  { original: 'Khazad-dum', replacement: 'Shadowdeep', category: 'location' },
  { original: 'Dwarrowdelf', replacement: 'Shadowdeep', category: 'location' },
  { original: 'Mines of Moria', replacement: 'Mines of Shadowdeep', category: 'location' },
  { original: 'Bridge of Khazad-dûm', replacement: 'Bridge of Shadowdeep', category: 'location' },
  { original: 'Bridge of Khazad-dum', replacement: 'Bridge of Shadowdeep', category: 'location' },
  { original: 'Chamber of Mazarbul', replacement: 'Chamber of Records', category: 'location' },
  { original: 'Erebor', replacement: 'Ironpeak', category: 'location', notes: 'Lonely Mountain' },
  { original: 'Lonely Mountain', replacement: 'The Ironpeak', category: 'location' },
  { original: 'the Lonely Mountain', replacement: 'the Ironpeak', category: 'location' },
  { original: 'Iron Hills', replacement: 'Iron Hills', category: 'location' }, // Keep
  { original: 'Blue Mountains', replacement: 'Blue Mountains', category: 'location' }, // Keep
  { original: 'Ered Luin', replacement: 'Blue Mountains', category: 'location' },

  // Isengard
  { original: 'Isengard', replacement: 'Ironspire', category: 'location', notes: "Saruman's stronghold" },
  { original: 'Orthanc', replacement: 'The Black Tower', category: 'location' },
  { original: 'Ring of Isengard', replacement: 'Ring of Ironspire', category: 'location' },

  // Other locations
  { original: 'Fangorn Forest', replacement: 'Deeproot Forest', category: 'location' },
  { original: 'Fangorn', replacement: 'Deeproot', category: 'location' },
  { original: 'Prancing Pony', replacement: "Wanderer's Rest", category: 'location' },
  { original: 'Bree', replacement: 'Crossway', category: 'location' },
  { original: 'Bree-land', replacement: 'Crossway-land', category: 'location' },
  { original: 'Weathertop', replacement: 'Windcrest', category: 'location' },
  { original: 'Amon Sûl', replacement: 'Windcrest', category: 'location' },
  { original: 'Amon Sul', replacement: 'Windcrest', category: 'location' },
  { original: 'Dead Marshes', replacement: 'Bonefens', category: 'location' },
  { original: 'Emyn Muil', replacement: 'Stone Hills', category: 'location' },
  { original: 'Dagorlad', replacement: 'Battle Plain', category: 'location' },
  { original: 'Amon Hen', replacement: 'Hill of Sight', category: 'location' },
  { original: 'Seat of Seeing', replacement: 'Seat of Sight', category: 'location' },
  { original: 'Rauros', replacement: 'Greatfalls', category: 'location' },
  { original: 'Falls of Rauros', replacement: 'Greatfalls', category: 'location' },
  { original: 'Argonath', replacement: 'Pillar Kings', category: 'location' },
  { original: 'Old Forest', replacement: 'Old Forest', category: 'location' }, // Keep
  { original: 'Barrow-downs', replacement: 'Barrow Hills', category: 'location' },
  { original: 'Withywindle', replacement: 'Willowstream', category: 'location' },
  { original: 'Misty Mountains', replacement: 'Misty Mountains', category: 'location' }, // Keep, generic
  { original: 'High Pass', replacement: 'High Pass', category: 'location' }, // Keep
  { original: 'Redhorn Pass', replacement: 'Redhorn Pass', category: 'location' }, // Keep
  { original: 'Caradhras', replacement: 'Redhorn', category: 'location' },
  { original: 'Gap of Rohan', replacement: 'Gap of Aranada', category: 'location' },

  // Ancient/mythical places
  { original: 'Valinor', replacement: 'The Blessed Realm', category: 'location' },
  { original: 'Undying Lands', replacement: 'Eternal Shore', category: 'location' },
  { original: 'Middle-earth', replacement: 'The Mortal Lands', category: 'location' },
  { original: 'Arda', replacement: 'The World', category: 'location' },
  { original: 'Númenor', replacement: 'Oldshore', category: 'location' },
  { original: 'Numenor', replacement: 'Oldshore', category: 'location' },
  { original: 'Westernesse', replacement: 'Oldshore', category: 'location' },
  { original: 'Aman', replacement: 'The Far West', category: 'location' },
  { original: 'Blessed Realm', replacement: 'Blessed Realm', category: 'location' }, // Keep
  { original: 'Taniquetil', replacement: 'Holy Mountain', category: 'location' },
  { original: 'Tirion', replacement: 'Starhold', category: 'location' },
  { original: 'Eressëa', replacement: 'Lonely Isle', category: 'location' },
  { original: 'Tol Eressëa', replacement: 'Lonely Isle', category: 'location' },
  { original: 'Beleriand', replacement: 'Westlands', category: 'location' },
  { original: 'Angband', replacement: 'Iron Fortress', category: 'location' },
  { original: 'Utumno', replacement: 'First Darkness', category: 'location' },
];

// ============================================================================
// ARTIFACTS
// ============================================================================
export const artifactMappings: CuratedMapping[] = [
  // The Ring
  { original: 'the One Ring', replacement: 'the Binding Band', category: 'artifact' },
  { original: 'One Ring', replacement: 'Binding Band', category: 'artifact', notes: 'Master ring of power' },
  { original: 'The Ring', replacement: 'The Band', category: 'artifact' },
  { original: 'the Ring', replacement: 'the Band', category: 'artifact' },
  { original: 'Ring of Power', replacement: 'Band of Binding', category: 'artifact' },
  { original: 'Rings of Power', replacement: 'Bands of Binding', category: 'artifact' },
  { original: 'Ring-bearer', replacement: 'Band-bearer', category: 'artifact' },
  { original: 'Ringbearer', replacement: 'Bandbearer', category: 'artifact' },
  { original: 'ring-bearer', replacement: 'band-bearer', category: 'artifact' },
  { original: 'the Master Ring', replacement: 'the Master Band', category: 'artifact' },
  { original: 'Three Rings', replacement: 'Three Bands', category: 'artifact' },
  { original: 'Seven Rings', replacement: 'Seven Bands', category: 'artifact' },
  { original: 'Nine Rings', replacement: 'Nine Bands', category: 'artifact' },
  { original: 'Narya', replacement: 'Band of Fire', category: 'artifact' },
  { original: 'Nenya', replacement: 'Band of Water', category: 'artifact' },
  { original: 'Vilya', replacement: 'Band of Air', category: 'artifact' },

  // Weapons
  { original: 'Sting', replacement: 'Glimmer', category: 'artifact', notes: 'Small elven blade' },
  { original: 'Glamdring', replacement: 'Foebreaker', category: 'artifact', notes: "Gandalf's sword" },
  { original: 'Foe-hammer', replacement: 'Foebreaker', category: 'artifact' },
  { original: 'Orcrist', replacement: 'Grimcleaver', category: 'artifact' },
  { original: 'Goblin-cleaver', replacement: 'Grimcleaver', category: 'artifact' },
  { original: 'Andúril', replacement: 'Dawnblade', category: 'artifact', notes: "Reforged king's sword" },
  { original: 'Anduril', replacement: 'Dawnblade', category: 'artifact' },
  { original: 'Flame of the West', replacement: 'Dawnblade', category: 'artifact' },
  { original: 'Narsil', replacement: 'Starshatter', category: 'artifact', notes: "Broken king's sword" },
  { original: 'Sword that was Broken', replacement: 'Shattered Blade', category: 'artifact' },
  { original: 'Grond', replacement: 'Worldbreaker', category: 'artifact' },
  { original: 'Morgul-blade', replacement: 'Specter-blade', category: 'artifact' },
  { original: 'Morgul-knife', replacement: 'Specter-knife', category: 'artifact' },
  { original: 'Aeglos', replacement: 'Snowpoint', category: 'artifact' },
  { original: 'Gúthwinë', replacement: 'Battle-friend', category: 'artifact' },
  { original: 'Guthwine', replacement: 'Battle-friend', category: 'artifact' },
  { original: 'Herugrim', replacement: 'Kingsblade', category: 'artifact' },

  // Gems and stones
  { original: 'Silmaril', replacement: 'Starstone', category: 'artifact' },
  { original: 'Silmarils', replacement: 'Starstones', category: 'artifact' },
  { original: 'Arkenstone', replacement: 'Heart of the Mountain', category: 'artifact' },
  { original: 'Evenstar', replacement: 'Dawnstar', category: 'artifact' },

  // Palantíri
  { original: 'palantír', replacement: 'seeing-stone', category: 'artifact' },
  { original: 'palantíri', replacement: 'seeing-stones', category: 'artifact' },
  { original: 'Palantir', replacement: 'Seeing-Stone', category: 'artifact' },
  { original: 'Palantíri', replacement: 'Seeing-Stones', category: 'artifact' },
  { original: 'palantir', replacement: 'seeing-stone', category: 'artifact' },
  { original: 'seeing-stones', replacement: 'seeing-stones', category: 'artifact' }, // Keep

  // Materials
  { original: 'mithril', replacement: 'truesilver', category: 'artifact' },
  { original: 'Mithril', replacement: 'Truesilver', category: 'artifact' },
  { original: 'mithril-coat', replacement: 'truesilver-coat', category: 'artifact' },

  // Other artifacts
  { original: 'Phial of Galadriel', replacement: 'Starlight Vial', category: 'artifact' },
  { original: 'the Phial', replacement: 'the Vial', category: 'artifact' },
  { original: 'Horn of Gondor', replacement: 'Horn of Argenthal', category: 'artifact' },
  { original: 'Great Horn', replacement: 'Great Horn', category: 'artifact' }, // Keep
  { original: "Elendil's sword", replacement: 'the Shattered Blade', category: 'artifact' },

  // Elven items
  { original: 'Elven cloak', replacement: 'Amtreadi cloak', category: 'artifact' },
  { original: 'Elven rope', replacement: 'Amtreadi rope', category: 'artifact' },
  { original: 'Elven-cloak', replacement: 'Amtreadi-cloak', category: 'artifact' },
  { original: 'elven-cloak', replacement: 'amtreadi-cloak', category: 'artifact' },
  { original: 'Lembas', replacement: 'Waybread', category: 'artifact' },
  { original: 'lembas', replacement: 'waybread', category: 'artifact' },
  { original: 'Miruvor', replacement: 'Starwine', category: 'artifact' },
  { original: 'miruvor', replacement: 'starwine', category: 'artifact' },
];

// ============================================================================
// ORGANIZATIONS / GROUPS
// ============================================================================
export const organizationMappings: CuratedMapping[] = [
  { original: 'Fellowship of the Ring', replacement: 'Company of the Band', category: 'organization' },
  { original: 'the Fellowship', replacement: 'the Company', category: 'organization' },
  { original: 'Fellowship', replacement: 'Company', category: 'organization' },
  { original: 'Nine Walkers', replacement: 'Nine Wayfarers', category: 'organization' },

  { original: 'Council of Elrond', replacement: 'Council of Thalion', category: 'organization' },
  { original: 'White Council', replacement: 'Grey Council', category: 'organization' },
  { original: 'the White Council', replacement: 'the Grey Council', category: 'organization' },

  { original: 'Rangers of the North', replacement: 'Wardens of the North', category: 'organization' },
  { original: 'Rangers', replacement: 'Wardens', category: 'organization' },
  { original: 'Ranger', replacement: 'Warden', category: 'organization' },
  { original: 'Rangers of Ithilien', replacement: 'Wardens of Moonvale', category: 'organization' },

  { original: 'Tower Guard', replacement: 'Spire Guard', category: 'organization' },
  { original: 'Guards of the Citadel', replacement: 'Guards of the Citadel', category: 'organization' }, // Keep

  { original: 'Rohirrim', replacement: 'Aranadan', category: 'organization' },
  { original: 'Riders of Rohan', replacement: 'Riders of Aranada', category: 'organization' },
  { original: 'Riders of the Mark', replacement: 'Riders of Aranada', category: 'organization' },

  { original: 'Last Alliance', replacement: 'Final Alliance', category: 'organization' },
  { original: 'the Last Alliance', replacement: 'the Final Alliance', category: 'organization' },
  { original: 'Army of the Dead', replacement: 'Army of Ghosts', category: 'organization' },
  { original: 'the Dead', replacement: 'the Ghosts', category: 'organization' },
  { original: 'Oathbreakers', replacement: 'Oathbreakers', category: 'organization' }, // Keep
];

// ============================================================================
// EVENTS
// ============================================================================
export const eventMappings: CuratedMapping[] = [
  { original: 'War of the Ring', replacement: 'War of the Binding', category: 'event' },
  { original: 'Quest of the Ring', replacement: 'Quest of the Band', category: 'event' },
  { original: 'Quest of Erebor', replacement: 'Quest of Ironpeak', category: 'event' },
  { original: 'Battle of the Five Armies', replacement: 'Battle of Five Hosts', category: 'event' },
  { original: "Battle of Helm's Deep", replacement: 'Battle of Thornwall', category: 'event' },
  { original: 'Battle of the Pelennor Fields', replacement: 'Battle of Silverspire Fields', category: 'event' },
  { original: 'Siege of Gondor', replacement: 'Siege of Argenthal', category: 'event' },
  { original: 'Battle of Bywater', replacement: 'Battle of Bybrook', category: 'event' },
  { original: 'Scouring of the Shire', replacement: 'Scouring of the Shirelands', category: 'event' },
  { original: 'Council of Elrond', replacement: 'Council of Thalion', category: 'event' },
  { original: 'Long-expected Party', replacement: 'Long-expected Party', category: 'event' }, // Keep
  { original: 'Birthday Party', replacement: 'Birthday Party', category: 'event' }, // Keep
  { original: 'Destruction of the Ring', replacement: 'Destruction of the Band', category: 'event' },
  { original: 'Fall of Gondolin', replacement: 'Fall of Hidden City', category: 'event' },
  { original: 'War of Wrath', replacement: 'War of Wrath', category: 'event' }, // Keep
  { original: 'Dagor Bragollach', replacement: 'Battle of Sudden Flame', category: 'event' },
  { original: 'Nirnaeth Arnoediad', replacement: 'Battle of Unnumbered Tears', category: 'event' },
  { original: 'Downfall of Númenor', replacement: 'Downfall of Oldshore', category: 'event' },
  { original: 'Downfall of Numenor', replacement: 'Downfall of Oldshore', category: 'event' },
];

// ============================================================================
// LANGUAGES / TERMS
// ============================================================================
export const termMappings: CuratedMapping[] = [
  // Languages
  { original: 'Sindarin', replacement: 'Amtreadan', category: 'term' },
  { original: 'Quenya', replacement: 'High Amtreadan', category: 'term' },
  { original: 'Westron', replacement: 'Common Tongue', category: 'term' },
  { original: 'Black Speech', replacement: 'Shadow Tongue', category: 'term' },
  { original: 'Khuzdul', replacement: 'Forgespeech', category: 'term' },
  { original: 'Khuzdûl', replacement: 'Forgespeech', category: 'term' },
  { original: 'Rohanese', replacement: 'Aranadan', category: 'term' },
  { original: 'Rohirric', replacement: 'Aranadan', category: 'term' },

  // Ages
  { original: 'Third Age', replacement: 'Third Era', category: 'term' },
  { original: 'Second Age', replacement: 'Second Era', category: 'term' },
  { original: 'First Age', replacement: 'First Era', category: 'term' },
  { original: 'Fourth Age', replacement: 'Fourth Era', category: 'term' },

  // LotR-specific terms
  { original: 'Lord of the Rings', replacement: 'Master of the Bands', category: 'term' },
  { original: 'The Lord of the Rings', replacement: 'The Master of the Bands', category: 'term' },
  { original: 'The Hobbit', replacement: 'The Shirefolk', category: 'term' },
  { original: 'The Silmarillion', replacement: 'The Starstone Tales', category: 'term' },
  { original: 'Tolkien', replacement: 'the chronicler', category: 'term' },
  { original: "Tolkien's", replacement: "the chronicler's", category: 'term' },

  // Cultural terms
  { original: 'mathom', replacement: 'keepling', category: 'term', notes: 'Hobbit term for old useless things' },
  { original: 'Longbottom Leaf', replacement: 'Southshire Leaf', category: 'term' },
  { original: 'Old Toby', replacement: 'Old Ashford', category: 'term' },
  { original: 'pipe-weed', replacement: 'leaf-weed', category: 'term' },
  { original: 'pipeweed', replacement: 'leafweed', category: 'term' },
  { original: 'elevenses', replacement: 'elevenses', category: 'term' }, // Keep, generic
  { original: 'second breakfast', replacement: 'second breakfast', category: 'term' }, // Keep

  // Titles
  { original: 'King of Gondor', replacement: 'King of Argenthal', category: 'term' },
  { original: 'King of Rohan', replacement: 'King of Aranada', category: 'term' },
  { original: 'Steward of Gondor', replacement: 'Steward of Argenthal', category: 'term' },
  { original: 'High King', replacement: 'High King', category: 'term' }, // Keep
  { original: 'Thain', replacement: 'Thane', category: 'term' },
  { original: 'Mayor of Michel Delving', replacement: 'Mayor of Michel Hollow', category: 'term' },
  { original: 'Master of Buckland', replacement: 'Master of Brookshire', category: 'term' },
  { original: 'Shirriff', replacement: 'Sheriff', category: 'term' },
  { original: 'Shirriffs', replacement: 'Sheriffs', category: 'term' },

  // Misc
  { original: 'Shire-reckoning', replacement: 'Shire-reckoning', category: 'term' }, // Keep
  { original: 'Free Peoples', replacement: 'Free Peoples', category: 'term' }, // Keep
  { original: 'Free People', replacement: 'Free People', category: 'term' }, // Keep
];

// ============================================================================
// Combine all mappings
// ============================================================================
export const allMappings: CuratedMapping[] = [
  ...speciesMappings,
  ...hobbitMappings,
  ...wizardMappings,
  ...elfMappings,
  ...humanMappings,
  ...villainMappings,
  ...otherCharacterMappings,
  ...realmMappings,
  ...artifactMappings,
  ...organizationMappings,
  ...eventMappings,
  ...termMappings,
];

// Create lookup map (sorted by length for replacement)
export function createReplacementMap(): Map<string, string> {
  const map = new Map<string, string>();

  // Sort by original length descending (replace longer matches first)
  const sorted = [...allMappings].sort((a, b) => b.original.length - a.original.length);

  for (const mapping of sorted) {
    map.set(mapping.original, mapping.replacement);
  }

  return map;
}

// Create ID replacement map
export function createIdReplacementMap(): Map<string, string> {
  const map = new Map<string, string>();

  for (const mapping of allMappings) {
    // Create slug versions for ID replacement
    const originalSlug = mapping.original.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const replacementSlug = mapping.replacement.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    if (originalSlug && replacementSlug && originalSlug !== replacementSlug) {
      map.set(originalSlug, replacementSlug);
    }
  }

  return map;
}

// Export for use
export const replacementMap = createReplacementMap();
export const idReplacementMap = createIdReplacementMap();
