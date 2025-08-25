# Session Context Management

## Purpose
Session context files help maintain continuity between different LLM chat sessions. When starting a new chat, load the most recent session context to quickly get the AI up to speed on project status, recent decisions, and next steps.

## How to Use Session Contexts

### Starting a New Chat Session
1. Start your prompt with: "Load @'02 Areas/Session Context/[latest-session].md'"
2. The AI will read the context and understand where you left off
3. Continue working from that point

### Ending a Chat Session
1. Ask the AI to "Create a session context file for today's work"
2. The AI will create a new dated session file
3. This captures decisions, progress, and next steps

## Session File Naming Convention
```
Session-XXX.md
```

Example: `Session-001.md`, `Session-002.md`

Sequential numbering starting from 001. Date is included inside the file metadata.

## What Goes in a Session Context

### Required Sections
- **Session Summary** - What was accomplished
- **Key Decisions** - Important choices made
- **Files Changed** - What was created/modified
- **Current State** - Where things stand now
- **Next Steps** - What to do next
- **Open Questions** - Unresolved items
- **Context for Next Session** - Critical info to remember

### Optional Sections
- **Blockers** - Things preventing progress
- **Technical Notes** - Implementation details
- **Stakeholder Feedback** - Input received
- **Ideas Parked** - Things to revisit later

## Template Location
See [Session-Context-Template.md](./Session-Context-Template.md) for the standard format.

## Best Practices

### Do's
- Create a session context at the end of significant work sessions
- Include specific file paths and document IDs
- Note any decisions that override previous plans
- List concrete next actions
- Include any new dependencies or requirements

### Don'ts
- Don't duplicate information already in PRDs/ADRs
- Don't include entire code blocks (reference files instead)
- Don't forget to note assumptions made
- Don't skip creating one if major decisions were made

## Maintenance

### Weekly Review
- Archive session contexts older than 2 weeks to `/04 Archive/Session Contexts/`
- Keep only the 5 most recent sessions in active folder
- Update this CLAUDE.md if patterns emerge

### When to Merge Sessions
If multiple sessions cover the same work without breaks, merge them into a single context file.

## Quick Commands for AI

### Create Session Context
"Create a session context file for today's work"

### Load Latest Context
"Load the latest session context"

### Summarize Recent Sessions
"Summarize the last 3 session contexts"

### Archive Old Sessions
"Archive session contexts older than 2 weeks"

---

## Current Active Sessions

| Session | Date | Key Focus |
|---------|------|-----------|
| [Session-001](./Session-001.md) | 2024-08-23 | Project definition, advisory panel, documentation structure |
| [Session-002](./Session-002.md) | 2024-08-25 | Advisor feedback, anti-sprawl docs, T3 setup prep |

---

*Remember: Session contexts are temporary bridges between chats. The source of truth remains in formal documentation (PRDs, ADRs, etc.)*