#!/usr/bin/env bun
/**
 * Interactive Intelligence Query Runner
 *
 * Run queries against your world data using the RAG system.
 *
 * Usage:
 *   bun run packages/experiment/run-query.ts                      # Interactive mode (homebrew)
 *   bun run packages/experiment/run-query.ts --lotr               # Interactive mode (LotR)
 *   bun run packages/experiment/run-query.ts "Your question"      # Single query mode
 *   bun run packages/experiment/run-query.ts --lotr "Question"    # Single query mode (LotR)
 *   bun run packages/experiment/run-query.ts --json "Question"    # JSON output mode (machine-readable)
 *   bun run packages/experiment/run-query.ts --lotr --json "Q"    # JSON output mode with LotR data
 */

import { join } from 'path';
import * as readline from 'readline';

// Note: Bun automatically loads .env files from the current directory
// For this script, create packages/experiment/.env with OPENROUTER_API_KEY

import { initializeTestData, initializeLotrData, TestDataStore } from './test-data-loader';
import { createOrchestrator, IntelligenceOrchestrator } from './intelligence-orchestrator';

// ==================== Spinner ====================

class Spinner {
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private currentFrame = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private message = '';

  start(message: string): void {
    this.message = message;
    this.currentFrame = 0;
    process.stdout.write(`\r${this.frames[0]} ${message}`);

    this.interval = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      process.stdout.write(`\r${this.frames[this.currentFrame]} ${this.message}`);
    }, 80);
  }

  update(message: string): void {
    this.message = message;
  }

  stop(finalMessage?: string): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    // Clear the spinner line
    process.stdout.write('\r' + ' '.repeat(this.message.length + 10) + '\r');
    if (finalMessage) {
      console.log(finalMessage);
    }
  }
}

// ==================== Interactive REPL ====================

class InteractiveRunner {
  private rl: readline.Interface;
  private orchestrator: IntelligenceOrchestrator;
  private dataStore: TestDataStore;
  private spinner: Spinner;
  private worldName: string;

  constructor(dataStore: TestDataStore, worldName: string) {
    this.dataStore = dataStore;
    this.worldName = worldName;
    this.orchestrator = createOrchestrator(dataStore);
    this.spinner = new Spinner();

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start(): Promise<void> {
    console.log('\n' + '═'.repeat(60));
    console.log(`  Intelligence Query Runner - ${this.worldName}`);
    console.log('═'.repeat(60));
    console.log('\nType your questions below. Commands:');
    console.log('  /quit, /exit, /q  - Exit the runner');
    console.log('  /stats            - Show data statistics');
    console.log('  /help             - Show this help\n');

    await this.loop();
  }

  private async loop(): Promise<void> {
    while (true) {
      const query = await this.prompt('❯ ');

      if (!query.trim()) continue;

      // Handle commands
      if (query.startsWith('/')) {
        const handled = await this.handleCommand(query.trim().toLowerCase());
        if (handled === 'exit') break;
        continue;
      }

      // Run query
      await this.runQuery(query);
    }

    this.rl.close();
    console.log('\nGoodbye!\n');
  }

  private prompt(promptText: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(promptText, (answer) => {
        resolve(answer);
      });
    });
  }

  private async handleCommand(command: string): Promise<'continue' | 'exit'> {
    switch (command) {
      case '/quit':
      case '/exit':
      case '/q':
        return 'exit';

      case '/stats': {
        const entities = this.dataStore.getAllEntities();
        const byType: Record<string, number> = {};
        for (const e of entities) {
          byType[e.definitionId] = (byType[e.definitionId] || 0) + 1;
        }
        console.log(`\n  Total entities: ${entities.length}`);
        for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
          console.log(`    ${type}: ${count}`);
        }
        console.log('');
        return 'continue';
      }

      case '/help':
        console.log('\nCommands:');
        console.log('  /quit, /exit, /q  - Exit the runner');
        console.log('  /stats            - Show data statistics');
        console.log('  /help             - Show this help\n');
        return 'continue';

      default:
        console.log(`Unknown command: ${command}\n`);
        return 'continue';
    }
  }

  private async runQuery(query: string): Promise<void> {
    console.log('\n' + '─'.repeat(60));

    try {
      const startTime = Date.now();

      // Wrap the orchestrator query with spinner
      const result = await this.queryWithSpinner(query);

      const elapsed = Date.now() - startTime;

      // Display results
      console.log('\n' + '─'.repeat(60));
      console.log(`Answer (${result.confidence} confidence):\n`);
      console.log(result.answer);

      if (result.sources.length > 0) {
        console.log('\nSources:');
        for (const source of result.sources) {
          console.log(`  • ${source.name}: ${source.contribution}`);
        }
      }

      console.log('\n' + '─'.repeat(40));
      console.log(
        `Iterations: ${result.iterations} | Tokens: ${result.totalTokens} | Time: ${elapsed}ms`
      );
      console.log('─'.repeat(60) + '\n');
    } catch (error) {
      this.spinner.stop();
      console.error('\nError:', error);
      console.log('');
    }
  }

  private async queryWithSpinner(
    query: string
  ): Promise<Awaited<ReturnType<IntelligenceOrchestrator['query']>>> {
    // Override console.log temporarily to integrate with spinner
    const originalLog = console.log;
    let iteration = 0;

    console.log = (...args: unknown[]) => {
      const message = args.map((a) => String(a)).join(' ');

      // Detect iteration changes
      if (message.includes('[Iteration')) {
        const match = message.match(/\[Iteration (\d+)\]/);
        if (match) iteration = parseInt(match[1]);
        this.spinner.update(`Iteration ${iteration} - Thinking...`);
        return;
      }

      // Detect LLM calls
      if (message.includes('[Calling LLM...]')) {
        this.spinner.update(`Iteration ${iteration} - Calling LLM...`);
        return;
      }

      // Detect search operations
      if (message.includes('[SEARCH_ENTITIES]')) {
        const queryMatch = message.match(/query="([^"]+)"/);
        if (queryMatch) {
          this.spinner.update(`Iteration ${iteration} - Searching: "${queryMatch[1]}"...`);
        }
        return;
      }

      // Detect info fulfillment
      if (message.includes('[Fulfilling')) {
        this.spinner.update(`Iteration ${iteration} - Gathering info...`);
        return;
      }

      // Show entities being added - pause spinner, log, resume
      if (message.includes('Added:')) {
        this.spinner.stop();
        originalLog(`  ✓ ${message.replace('Added:', 'Found:').trim()}`);
        this.spinner.start(`Iteration ${iteration} - Continuing...`);
        return;
      }

      // Show initial context
      if (message.includes('[Initial context:')) {
        this.spinner.stop();
        const entities = message.match(/\[Initial context: (.+)\]/)?.[1] || '';
        originalLog(`  ✓ Initial context: ${entities}`);
        this.spinner.start(`Iteration ${iteration || 1} - Processing...`);
        return;
      }

      // Skip other internal logs during spinner
      if (
        message.startsWith('[') ||
        message.includes('Reason:') ||
        message.includes('No new entities')
      ) {
        return;
      }

      // Pass through other logs
      this.spinner.stop();
      originalLog(...args);
    };

    this.spinner.start('Starting query...');

    try {
      const result = await this.orchestrator.query(query);
      this.spinner.stop();
      return result;
    } finally {
      console.log = originalLog;
      this.spinner.stop();
    }
  }
}

// ==================== Single Query Mode ====================

async function runSingleQuery(
  orchestrator: IntelligenceOrchestrator,
  query: string
): Promise<void> {
  const spinner = new Spinner();

  console.log('\n' + '='.repeat(60));
  console.log(`Query: "${query}"`);
  console.log('='.repeat(60));

  try {
    const startTime = Date.now();
    spinner.start('Processing query...');

    const result = await orchestrator.query(query);

    spinner.stop();
    const elapsed = Date.now() - startTime;

    console.log('\n' + '='.repeat(60));
    console.log('RESULT');
    console.log('='.repeat(60));
    console.log(`\nAnswer (${result.confidence} confidence):\n`);
    console.log(result.answer);

    if (result.sources.length > 0) {
      console.log('\nSources:');
      for (const source of result.sources) {
        console.log(`  - ${source.name} (${source.entityId}): ${source.contribution}`);
      }
    }

    console.log('\n---');
    console.log(`Iterations: ${result.iterations}`);
    console.log(`Total tokens: ${result.totalTokens}`);
    console.log(`Time: ${elapsed}ms`);
  } catch (error) {
    spinner.stop();
    console.error('\nError:', error);
    process.exit(1);
  }
}

// ==================== JSON Output Mode ====================

interface JsonOutput {
  success: boolean;
  query: string;
  answer?: string;
  confidence?: 'high' | 'medium' | 'low';
  sources?: Array<{ entityId: string; name: string; contribution: string }>;
  iterations?: number;
  totalTokens?: number;
  elapsedMs?: number;
  error?: string;
}

async function runJsonQuery(orchestrator: IntelligenceOrchestrator, query: string): Promise<void> {
  // Suppress all console output during execution
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};

  const startTime = Date.now();
  let output: JsonOutput;

  try {
    const result = await orchestrator.query(query);
    const elapsedMs = Date.now() - startTime;

    output = {
      success: true,
      query,
      answer: result.answer,
      confidence: result.confidence,
      sources: result.sources,
      iterations: result.iterations,
      totalTokens: result.totalTokens,
      elapsedMs,
    };
  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    output = {
      success: false,
      query,
      error: error instanceof Error ? error.message : String(error),
      elapsedMs,
    };
  } finally {
    // Restore console functions
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }

  // Output clean JSON to stdout
  console.log(JSON.stringify(output, null, 2));

  // Exit with appropriate code
  process.exit(output.success ? 0 : 1);
}

// ==================== Main ====================

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const useLotr = args.includes('--lotr');
  const useJson = args.includes('--json');
  const queryArgs = args.filter((arg) => !arg.startsWith('--'));
  const query = queryArgs[0];

  // Check for API key
  if (!process.env.OPENROUTER_API_KEY) {
    if (useJson) {
      console.log(
        JSON.stringify(
          { success: false, query: query || '', error: 'OPENROUTER_API_KEY not set' },
          null,
          2
        )
      );
      process.exit(1);
    }
    console.error('Error: OPENROUTER_API_KEY not set.');
    console.error('Create a .env file in packages/experiment/ with your key:');
    console.error('  OPENROUTER_API_KEY=sk-or-v1-your-key-here');
    process.exit(1);
  }

  // JSON mode requires a query
  if (useJson && !query) {
    console.log(
      JSON.stringify(
        { success: false, query: '', error: 'JSON mode requires a query argument' },
        null,
        2
      )
    );
    process.exit(1);
  }

  // Load appropriate data source
  const worldName = useLotr ? 'Middle-earth (LotR)' : 'Homebrew World';

  // Suppress loading message in JSON mode
  if (!useJson) {
    console.log(`Loading ${worldName} data...`);
  }

  // Suppress all logs during data loading in JSON mode
  const originalLog = console.log;
  if (useJson) {
    console.log = () => {};
  }

  let dataStore: TestDataStore;
  if (useLotr) {
    // Use curated test data (scrambled LotR-based world data)
    const lotrDataDir = join(import.meta.dir, '..', '..', 'test-data', 'world-curated');
    dataStore = initializeLotrData(lotrDataDir);
  } else {
    const testDataDir = join(import.meta.dir, '..', '..', 'test-data', 'world');
    dataStore = initializeTestData(testDataDir);
  }

  // Restore console.log after loading
  if (useJson) {
    console.log = originalLog;
  }

  const orchestrator = createOrchestrator(dataStore);

  if (useJson) {
    // JSON output mode - machine-readable
    await runJsonQuery(orchestrator, query);
  } else if (query) {
    // Single query mode - human-readable
    await runSingleQuery(orchestrator, query);
  } else {
    // Interactive mode
    const runner = new InteractiveRunner(dataStore, worldName);
    await runner.start();
  }
}

main();
