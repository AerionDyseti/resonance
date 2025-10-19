#!/usr/bin/env node

/**
 * Session End Hook
 * Analyzes conversation and stores key information to memory
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SessionEndHook {
    constructor(configPath) {
        this.config = this.loadConfig(configPath);
        this.enabled = this.config.sessionEnd?.enabled !== false;
        this.minSessionLength = this.config.sessionEnd?.minSessionLength || 100;
    }

    loadConfig(configPath) {
        try {
            const data = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(data);
        } catch {
            return {
                sessionEnd: {
                    enabled: true,
                    minSessionLength: 100,
                    extractTopics: true,
                    extractDecisions: true,
                    extractNextSteps: true
                }
            };
        }
    }

    /**
     * Detect project context
     */
    detectProjectContext() {
        const cwd = process.env.CLAUDE_CODE_CWD || process.cwd();
        const projectName = path.basename(cwd);

        let gitBranch = null;
        try {
            execSync('git rev-parse --git-dir', { cwd, stdio: 'pipe' });
            gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf8' }).trim();
        } catch {}

        return { projectName, workingDirectory: cwd, gitBranch };
    }

    /**
     * Analyze conversation to extract key information
     */
    analyzeConversation(conversationText) {
        const analysis = {
            topics: new Set(),
            decisions: [],
            insights: [],
            codeChanges: [],
            nextSteps: [],
            sessionLength: conversationText.length
        };

        const lowerText = conversationText.toLowerCase();

        // Extract topics (simple keyword matching)
        const topicKeywords = {
            'implementation': /implement|implementing|implementation|build|building|create|creating/g,
            'debugging': /debug|debugging|bug|error|fix|fixing|issue|problem/g,
            'architecture': /architecture|design|structure|pattern|framework|system/g,
            'testing': /test|testing|unit test|integration|coverage/g,
            'database': /database|db|sql|query|schema|migration/g,
            'api': /api|endpoint|rest|service|interface/g,
            'configuration': /config|configuration|setup|environment|settings/g
        };

        for (const [topic, regex] of Object.entries(topicKeywords)) {
            if (regex.test(lowerText)) {
                analysis.topics.add(topic);
            }
        }

        // Extract decisions
        const decisionPatterns = [
            /decided to (.+?)[.!?\n]/gi,
            /will use (.+?)[.!?\n]/gi,
            /chose to (.+?)[.!?\n]/gi,
            /going with (.+?)[.!?\n]/gi
        ];

        for (const pattern of decisionPatterns) {
            const matches = [...conversationText.matchAll(pattern)];
            for (const match of matches.slice(0, 3)) {
                if (match[1] && match[1].length > 10 && match[1].length < 150) {
                    analysis.decisions.push(match[1].trim());
                }
            }
        }

        // Extract insights/learnings
        const insightPatterns = [
            /learned that (.+?)[.!?\n]/gi,
            /discovered (.+?)[.!?\n]/gi,
            /important to (.+?)[.!?\n]/gi,
            /key finding (.+?)[.!?\n]/gi
        ];

        for (const pattern of insightPatterns) {
            const matches = [...conversationText.matchAll(pattern)];
            for (const match of matches.slice(0, 3)) {
                if (match[1] && match[1].length > 10 && match[1].length < 150) {
                    analysis.insights.push(match[1].trim());
                }
            }
        }

        // Extract code changes
        if (/```/.test(conversationText)) {
            const changePatterns = [
                /added (.+?)[.!?\n]/gi,
                /created (.+?)[.!?\n]/gi,
                /implemented (.+?)[.!?\n]/gi,
                /modified (.+?)[.!?\n]/gi,
                /fixed (.+?)[.!?\n]/gi
            ];

            for (const pattern of changePatterns) {
                const matches = [...conversationText.matchAll(pattern)];
                for (const match of matches.slice(0, 4)) {
                    if (match[1] && match[1].length > 10 && match[1].length < 150) {
                        analysis.codeChanges.push(match[1].trim());
                    }
                }
            }
        }

        // Extract next steps
        const nextStepPatterns = [
            /(?:next|todo|need to|should|will) (.+?)[.!?\n]/gi,
            /(?:plan to|going to|continue) (.+?)[.!?\n]/gi
        ];

        for (const pattern of nextStepPatterns) {
            const matches = [...conversationText.matchAll(pattern)];
            for (const match of matches.slice(0, 4)) {
                if (match[1] && match[1].length > 10 && match[1].length < 150 &&
                    !match[1].toLowerCase().includes('remind') &&
                    !match[1].toLowerCase().includes('what did')) {
                    analysis.nextSteps.push(match[1].trim());
                }
            }
        }

        return {
            topics: Array.from(analysis.topics),
            decisions: [...new Set(analysis.decisions)].slice(0, 3),
            insights: [...new Set(analysis.insights)].slice(0, 3),
            codeChanges: [...new Set(analysis.codeChanges)].slice(0, 4),
            nextSteps: [...new Set(analysis.nextSteps)].slice(0, 4),
            sessionLength: analysis.sessionLength
        };
    }

    /**
     * Generate memory storage suggestion with analysis
     */
    generateStorageMessage(projectContext, analysis) {
        const lines = [];

        // Load comprehensive prompt
        const promptPath = path.join(__dirname, 'memory-save-prompt.md');
        let comprehensivePrompt = '';
        try {
            comprehensivePrompt = fs.readFileSync(promptPath, 'utf8');
        } catch {
            // Fallback if prompt file doesn't exist
        }

        lines.push('💾 **Session Analysis & Save Instructions**');
        lines.push('');
        lines.push('**Detected Session Information:**');
        lines.push('');

        if (analysis.topics.length > 0) {
            lines.push(`📋 **Topics**: ${analysis.topics.join(', ')}`);
        }

        if (analysis.decisions.length > 0) {
            lines.push('');
            lines.push('🎯 **Key Decisions**:');
            analysis.decisions.forEach(d => lines.push(`  • ${d}`));
        }

        if (analysis.insights.length > 0) {
            lines.push('');
            lines.push('💡 **Insights**:');
            analysis.insights.forEach(i => lines.push(`  • ${i}`));
        }

        if (analysis.codeChanges.length > 0) {
            lines.push('');
            lines.push('🔨 **Code Changes**:');
            analysis.codeChanges.forEach(c => lines.push(`  • ${c}`));
        }

        if (analysis.nextSteps.length > 0) {
            lines.push('');
            lines.push('⏭️ **Next Steps**:');
            analysis.nextSteps.forEach(n => lines.push(`  • ${n}`));
        }

        lines.push('');
        lines.push('---');
        lines.push('');

        // Include comprehensive prompt
        if (comprehensivePrompt) {
            lines.push(comprehensivePrompt);
        } else {
            // Minimal fallback
            lines.push('**Save this session using:**');
            lines.push('');
            lines.push('```javascript');
            lines.push('mcp__memory__chroma_add_documents({');
            lines.push('  collection_name: "default",');
            lines.push('  documents: ["Your comprehensive summary here"],');
            lines.push('  ids: [`session_${Date.now()}`],');
            lines.push('  metadatas: [{');
            lines.push(`    project: "${projectContext.projectName}",`);
            if (projectContext.gitBranch) {
                lines.push(`    branch: "${projectContext.gitBranch}",`);
            }
            if (analysis.topics.length > 0) {
                lines.push(`    topics: "${analysis.topics.join(', ')}",`);
            }
            lines.push('    session_date: new Date().toISOString()');
            lines.push('  }]');
            lines.push('})');
            lines.push('```');
        }

        return lines.join('\n');
    }

    /**
     * Run session end hook
     */
    run() {
        if (!this.enabled) {
            return;
        }

        try {
            // Get conversation data from Claude Code environment
            const conversationJson = process.env.CLAUDE_CODE_CONVERSATION_JSON;

            if (!conversationJson) {
                if (process.env.DEBUG_HOOKS) {
                    console.error('[Session End] No conversation data available');
                }
                return;
            }

            // Parse conversation
            const conversation = JSON.parse(conversationJson);
            const conversationText = conversation.messages
                ?.map(m => m.content || '')
                .join('\n') || '';

            // Check minimum length
            if (conversationText.length < this.minSessionLength) {
                if (process.env.DEBUG_HOOKS) {
                    console.error('[Session End] Session too short to analyze');
                }
                return;
            }

            // Detect project
            const projectContext = this.detectProjectContext();

            // Analyze conversation
            const analysis = this.analyzeConversation(conversationText);

            // Check if we found anything meaningful
            const totalItems = analysis.topics.length + analysis.decisions.length +
                              analysis.insights.length + analysis.codeChanges.length +
                              analysis.nextSteps.length;

            if (totalItems === 0) {
                if (process.env.DEBUG_HOOKS) {
                    console.error('[Session End] No meaningful content to save');
                }
                return;
            }

            // Generate message
            const message = this.generateStorageMessage(projectContext, analysis);

            // Output as PREPEND for Claude Code
            console.log(`PREPEND: ${message}`);

            // Debug output
            if (process.env.DEBUG_HOOKS) {
                console.error('[Session End] Analysis:', JSON.stringify(analysis, null, 2));
            }
        } catch (error) {
            if (process.env.DEBUG_HOOKS) {
                console.error('[Session End] Error:', error.message);
            }
        }
    }
}

// Main execution
function main() {
    const configPath = path.join(__dirname, '../config.json');
    const hook = new SessionEndHook(configPath);
    hook.run();
}

if (require.main === module) {
    main();
}

module.exports = { SessionEndHook };
