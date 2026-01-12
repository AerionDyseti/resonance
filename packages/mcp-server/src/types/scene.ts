/**
 * Scene System for AIRP
 *
 * Scenes are active containers that drive play forward.
 * The scene.json file is Claude's working memory during play.
 */

import type { Entity } from './entity.js';
import type { Connection } from './connection.js';
import type {
  SceneId,
  LocationId,
  CharacterId,
  StoryId,
  ChronicleId,
  SessionId,
  EntityId,
} from './ids.js';

// =============================================================================
// Scene Sub-structures
// =============================================================================

/** Stakes for a scene - what's at risk */
export interface SceneStakes {
  success: string; // What happens if PC achieves goal
  failure: string; // What happens if PC fails
  stalemate?: string; // What happens if neither resolves
}

/** Pressure pushing the scene forward */
export interface ScenePressure {
  sourceId: CharacterId; // NPC creating pressure
  direction: string; // What they're pushing toward
  urgency: 1 | 2 | 3 | 4 | 5;
}

/** Trigger for scene escalation */
export interface EscalationTrigger {
  condition: string; // e.g., "Player hasn't acted in 3 exchanges"
  action: string; // e.g., "Baron's guard enters with urgent news"
}

/** Ticking clock constraint */
export interface TimeConstraint {
  deadline: string; // When time runs out
  consequence: string; // What happens if deadline passes
}

/** Sensory atmosphere details */
export interface SensoryDetails {
  sight?: string;
  sound?: string;
  smell?: string;
  touch?: string;
  taste?: string;
}

/** Game event that occurred during a scene */
export interface GameEvent {
  timestamp: string;
  description: string;
  involvedEntityIds: string[];
  type: 'action' | 'discovery' | 'dialogue' | 'consequence' | 'mechanical';
}

// =============================================================================
// Scene Properties
// =============================================================================

/** Time of day options */
export type TimeOfDay =
  | 'dawn'
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'dusk'
  | 'evening'
  | 'night'
  | 'late_night';

/** Scene status */
export type SceneStatus = 'active' | 'paused' | 'resolved' | 'abandoned';

/** Dramatic arc phase */
export type ScenePhase = 'setup' | 'rising' | 'climax' | 'falling' | 'resolution';

/** Scene-specific properties */
export interface SceneProperties {
  // === Required ===
  locationId: LocationId;
  status: SceneStatus;
  presentCharacterIds: CharacterId[];

  // === Dramatic Core ===
  centralTension?: string;
  stakes?: SceneStakes;
  phase?: ScenePhase;
  heat?: number; // 1-5, current tension level

  // === Temporal ===
  timeOfDay?: TimeOfDay;
  weather?: string;
  timeConstraint?: TimeConstraint;

  // === Participants ===
  pcId?: CharacterId;
  hiddenCharacterIds?: CharacterId[];

  // === Atmosphere ===
  mood?: string;
  sensoryDetails?: SensoryDetails;

  // === Scene Dynamics ===
  pressures?: ScenePressure[];
  exitConditions?: string[];
  escalationTriggers?: EscalationTrigger[];

  // === Tracking ===
  discoveries?: string[];
  openQuestions?: string[];
  foreshadowing?: string[];
  callbacks?: string[];

  // === Mechanical ===
  activeMechanics?: string[];
  resources?: Record<string, number>;

  // === Continuity ===
  previousSceneId?: SceneId;
  resolution?: string;

  // === Flexible Extension ===
  // For fields not yet promoted to first-class properties
  // Scan this to discover patterns worth formalizing
  extra?: Record<string, string>;
}

// =============================================================================
// Scene Entity
// =============================================================================

/** Scene entity with typed properties */
export interface Scene extends Entity<SceneId, SceneProperties> {
  type: 'scene';
}

// =============================================================================
// Scene File (scene.json structure)
// =============================================================================

/** Context loaded from MCP at scene start */
export interface SceneContext {
  // Location details
  location: Entity<LocationId>;

  // Characters present
  characters: Entity<CharacterId>[];

  // Relevant connections (involving present characters)
  connections: Connection[];

  // What the PC knows about entities in scene
  pcKnowledge: Connection[];

  // Active storylines touching this scene
  activeStories: Entity<StoryId>[];

  // NPC goals/agendas for this scene
  npcAgendas: Array<{
    characterId: CharacterId;
    goals: string[];
    secrets?: string[];
  }>;
}

/** Working section - created/modified during play */
export interface SceneWorking {
  newEntities: Entity<EntityId>[];
  modifiedEntities: Entity<EntityId>[];
  newConnections: Connection[];
  modifiedConnections: Connection[];
  events: GameEvent[];
}

/**
 * Complete scene.json file structure
 * This is the LLM's working memory during play
 */
export interface SceneFile {
  // Active scene metadata
  scene: Scene;

  // Loaded from MCP at scene start (read-mostly)
  context: SceneContext;

  // Created/modified during play (persisted at sync)
  working: SceneWorking;

  // Session metadata
  chronicleId: ChronicleId;
  sessionId: SessionId;
  sceneNumber: number; // Within the session

  // Sync tracking
  lastSyncedAt: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

/** Create an empty working section */
export function createEmptyWorking(): SceneWorking {
  return {
    newEntities: [],
    modifiedEntities: [],
    newConnections: [],
    modifiedConnections: [],
    events: [],
  };
}

/** Check if working section has changes to persist */
export function hasWorkingChanges(working: SceneWorking): boolean {
  return (
    working.newEntities.length > 0 ||
    working.modifiedEntities.length > 0 ||
    working.newConnections.length > 0 ||
    working.modifiedConnections.length > 0 ||
    working.events.length > 0
  );
}

/** Add an event to the working section */
export function recordEvent(
  working: SceneWorking,
  event: Omit<GameEvent, 'timestamp'>
): SceneWorking {
  return {
    ...working,
    events: [...working.events, { ...event, timestamp: new Date().toISOString() }],
  };
}

/** Get all character IDs involved in a scene (present + hidden) */
export function getAllCharacterIds(scene: Scene): CharacterId[] {
  const present = scene.properties.presentCharacterIds || [];
  const hidden = scene.properties.hiddenCharacterIds || [];
  return [...present, ...hidden];
}
