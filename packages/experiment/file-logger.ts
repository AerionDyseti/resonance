/**
 * Simple file logger for debugging and analysis
 *
 * Logs to packages/experiment/logs/ with timestamps
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const LOGS_DIR = join(import.meta.dir, 'logs');

// Ensure logs directory exists
if (!existsSync(LOGS_DIR)) {
  mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Get ISO timestamp string for filenames and log entries
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Get date-based log filename (one file per day)
 */
function getLogFilename(prefix: string): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return join(LOGS_DIR, `${prefix}-${date}.log`);
}

/**
 * Append a log entry to a file
 */
function appendLog(filename: string, content: string): void {
  const timestamp = getTimestamp();
  const entry = `\n${'='.repeat(80)}\n[${timestamp}]\n${content}\n`;

  try {
    // filename is already a full path from getLogFilename()
    writeFileSync(filename, entry, { flag: 'a' });
  } catch (error) {
    console.error('Failed to write log:', error);
  }
}

/**
 * Log LLM request/response pair
 */
export function logLLMCall(request: unknown, response: unknown): void {
  const content = [
    'REQUEST:',
    JSON.stringify(request, null, 2),
    '',
    'RESPONSE:',
    JSON.stringify(response, null, 2),
  ].join('\n');

  const filename = getLogFilename('llm-calls');
  appendLog(filename, content);
}

/**
 * Log context expansion event
 */
export function logContextExpansion(
  iteration: number,
  capability: string,
  params: unknown,
  entitiesAdded: number
): void {
  const content = [
    `ITERATION ${iteration} - Context Expansion`,
    `Capability: ${capability}`,
    `Params: ${JSON.stringify(params)}`,
    `Entities added: ${entitiesAdded}`,
  ].join('\n');

  const filename = getLogFilename('context-expansion');
  appendLog(filename, content);
}
