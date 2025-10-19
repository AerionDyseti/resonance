#!/usr/bin/env node

/**
 * Session Start Hook
 * Automatically loads relevant memories at the beginning of each conversation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SessionStartHook {
    constructor(configPath) {
        this.config = this.loadConfig(configPath);
        this.maxMemories = this.config.sessionStart?.maxMemories || 5;
        this.enabled = this.config.sessionStart?.enabled !== false;

        // Track if already shown this session
        this.sessionMarkerFile = path.join(path.dirname(configPath), '.session-start-shown');
    }

    loadConfig(configPath) {
        try {
            const data = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(data);
        } catch {
            return {
                sessionStart: {
                    enabled: true,
                    maxMemories: 5,
                    includeProjectContext: true,
                    includeGitContext: true
                }
            };
        }
    }

    /**
     * Detect project context from environment
     */
    detectProjectContext() {
        const cwd = process.env.CLAUDE_CODE_CWD || process.cwd();
        const projectName = path.basename(cwd);

        let gitBranch = null;
        let recentCommits = [];

        try {
            // Check if in git repo
            execSync('git rev-parse --git-dir', { cwd, stdio: 'pipe' });

            // Get current branch
            gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf8' }).trim();

            // Get recent commits
            const commits = execSync('git log --oneline -5', { cwd, encoding: 'utf8' })
                .trim()
                .split('\n')
                .filter(Boolean);

            recentCommits = commits;
        } catch {
            // Not a git repo or git not available
        }

        return {
            projectName,
            workingDirectory: cwd,
            gitBranch,
            recentCommits,
            isGitRepo: gitBranch !== null
        };
    }

    /**
     * Build suggested memory query
     */
    buildMemoryQuery(projectContext) {
        const parts = [];

        // Add project name
        if (projectContext.projectName) {
            parts.push(projectContext.projectName);
        }

        // Add git branch context
        if (projectContext.gitBranch) {
            parts.push(projectContext.gitBranch);
        }

        // Add generic programming terms for relevance
        parts.push('development', 'implementation', 'decision');

        return parts.join(' ');
    }

    /**
     * Generate context message that instructs Claude to load memories
     */
    generateContextMessage(projectContext) {
        const lines = [];

        lines.push('📂 **Session Context**');
        lines.push('');
        lines.push(`**Project**: ${projectContext.projectName}`);
        lines.push(`**Directory**: ${projectContext.workingDirectory}`);

        if (projectContext.isGitRepo) {
            lines.push(`**Git Branch**: ${projectContext.gitBranch}`);

            if (projectContext.recentCommits.length > 0) {
                lines.push('');
                lines.push('**Recent Commits**:');
                projectContext.recentCommits.slice(0, 3).forEach(commit => {
                    lines.push(`  • ${commit}`);
                });
            }
        }

        lines.push('');
        lines.push('---');
        lines.push('');
        lines.push('🧠 **Loading relevant memories from previous sessions...**');
        lines.push('');
        lines.push(`Please query and display relevant memories for this project using:`);
        lines.push('');
        lines.push('```javascript');
        lines.push('mcp__memory__chroma_query_documents({');
        lines.push('  collection_name: "default",');
        lines.push(`  query_texts: ["${this.buildMemoryQuery(projectContext)}"],`);
        lines.push(`  n_results: ${this.maxMemories},`);
        lines.push(`  where: { project: "${projectContext.projectName}" }`);
        lines.push('})');
        lines.push('```');
        lines.push('');
        lines.push('After displaying the memories, summarize what we were working on.');

        return lines.join('\n');
    }

    /**
     * Check if already shown in this session
     */
    hasAlreadyShown() {
        try {
            if (!fs.existsSync(this.sessionMarkerFile)) {
                return false;
            }

            // Check if file is from current session (within last 10 minutes)
            const stats = fs.statSync(this.sessionMarkerFile);
            const age = Date.now() - stats.mtimeMs;
            const TEN_MINUTES = 10 * 60 * 1000;

            if (age > TEN_MINUTES) {
                // Old marker file, clean it up
                fs.unlinkSync(this.sessionMarkerFile);
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Mark as shown for this session
     */
    markAsShown() {
        try {
            fs.writeFileSync(this.sessionMarkerFile, Date.now().toString());
        } catch (error) {
            if (process.env.DEBUG_HOOKS) {
                console.error('[Session Start] Could not create marker file:', error.message);
            }
        }
    }

    /**
     * Run session start hook
     */
    run() {
        if (!this.enabled) {
            return;
        }

        // Only show once per session
        if (this.hasAlreadyShown()) {
            if (process.env.DEBUG_HOOKS) {
                console.error('[Session Start] Already shown in this session, skipping');
            }
            return;
        }

        try {
            // Detect project context
            const projectContext = this.detectProjectContext();

            // Generate message instructing Claude to load memories
            const message = this.generateContextMessage(projectContext);

            // Output as PREPEND for Claude Code
            console.log(`PREPEND: ${message}`);

            // Mark as shown
            this.markAsShown();

            // Debug output if enabled
            if (process.env.DEBUG_HOOKS) {
                console.error('[Session Start] Project context detected:', projectContext);
            }
        } catch (error) {
            if (process.env.DEBUG_HOOKS) {
                console.error('[Session Start] Error:', error.message);
            }
        }
    }
}

// Main execution
function main() {
    const configPath = path.join(__dirname, '../config.json');
    const hook = new SessionStartHook(configPath);
    hook.run();
}

if (require.main === module) {
    main();
}

module.exports = { SessionStartHook };
