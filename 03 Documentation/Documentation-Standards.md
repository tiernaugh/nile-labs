# Documentation Standards for Nile Labs

## Overview
This document defines how we create, organize, and maintain documentation for the Nile Labs platform.

## Core Principle: Canonical Documents Only

**One source of truth for each topic.** We maintain canonical documents that are continuously updated rather than creating document sprawl.

### Anti-Sprawl Rules
1. **Update, don't duplicate** - If information exists, update that document
2. **Consolidate related content** - Merge similar documents into one comprehensive doc
3. **Delete working drafts** - Once decisions are made, remove drafts and update the canonical doc
4. **Use sections, not new files** - Add sections to existing docs rather than creating new ones
5. **Reference, don't repeat** - Link to existing information instead of duplicating it

## Where to Find Information

### Quick Reference
- **What we're building:** PRD-001 (platform overview) or feature-specific PRD
- **How we're building it:** ADR documents in relevant feature folder
- **Current status:** Session Context files for recent work
- **Cultural/strategic context:** /02 Areas/ documents
- **Technical setup:** ADR-001 and ADR-003

### Document Hierarchy
1. **PRDs and ADRs** - Formal, versioned source of truth
2. **Session Contexts** - Temporary bridges between work sessions
3. **Area Documents** - Strategic context and planning
4. **Archive** - Historical reference only

## Document Types

### 1. Product Requirements Documents (PRDs)
**Purpose:** Define what we're building and why  
**Naming:** `PRD-XXX-Brief-Title.md`  
**Location:** `/03 Documentation/[feature-area]/`  
**Template:** See PRD-001 for structure  

### 2. Architecture Decision Records (ADRs)
**Purpose:** Document technical decisions and trade-offs  
**Naming:** `ADR-XXX-Brief-Title.md`  
**Location:** `/03 Documentation/[feature-area]/`  
**Template:** See ADR-001 for structure  

### 3. Context Documents
**Purpose:** Capture strategic context, philosophy, culture  
**Naming:** Descriptive names (e.g., `Context Brief.md`)  
**Location:** `/02 Areas/[Relevant Area]/`  

### 4. Working Documents
**Purpose:** Active planning, notes, reviews  
**Naming:** Descriptive names  
**Location:** `/02 Areas/[Relevant Area]/`  

## Numbering Convention

### PRDs
- Start at PRD-001
- Sequential numbering
- Never reuse numbers
- Deprecated PRDs keep their number

### ADRs  
- Start at ADR-001
- Sequential numbering
- Never reuse numbers
- Superseded ADRs keep their number

## Document Lifecycle

### Status Values
- **Draft** - Under development
- **Proposed** - Ready for review
- **Approved** - Accepted and active
- **Deprecated** - No longer relevant
- **Superseded** - Replaced by newer document

### Required Metadata
Every PRD and ADR must include:
```markdown
### **Document Metadata**
**Document ID:** [PRD-XXX or ADR-XXX]
**Title:** [Brief descriptive title]
**Date:** [Creation date]
**Last Updated:** [Last modification date]
**Status:** [Draft|Proposed|Approved|Deprecated|Superseded]
**Authors:** [Team or individuals]
**Related PRDs:** [List of related PRDs]
**Related ADRs:** [List of related ADRs]
**Supersedes:** [Previous document if applicable]
**Superseded By:** [Newer document if applicable]
```

## Folder Structure

### Overall Project Structure
```
/02 Areas/Nile Labs/
├── 01 Active Development/     # Current work
├── 02 Areas/                  # Organized by topic
│   ├── Early project shape/   # Initial planning
│   ├── Culture & Rituals/     # Cultural documentation
│   ├── Advisory Panel/        # Strategic advisors
│   ├── Session Context/       # Chat session continuity
│   └── .../
├── 03 Documentation/           # Formal docs organized by feature
│   ├── CLAUDE.md              # Documentation organization guide
│   ├── Documentation-Standards.md
│   ├── platform-core/         # Core platform docs
│   │   ├── PRD-001-Platform-v1.md
│   │   ├── ADR-001-Technical-Architecture.md
│   │   ├── ADR-002-Data-Export-Strategy.md
│   │   └── ADR-003-Frontend-First-Prototyping.md
│   ├── [feature-area]/        # Feature-specific docs
│   │   ├── PRD-XXX-Feature.md
│   │   └── ADR-XXX-Decision.md
│   └── .../
└── 04 Archive/                # Deprecated content
```

### Documentation Folder Organization
**Key Principle:** Documentation is organized by feature area, not document type.

- Each feature or domain gets its own folder
- PRDs and ADRs live together in feature folders
- Global sequential numbering across all folders
- See [/03 Documentation/CLAUDE.md](./CLAUDE.md) for detailed structure

## Change Management

### Making Changes
1. Update the document
2. Update "Last Updated" date
3. Add entry to Change Log
4. Update status if needed
5. Update CLAUDE.md index

### Change Log Format
```markdown
### **Change Log**

**v1.1 (23 Aug 2024):**
- Brief description of changes
- Another change
- Related updates

**v1.0 (22 Aug 2024):**
- Initial document created
```

## Cross-References

### Internal Links
- Use relative paths when possible
- Reference document IDs (PRD-001, ADR-002)
- Keep related documents in same folder when logical

### External Links
- Include links to relevant external documentation
- Add link title for context
- Archive important external content locally if critical

## Review Process

### PRDs
1. Draft created by product team
2. Technical review by engineering
3. Stakeholder review
4. Approval and status change

### ADRs
1. Draft created by technical team
2. Peer review by engineering
3. Impact assessment
4. Approval and implementation

## Canonical Document Guidelines

### When to Create vs Update

**Create a new document when:**
- Starting a completely new feature area
- Making a distinct architectural decision
- The topic is genuinely separate from existing docs

**Update existing document when:**
- Adding details to an existing feature
- Clarifying previous decisions
- Expanding on requirements
- Correcting or refining information

### Document Consolidation

**Signs of sprawl:**
- Multiple documents about the same feature
- Overlapping information across files
- Confusion about where to find something
- Drafts and finals coexisting

**How to consolidate:**
1. Identify the canonical document
2. Merge all related content into it
3. Update version and change log
4. Archive or delete redundant files
5. Update all references

### Finding the Right Document

**Before creating a new document, check:**
1. Does a PRD exist for this feature? → Update it
2. Does an ADR exist for this decision? → Update it
3. Is this temporary context? → Use Session Context
4. Is this strategic planning? → Use /02 Areas/

## Best Practices

### Writing Style
- Clear and concise
- Use bullet points over paragraphs
- Include examples where helpful
- Define acronyms on first use

### Maintenance
- **Daily:** Update session contexts
- **Weekly:** Consolidate related documents
- **Monthly:** Archive outdated content
- **Quarterly:** Review for relevance

### Versioning
- Use semantic versioning in Change Log
- Major changes increment first digit
- Minor changes increment second digit
- Keep all versions in same file
- Always update "Last Updated" date

## Templates

### Quick PRD Template
```markdown
# PRD-XXX: [Title]

## Document Metadata
**Document ID:** PRD-XXX
**Feature Area:** [Feature Name]
**Location:** /03 Documentation/[feature-folder]/
[Rest of metadata block]

## Overview
- Purpose
- Success Criteria

## User Stories
- As a [user], I want to [action], so that [benefit]

## Requirements
- Functional requirements
- Non-functional requirements

## Out of Scope
- What we're not doing

## Success Metrics
- How we measure success

## Change Log
- Version history
```

### Quick ADR Template
```markdown
# ADR-XXX: [Title]

## Document Metadata
**ADR ID:** ADR-XXX
**Feature Area:** [Feature Name or "Platform Core"]
**Location:** /03 Documentation/[feature-folder]/
[Rest of metadata block]

## Status
[Current status]

## Context
Why this decision is needed

## Decision
What we decided

## Consequences
- Positive outcomes
- Negative trade-offs

## Alternatives Considered
What else we evaluated

## Change Log
- Version history
```

---

*This document itself follows the standards it defines. Use it as a reference for all Nile Labs documentation.*