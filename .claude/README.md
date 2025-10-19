# Claude Code Configuration

This directory contains project-specific Claude Code configuration that ensures consistent behavior across machines.

## What's Included

### 📋 settings.json
Project-level settings including:
- **Status Line**: Custom command-line status display
- **Permissions**: Auto-approved commands (gh, specific git operations)
- **Hooks**: Automated workflows triggered during conversations

### 🪝 hooks/
Automated hooks that enhance Claude's memory and context awareness:

- **core/mid-conversation.js**: Natural language memory triggers
  - Automatically detects when you reference past work
  - Triggers memory retrieval based on patterns like "what did we decide", "remind me how"
  - Uses pattern matching for instant, fast, and intensive context loading

- **core/session-start.js**: Auto-loads context at session start
  - Retrieves recent project memories
  - Includes git context and project status

- **core/session-end.js**: Saves session summaries
  - Extracts key decisions, insights, code changes
  - Stores in Chroma memory for future retrieval

- **config.json**: Hook configuration
  - Pattern definitions for memory triggers
  - Performance profiles (speed_focused, balanced, memory_aware)
  - Session start/end settings

### 📝 commands/
Custom slash commands for quick actions:
- **/save**: Save important context to memory
- Other project-specific commands

## Setup

### First Time (Desktop/New Machine)

1. **Install Node Dependencies** (for hooks):
   ```bash
   cd .claude/hooks
   npm install
   ```

2. **Verify Hooks Work**:
   ```bash
   node core/session-start.js
   ```

3. **Claude Code will automatically**:
   - Load settings.json
   - Use project-level hooks
   - Auto-approve configured commands

### How It Works

When you start a Claude Code session in this project:

1. **Session Start Hook** runs:
   - Loads recent project memories from Chroma
   - Provides git context (current branch, recent commits)
   - Sets up project-specific context

2. **Mid-Conversation Hook** monitors your messages:
   - Detects patterns like "what did we decide about X"
   - Automatically queries memory for relevant context
   - Prepends relevant memories to Claude's context

3. **Session End Hook** runs when session ends:
   - Summarizes what was accomplished
   - Extracts key decisions and insights
   - Saves to memory for future sessions

## Memory System

The hooks use a Chroma database (MCP server) to:
- Store project context, decisions, and insights
- Retrieve relevant information when you ask about past work
- Maintain continuity across sessions

This means you can ask things like:
- "What did we decide about the database schema?"
- "Remind me how we implemented authentication"
- "What were we working on last?"

And Claude will automatically pull the relevant context from memory!

## Customization

### Adjust Hook Sensitivity

Edit `.claude/hooks/config.json`:

```json
{
  "naturalTriggers": {
    "sensitivity": 0.7,        // Lower = less sensitive
    "triggerThreshold": 0.6,   // Confidence threshold
    "cooldownPeriod": 30000    // ms between triggers
  }
}
```

### Performance Profiles

Choose between:
- **speed_focused**: Fast, minimal latency (instant tier only)
- **balanced**: Good mix (instant + fast tiers) - DEFAULT
- **memory_aware**: Deep context (all tiers, slower)

Change in `config.json`:
```json
{
  "performance": {
    "defaultProfile": "balanced"  // or "speed_focused" or "memory_aware"
  }
}
```

## Permissions

Auto-approved commands (no confirmation needed):
- All `gh` (GitHub CLI) commands
- Specific git operations (see settings.json)
- MCP memory operations
- MCP Serena operations

Still requires confirmation:
- `git push` commands (safety)

## Troubleshooting

### Hooks Not Running?
1. Check `cd .claude/hooks && npm install` was run
2. Verify Node.js is installed: `node --version`
3. Check hook script permissions: `chmod +x .claude/hooks/core/*.js`

### Memory Not Working?
1. Ensure MCP memory server is running
2. Check Chroma collection exists: Use MCP tools to verify
3. Review hook logs if debug is enabled in config.json

### Want to Disable Hooks Temporarily?
Comment out the hooks section in `.claude/settings.json`:

```json
{
  "hooks": {
    // "UserPromptSubmit": [...]
  }
}
```

## Further Reading

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
- [MCP Server Documentation](https://modelcontextprotocol.io/)
