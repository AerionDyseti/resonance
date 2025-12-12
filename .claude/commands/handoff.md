---
description: Save session to vector memory + project handoff file
---

Create vector memories and a handoff report in `.claude/handoffs/`.

## 1. Extract & Store Memories

Review session for significant items. Follow memory rules in CLAUDE.md.

**Extract:** Decisions, implementations, insights, blockers, next-steps, context.
**Skip:** Pleasantries, ephemeral states, duplicates.

## 2. Write Handoff

Create `.claude/handoffs/YYYY-MM-DD-HHmm.md`:

```markdown
# Handoff - Resonance
**Date:** YYYY-MM-DD HH:mm | **Branch:** [branch]

## Summary
[2-3 sentences: primary goal, current status]

## Completed
- [items with file paths]

## In Progress / Blocked
- [items with current state or blockers]

## Key Decisions
- [decisions made and why]

## Next Steps
- [concrete actions]

## Memory IDs
[list IDs from store calls]
```

## 3. Cleanup Old Handoffs

Keep only 3 most recent. Before deleting old handoffs:
1. Read "Memory IDs" section
2. Verify each ID exists via `get_memory`
3. Re-store missing memories if still relevant
4. Delete old handoff file

## 4. Report

Tell user: memories stored (count), handoff path, cleanups.
Instruct: "Run `/clear`, then `/startup` to resume."
