Comprehensively analyze and save the current session to memory using a **multi-memory approach** for efficient retrieval.

## Strategy: Multiple Categorized Memories

Instead of one large memory, save **separate focused memories** for each category with specific tags. This enables:
- ✅ Precise retrieval by category
- ✅ Better vector similarity (smaller, focused documents)
- ✅ Flexible querying (get just decisions, or just next steps)
- ✅ Clearer organization

## Step 1: Analyze Session

Extract and organize the following from this session:

### 📋 Key Decisions
All important choices, approaches, or determinations made:
- What was decided and why
- Trade-offs considered
- Alternatives rejected

### 🔨 Implementation Details
Concrete technical work accomplished:
- Code patterns and architectures used
- APIs, libraries, and frameworks chosen
- File structures and organization
- Configuration changes

### 💡 Insights & Learnings
Important discoveries or realizations:
- "Learned that...", "Discovered...", "Important to note..."
- Performance considerations
- Security implications
- Best practices identified

### 📝 Code Changes
Specific modifications made:
- Features added or implemented
- Bugs fixed or resolved
- Refactoring completed
- Tests written

### 🎯 Current State
What's been completed and what's in progress:
- Finished tasks
- Partially complete work
- Current working state

### ⏭️ Next Steps
Outstanding work and future tasks:
- TODOs identified
- Follow-up needed
- Features to implement
- Issues to investigate

### 🏗️ Context & Rationale
Why decisions were made:
- Project-specific constraints
- Business requirements
- Technical limitations
- Design philosophy

## Step 2: Save Each Category Separately

For each category with content, save as an individual memory with category-specific tags.

### Template for Each Memory

```javascript
const sessionId = Date.now();
const project = "[project name]";
const branch = "[git branch]";
const topics = "[comma-separated topics]";

// Prepare array for multiple memories
const memories = {
  documents: [],
  ids: [],
  metadatas: []
};

// 1. DECISIONS (if any)
if (hasDecisions) {
  memories.documents.push(
    `Decision: [What was decided]

Rationale: [Why this decision was made]
Trade-offs: [What was considered]
Alternatives: [What was rejected and why]

Project: ${project}
Context: [Additional context]`
  );
  memories.ids.push(`decision_${sessionId}_1`);
  memories.metadatas.push({
    type: "decision",
    category: "decision",
    project: project,
    branch: branch,
    topics: topics,
    session_id: sessionId,
    date: new Date().toISOString()
  });
}

// 2. IMPLEMENTATION DETAILS (if any)
if (hasImplementation) {
  memories.documents.push(
    `Implementation: [What was built]

Technical Details:
- Architecture: [patterns used]
- Technologies: [frameworks, libraries, APIs]
- Files: [key files changed]
- Configuration: [config changes]

Project: ${project}`
  );
  memories.ids.push(`implementation_${sessionId}_1`);
  memories.metadatas.push({
    type: "implementation",
    category: "implementation",
    project: project,
    branch: branch,
    topics: topics,
    session_id: sessionId,
    date: new Date().toISOString()
  });
}

// 3. INSIGHTS & LEARNINGS (if any)
if (hasInsights) {
  memories.documents.push(
    `Insight: [What was learned]

Details: [Explanation]
Implications: [Why this matters]
Application: [How to use this knowledge]

Project: ${project}`
  );
  memories.ids.push(`insight_${sessionId}_1`);
  memories.metadatas.push({
    type: "insight",
    category: "insight",
    project: project,
    branch: branch,
    topics: topics,
    session_id: sessionId,
    date: new Date().toISOString()
  });
}

// 4. CODE CHANGES (if any)
if (hasCodeChanges) {
  memories.documents.push(
    `Code Change: [What was changed]

Changes Made:
- Added: [features added]
- Modified: [what was updated]
- Fixed: [bugs resolved]
- Refactored: [improvements]

Project: ${project}`
  );
  memories.ids.push(`code_change_${sessionId}_1`);
  memories.metadatas.push({
    type: "code_change",
    category: "code-change",
    project: project,
    branch: branch,
    topics: topics,
    session_id: sessionId,
    date: new Date().toISOString()
  });
}

// 5. NEXT STEPS / TODOS (if any)
if (hasNextSteps) {
  memories.documents.push(
    `Next Steps for ${project}:

TODOs:
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

Follow-up Needed:
- [Investigation needed]
- [Features to implement]

Context: [Why these are next steps]`
  );
  memories.ids.push(`next_steps_${sessionId}_1`);
  memories.metadatas.push({
    type: "next_steps",
    category: "todo",
    project: project,
    branch: branch,
    topics: topics,
    session_id: sessionId,
    date: new Date().toISOString()
  });
}

// 6. CONTEXT & RATIONALE (if any)
if (hasContext) {
  memories.documents.push(
    `Context for ${project}:

Background: [Why we're doing this]
Constraints: [Limitations we're working with]
Requirements: [What needs to be met]
Philosophy: [Design approach]

Project: ${project}`
  );
  memories.ids.push(`context_${sessionId}_1`);
  memories.metadatas.push({
    type: "context",
    category: "context",
    project: project,
    branch: branch,
    topics: topics,
    session_id: sessionId,
    date: new Date().toISOString()
  });
}

// 7. SESSION SUMMARY (small overview)
memories.documents.push(
  `Session Summary: [Brief title]

Covered: ${topics}
Project: ${project}
Branch: ${branch}

Quick Overview:
- ${hasDecisions ? '✓' : '○'} Decisions made
- ${hasImplementation ? '✓' : '○'} Implementation completed
- ${hasInsights ? '✓' : '○'} Insights gained
- ${hasCodeChanges ? '✓' : '○'} Code changes
- ${hasNextSteps ? '✓' : '○'} Next steps identified

Related Memory IDs: ${sessionId}`
);
memories.ids.push(`session_${sessionId}`);
memories.metadatas.push({
  type: "session_summary",
  category: "summary",
  project: project,
  branch: branch,
  topics: topics,
  session_id: sessionId,
  date: new Date().toISOString()
});

// Save all memories at once
mcp__memory__chroma_add_documents({
  collection_name: "default",
  documents: memories.documents,
  ids: memories.ids,
  metadatas: memories.metadatas
})
```

## Step 3: Confirm

After saving, provide:
1. ✅ Number of memories saved (e.g., "Saved 5 memories: 2 decisions, 1 implementation, 1 insight, 1 next steps, 1 summary")
2. 📊 Session ID for reference
3. 🔍 Example queries:
   - `query_texts: ["decisions about authentication"]` + `where: {category: "decision"}`
   - `query_texts: ["implementation details"]` + `where: {category: "implementation"}`
   - `query_texts: ["next steps"]` + `where: {category: "todo"}`

## Quality Guidelines

**DO**:
- Be specific and concrete
- Include WHY, not just WHAT
- Use technical terms and exact names
- Capture rationale and context
- Note any caveats or limitations

**DON'T**:
- Save generic conversation summaries
- Include verbose explanations
- Duplicate information
- Save low-value content
- Omit critical context
