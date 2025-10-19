# Claude Code Configuration

This directory contains project-specific Claude Code configuration for the Resonance project.

## Current Setup

This is a **minimal configuration** focused on developer productivity without automated session tracking.

### 📋 settings.json

Current settings:
- **Status Line**: Custom status display via `ccstatusline`
- **Permissions**: Auto-approved commands for common operations
- **Mid-Conversation Hook**: Natural language memory triggers (currently enabled)
- **Git Attribution**: Disabled (`includeCoAuthoredBy: false`)

### 🪝 hooks/

**Currently Active:**
- **core/mid-conversation.js**: Natural language memory trigger (on `UserPromptSubmit`)
  - Detects phrases like "what did we decide", "remind me how"
  - Automatically suggests relevant memory queries
  - Configured via `config.json` for pattern matching

### 📝 commands/

Custom slash commands:
- **/save**: Manually save session context to memory using categorized approach

## Setup

### First Time on New Machine

1. **Install hook dependencies** (if using mid-conversation hook):
   ```bash
   cd .claude/hooks
   npm install
   ```

2. **Verify mid-conversation hook**:
   ```bash
   node core/mid-conversation.js
   ```
   Set the environment variable `CLAUDE_CODE_USER_PROMPT` to test:
   ```bash
   CLAUDE_CODE_USER_PROMPT="what did we decide about X" node core/mid-conversation.js
   ```

3. **Claude Code automatically**:
   - Loads settings.json
   - Runs mid-conversation hook on user prompts
   - Auto-approves configured commands

## How It Works

### Mid-Conversation Memory Trigger

When you send a message, the hook analyzes it for memory-related patterns:

**Instant triggers** (high confidence):
- "what did we decide about..."
- "remind me how..."
- "according to our previous..."

**Fast triggers** (medium confidence):
- Technical terms (architecture, database, authentication)
- Continuation phrases ("continue", "next steps")

When triggered, Claude suggests querying the MCP memory server for relevant context.

### Manual Memory Save

Use the `/save` command when you want to preserve important context:
- Analyzes current session
- Saves categorized memories (decisions, implementation, insights, etc.)
- Each memory tagged for precise retrieval

## Permissions

**Auto-approved** (no confirmation):
- All `git` read commands (status, diff, log, show, blame)
- All `gh` commands (GitHub CLI)
- All `uv` commands (Python package manager)
- Package managers: `npm`, `yarn`, `pnpm` (list, view, install)
- File operations: `cd`, `ls`, `pwd`, `mkdir`, `cp`, `cat`, `chmod`
- MCP servers: `memory` and `context7`

**Requires confirmation**:
- `git commit`, `git push`
- `npm publish`, `npm uninstall`
- `node`, `python` scripts
- `mv`, `rm` (destructive operations)

## Memory System

Uses the MCP memory server (Chroma) to:
- Store project decisions, implementations, and insights
- Retrieve context when you reference past work
- Maintain continuity across sessions

**Manual workflow:**
1. Work on a feature
2. Use `/save` to store important context
3. Later sessions: Ask "what did we decide about X"
4. Mid-conversation hook suggests memory query
5. Retrieve relevant context on demand

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

### Disable Mid-Conversation Hook

Remove or comment out the `UserPromptSubmit` hook in `settings.json`:

```json
{
  "hooks": {
    // "UserPromptSubmit": [...]
  }
}
```

Or set `disableAllHooks: true` to disable everything including status line.

## Troubleshooting

### Hook Not Triggering?
1. Check Node.js is installed: `node --version`
2. Verify dependencies: `cd .claude/hooks && npm install`
3. Test manually: `CLAUDE_CODE_USER_PROMPT="remind me how" node core/mid-conversation.js`
4. Check cooldown period hasn't blocked it (see `.claude/hooks/.last-trigger`)

### Memory Not Working?
1. Verify MCP memory server is configured in your Claude Code settings
2. Test memory access: Use MCP tools to list/query collections
3. Check Chroma is running if using remote server

## Further Reading

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Hooks Documentation](https://docs.claude.com/en/docs/claude-code/hooks)
- [MCP Server Documentation](https://modelcontextprotocol.io/)
