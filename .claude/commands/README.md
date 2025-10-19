# Custom Claude Code Commands

Custom slash commands for your Claude Code workflow.

## Available Commands

### `/save` - Save Session to Memory (Multi-Memory Strategy)

Manually save the current session using a **categorized multi-memory approach** for efficient retrieval.

**Usage:**
```
/save
```

**What it does:**
- Analyzes the current session and extracts key information
- Saves **multiple focused memories** instead of one large blob:
  - 📋 **Decisions** (tagged `category: "decision"`)
  - 🔨 **Implementation** (tagged `category: "implementation"`)
  - 💡 **Insights** (tagged `category: "insight"`)
  - 📝 **Code Changes** (tagged `category: "code-change"`)
  - ⏭️ **Next Steps** (tagged `category: "todo"`)
  - 🏗️ **Context** (tagged `category: "context"`)
  - 📊 **Session Summary** (tagged `category: "summary"`)
- Each memory has rich metadata (project, branch, topics, session_id, date)
- Provides confirmation with session ID for retrieving related memories

**Benefits:**
- ✅ Precise retrieval by category
- ✅ Better search relevance (smaller, focused documents)
- ✅ Flexible querying (get just decisions, or just TODOs)
- ✅ Efficient vector similarity matching

**When to use:**
- Before running `/compact` to save context
- At the end of a work session
- After making important decisions or completing significant work
- When you want to ensure information is preserved for future sessions

**Example workflow:**
1. Work on a feature or solve a problem
2. Type `/save` when you want to preserve the context
3. Claude analyzes and saves 5-7 categorized memories
4. Later sessions retrieve specific types:
   - "What decisions did we make?" → queries `category: "decision"`
   - "What are the next steps?" → queries `category: "todo"`
   - "How did we implement X?" → queries `category: "implementation"`

**Retrieval examples:**
```javascript
// Get just decisions
mcp__memory__chroma_query_documents({
  collection_name: "default",
  query_texts: ["authentication decisions"],
  where: { category: "decision" }
})

// Get TODOs for a project
mcp__memory__chroma_query_documents({
  collection_name: "default",
  query_texts: ["next steps"],
  where: { category: "todo", project: "resonance" }
})
```

See `memory-retrieval-guide.md` for more query patterns.

## Creating Custom Commands

To create your own custom command:

1. Create a new `.md` file in `~/.claude/commands/`
2. Name it `your-command-name.md` (becomes `/your-command-name`)
3. Write the prompt that should be executed when the command is called

**Example:**

Create `~/.claude/commands/review.md`:
```markdown
Review the current code for:
- Potential bugs
- Security issues
- Performance concerns
- Best practice violations

Provide specific, actionable feedback.
```

Then use it with `/review` in Claude Code.

## Tips

- Keep command prompts focused and specific
- Include clear instructions for what you want Claude to do
- Use markdown formatting for readability
- Commands are user-specific (apply to all your projects)

## Related

See `.claude/README.md` for information about:
- Mid-conversation memory triggers
- Hook configuration and customization
