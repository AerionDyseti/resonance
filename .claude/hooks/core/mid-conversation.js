#!/usr/bin/env node

/**
 * Mid-Conversation Memory Hook
 * Detects natural language patterns and suggests memory retrieval
 */

const fs = require('fs');
const path = require('path');

// Load utilities
const { PatternDetector } = require('../utilities/pattern-detector');

class MidConversationHook {
    constructor(configPath) {
        // Load configuration
        this.config = this.loadConfig(configPath);

        // Initialize pattern detector
        const profile = this.config.performance.profiles[this.config.performance.defaultProfile];
        this.patternDetector = new PatternDetector({
            ...this.config.naturalTriggers,
            patterns: this.config.patterns,
            triggerThreshold: this.config.naturalTriggers.triggerThreshold
        });

        // Enabled tiers based on performance profile
        this.enabledTiers = profile.enabledTiers || ['instant'];

        // Cooldown tracking
        this.lastTriggerFile = path.join(path.dirname(configPath), '.last-trigger');
        this.cooldownPeriod = this.config.naturalTriggers.cooldownPeriod || 30000;

        // Map pattern categories to memory categories
        this.patternToMemoryCategory = {
            'explicitMemoryRequests': 'general',  // Could be any category
            'pastWorkReferences': 'implementation',
            'questionPatterns': 'general',
            'technicalDiscussions': 'implementation',
            'projectContinuity': 'todo',
            'problemSolving': 'insight'
        };
    }

    /**
     * Load configuration from JSON file
     */
    loadConfig(configPath) {
        try {
            const data = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Return default config if file doesn't exist
            return {
                naturalTriggers: {
                    enabled: true,
                    sensitivity: 0.7,
                    triggerThreshold: 0.6,
                    cooldownPeriod: 30000
                },
                performance: {
                    defaultProfile: 'balanced',
                    profiles: {
                        balanced: {
                            enabledTiers: ['instant', 'fast']
                        }
                    }
                },
                patterns: {}
            };
        }
    }

    /**
     * Check if cooldown period is active
     */
    isInCooldown() {
        try {
            if (!fs.existsSync(this.lastTriggerFile)) {
                return false;
            }

            const lastTriggerTime = parseInt(fs.readFileSync(this.lastTriggerFile, 'utf8'));
            const elapsed = Date.now() - lastTriggerTime;

            return elapsed < this.cooldownPeriod;
        } catch {
            return false;
        }
    }

    /**
     * Record trigger time
     */
    recordTrigger() {
        try {
            fs.writeFileSync(this.lastTriggerFile, Date.now().toString());
        } catch {
            // Ignore write errors
        }
    }

    /**
     * Analyze message for memory trigger patterns
     */
    analyze(userMessage) {
        if (!this.config.naturalTriggers.enabled) {
            return this.createResult(false, 'Natural triggers disabled', 0);
        }

        if (!userMessage || userMessage.trim().length === 0) {
            return this.createResult(false, 'Empty message', 0);
        }

        // Check cooldown
        if (this.isInCooldown()) {
            return this.createResult(false, 'Cooldown period active', 0);
        }

        // Detect patterns
        const patternResults = this.patternDetector.detectPatterns(
            userMessage,
            this.enabledTiers
        );

        // Determine if should trigger
        if (patternResults.shouldTrigger) {
            this.recordTrigger();

            return this.createResult(
                true,
                this.formatTriggerMessage(patternResults, userMessage),
                patternResults.confidence,
                patternResults
            );
        }

        return this.createResult(false, 'No patterns matched', patternResults.confidence);
    }

    /**
     * Detect memory category from message content
     */
    detectMemoryCategoryFromMessage(message) {
        const lowerMessage = message.toLowerCase();

        // Check for decision-related keywords
        if (/\b(decid|decision|chose|choice|pick|select)\w*\b/.test(lowerMessage)) {
            return 'decision';
        }

        // Check for implementation/how keywords
        if (/\b(implement|built|build|creat|coded|code|develop|how (did|do|we|i))\w*\b/.test(lowerMessage)) {
            return 'implementation';
        }

        // Check for next steps/todo keywords
        if (/\b(next|todo|should|continu|proceed|step)\w*\b/.test(lowerMessage)) {
            return 'todo';
        }

        // Check for insight/learning keywords
        if (/\b(learn|discover|insight|realiz|found out|understand)\w*\b/.test(lowerMessage)) {
            return 'insight';
        }

        return null;
    }

    /**
     * Format trigger message for Claude Code
     */
    formatTriggerMessage(results, userMessage = '') {
        const messages = [];

        messages.push('🧠 Memory context may be helpful:');

        // Group matches by category
        const byCategory = {};
        for (const match of results.matches) {
            if (!byCategory[match.category]) {
                byCategory[match.category] = [];
            }
            byCategory[match.category].push(match);
        }

        // Show top categories and determine suggested memory category
        let suggestedMemoryCategory = null;
        let highestConfidence = 0;

        for (const [category, matches] of Object.entries(byCategory)) {
            const topMatch = matches.reduce((a, b) => a.confidence > b.confidence ? a : b);
            messages.push(`  • ${topMatch.description} (${(topMatch.confidence * 100).toFixed(0)}% confidence)`);

            // Track highest confidence category for suggestion
            if (topMatch.confidence > highestConfidence) {
                highestConfidence = topMatch.confidence;
                suggestedMemoryCategory = this.patternToMemoryCategory[category] || 'general';
            }
        }

        // Check if message content suggests a specific category
        const messageCategory = this.detectMemoryCategoryFromMessage(userMessage);
        if (messageCategory) {
            suggestedMemoryCategory = messageCategory;
        }

        messages.push('');
        messages.push('**Suggested Query:**');

        // Provide category-specific query suggestion
        if (suggestedMemoryCategory && suggestedMemoryCategory !== 'general') {
            messages.push('```javascript');
            messages.push('mcp__memory__chroma_query_documents({');
            messages.push('  collection_name: "default",');
            messages.push('  query_texts: ["your search terms"],');
            messages.push(`  where: { category: "${suggestedMemoryCategory}" },`);
            messages.push('  n_results: 5');
            messages.push('})');
            messages.push('```');
            messages.push('');
            messages.push(`Searching in category: **${suggestedMemoryCategory}**`);
            messages.push(this.getCategoryDescription(suggestedMemoryCategory));
        } else {
            // General search without category filter
            messages.push('```javascript');
            messages.push('mcp__memory__chroma_query_documents({');
            messages.push('  collection_name: "default",');
            messages.push('  query_texts: ["your search terms"],');
            messages.push('  n_results: 5');
            messages.push('})');
            messages.push('```');
            messages.push('');
            messages.push('Or filter by category:');
            messages.push('  • `{category: "decision"}` - Key decisions');
            messages.push('  • `{category: "implementation"}` - Technical details');
            messages.push('  • `{category: "todo"}` - Next steps');
            messages.push('  • `{category: "insight"}` - Learnings');
        }

        return messages.join('\n');
    }

    /**
     * Get description for memory category
     */
    getCategoryDescription(category) {
        const descriptions = {
            'decision': '  → Past decisions, rationale, trade-offs',
            'implementation': '  → Code patterns, architectures, technical details',
            'todo': '  → Next steps, pending tasks, follow-ups',
            'insight': '  → Learnings, discoveries, important notes',
            'code-change': '  → Specific code modifications, features added',
            'context': '  → Background, constraints, requirements'
        };
        return descriptions[category] || '';
    }

    /**
     * Create standardized result object
     */
    createResult(shouldTrigger, message, confidence, details = null) {
        return {
            shouldTrigger,
            message,
            confidence: Math.round(confidence * 100) / 100,
            details,
            timestamp: new Date().toISOString()
        };
    }
}

// Main execution
function main() {
    // Get user message from environment variable
    const userMessage = process.env.CLAUDE_CODE_USER_PROMPT;

    // Gracefully skip if no message (slash commands, system events)
    if (!userMessage || userMessage.trim().length === 0) {
        if (process.env.DEBUG_HOOKS) {
            console.error('[Hook Debug] No user message - likely slash command, skipping');
        }
        process.exit(0);  // Exit successfully, not an error
    }

    // Skip slash commands explicitly
    if (userMessage.trim().startsWith('/')) {
        if (process.env.DEBUG_HOOKS) {
            console.error('[Hook Debug] Slash command detected, skipping');
        }
        process.exit(0);
    }

    // Get config path
    const configPath = path.join(__dirname, '../config.json');

    // Create hook instance and analyze
    const hook = new MidConversationHook(configPath);
    const result = hook.analyze(userMessage);

    // Output based on result
    if (result.shouldTrigger) {
        // For Claude Code, we output a PREPEND message
        console.log(`PREPEND: ${result.message}`);

        // Also log to stderr for debugging (won't affect Claude Code)
        if (process.env.DEBUG_HOOKS) {
            console.error('[Hook Debug]', JSON.stringify(result, null, 2));
        }
    } else {
        // Silent when not triggering (no output to Claude Code)
        if (process.env.DEBUG_HOOKS) {
            console.error('[Hook Debug] No trigger:', result.message);
        }
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { MidConversationHook };
