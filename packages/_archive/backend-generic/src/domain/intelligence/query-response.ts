import type { EntityId } from '../shared/ids';
import type { InfoRequest } from './info-capability';

/**
 * Confidence level for answers
 * - high: Answer is well-supported by context
 * - medium: Answer is partially supported, some inference made
 * - low: Answer required significant inference or context was limited
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Source reference for answer provenance
 * Tracks which entities contributed to the answer
 */
export interface AnswerSource {
  /** Entity that provided information */
  entityId: EntityId;
  /** Brief description of what information was used */
  contribution: string;
  /** Relevance score (0-1) */
  relevance: number;
}

/**
 * Answer - LLM has enough context to answer the query
 */
export interface Answer {
  type: 'answer';
  /** The natural language answer to the user's query */
  content: string;
  /** Confidence level of the answer */
  confidence: ConfidenceLevel;
  /** Sources that contributed to this answer */
  sources: AnswerSource[];
  /** Optional follow-up questions the user might want to ask */
  suggestedFollowUps?: string[];
}

/**
 * NeedsMoreInfo - LLM needs additional context to answer
 * Contains specific requests for what information is needed
 */
export interface NeedsMoreInfo {
  type: 'needs_more_info';
  /** What information is needed and why */
  reason: string;
  /** Specific requests for additional information */
  requests: InfoRequest[];
}

/**
 * QueryResponse - Discriminated union of possible LLM responses
 *
 * The LLM can either:
 * 1. Provide an Answer if it has sufficient context
 * 2. Request NeedsMoreInfo with specific InfoRequests
 *
 * The domain layer enforces a maximum number of NeedsMoreInfo responses
 * (typically 3) before forcing the LLM to provide a best-effort answer.
 */
export type QueryResponse = Answer | NeedsMoreInfo;

// ==================== Type Guards ====================

/**
 * Check if response is an Answer
 */
export function isAnswer(response: QueryResponse): response is Answer {
  return response.type === 'answer';
}

/**
 * Check if response is NeedsMoreInfo
 */
export function isNeedsMoreInfo(response: QueryResponse): response is NeedsMoreInfo {
  return response.type === 'needs_more_info';
}

// ==================== Factory Functions ====================

/**
 * Create an Answer response
 */
export function createAnswer(params: {
  content: string;
  confidence: ConfidenceLevel;
  sources: AnswerSource[];
  suggestedFollowUps?: string[];
}): Answer {
  if (params.content.trim().length === 0) {
    throw new Error('Answer content cannot be empty');
  }

  return {
    type: 'answer',
    content: params.content.trim(),
    confidence: params.confidence,
    sources: params.sources,
    suggestedFollowUps: params.suggestedFollowUps,
  };
}

/**
 * Create a NeedsMoreInfo response
 */
export function createNeedsMoreInfo(params: {
  reason: string;
  requests: InfoRequest[];
}): NeedsMoreInfo {
  if (params.requests.length === 0) {
    throw new Error('NeedsMoreInfo must include at least one request');
  }

  return {
    type: 'needs_more_info',
    reason: params.reason.trim(),
    requests: params.requests,
  };
}

/**
 * Create a forced answer when max info requests exceeded
 * Used when the LLM has run out of NeedsMoreInfo attempts
 */
export function createForcedAnswer(params: { content: string; sources: AnswerSource[] }): Answer {
  return {
    type: 'answer',
    content: params.content.trim(),
    confidence: 'low',
    sources: params.sources,
    suggestedFollowUps: [
      'Would you like me to try a different approach to answering this question?',
    ],
  };
}
