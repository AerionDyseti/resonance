#!/bin/bash
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "For reference, the current date is $(date -Iseconds)."
  }
}
EOF
