# Memory Retrieval Guide

Quick reference for querying categorized memories.

## Memory Categories

Each memory is tagged with a specific category:

| Category | Type | Use For |
|----------|------|---------|
| `decision` | Key decisions | "What did we decide about...?" |
| `implementation` | Technical details | "How did we implement...?" |
| `insight` | Learnings | "What did we learn about...?" |
| `code-change` | Code modifications | "What code was changed...?" |
| `todo` | Next steps | "What are the next steps...?" |
| `context` | Background/rationale | "Why are we doing...?" |
| `summary` | Session overview | "What happened in session...?" |

## Query Patterns

### Get Decisions Only

```javascript
mcp__memory__chroma_query_documents({
  collection_name: "default",
  query_texts: ["authentication decision"],
  where: { category: "decision" },
  n_results: 5
})
```

### Get Implementation Details

```javascript
mcp__memory__chroma_query_documents({
  collection_name: "default",
  query_texts: ["database implementation"],
  where: { category: "implementation" },
  n_results: 5
})
```

### Get All TODOs for a Project

```javascript
mcp__memory__chroma_query_documents({
  collection_name: "default",
  query_texts: ["next steps"],
  where: {
    category: "todo",
    project: "resonance"
  },
  n_results: 10
})
```

### Get Recent Insights

```javascript
mcp__memory__chroma_get_documents({
  collection_name: "default",
  where: { category: "insight" },
  limit: 5,
  include: ["documents", "metadatas"]
})
```

### Get All Memories from a Session

```javascript
mcp__memory__chroma_get_documents({
  collection_name: "default",
  where: { session_id: 1729296000000 },  // Use actual session ID
  include: ["documents", "metadatas"]
})
```

### Combined Filters

```javascript
// Get code changes in a specific project and branch
mcp__memory__chroma_query_documents({
  collection_name: "default",
  query_texts: ["authentication code"],
  where: {
    category: "code-change",
    project: "resonance",
    branch: "main"
  },
  n_results: 5
})
```

## Natural Language Examples

Instead of manually querying, you can use natural language:

**"What decisions did we make about authentication?"**
→ Triggers memory hook → Suggests querying with `category: "decision"`

**"What are the next steps for the database?"**
→ Triggers memory hook → Suggests querying with `category: "todo"`

**"Remind me what we implemented for the API"**
→ Triggers memory hook → Suggests querying with `category: "implementation"`

## Tips

1. **Start broad, then filter**: Query with text first, add category filters if too many results
2. **Use project filter**: Narrow down by project name for focused results
3. **Session IDs**: Save the session ID from saves to retrieve all related memories
4. **Combine categories**: Query multiple types with `$or` operator (check Chroma docs)
