// All Games available to current user.
resonance-api.dyseti.com/games/

// Base game information, including entity types.
resonance-api.dyseti.com/games/GAME_ID/

// Information about which entities this game tracks
resonance-api.dyseti.com/games/GAME_ID/entities

// Information related to a single entity_type.
resonance-api.dyseti.com/games/GAME_ID/entities/ENTITY_TYPE

// Information related to all entities of that type.
resonance-api.dyseti.com/games/GAME_ID/entities/ENTITY_TYPE

resonance-api.dyseti.com/games/GAME_ID/entities/ENTITY_TYPE/schema		// get schema
resonance-api.dyseti.com/games/GAME_ID/entities/ENTITY_TYPE/ENTITY_ID	// get specific entitiy


EXAMPLES:
resonance.api.dyseti.com/games/perfect-gray/entities
resonance-api.dyseti.com/games/shards-of-xenirith/entities/factions
resonance-api.dyseti.com/games/skull-and-shackles/entities/equipment/the-black-blade

OUTPUT FOR AN ENTITTY:
{
	"name": "entity-one"
	"display-name": "Entity 1"
	"base": "props",
	"goHere": true,
	"propGroupI": {
		"display-name": "Property Group I",
		"propA": {
			"displayName": "Property A",
			"type": "text"
			"value": "AAAAAAAAAA"
		}
	},
	"propGroupII": {
		"display-name": "Property Group II",
		"propB": {
			"displayName": "Property B",
			"type": "number"
			"value": 42
		}
	}
}

entity.propGroup1.propA.displayName
entity.propGroup2.propB.type