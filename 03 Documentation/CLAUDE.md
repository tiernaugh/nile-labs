# Documentation Organization Guide

## Anti-Sprawl Principles

### One Source of Truth
**Every topic has ONE canonical document.** Before creating new documents, always check if the information belongs in an existing one.

### Document Discipline
- **Update PRD-001** for platform-wide changes
- **Update feature PRDs** for feature-specific changes  
- **Update ADRs** for technical decisions
- **Never duplicate** - always reference
- **Consolidate regularly** - merge related documents

### Quick Decision Tree
```
Is this about an existing feature?
  YES → Update that feature's PRD or ADR
  NO → Is this a new feature?
    YES → Create new folder and PRD
    NO → Is this a technical decision?
      YES → Create/update ADR in relevant folder
      NO → Is this temporary context?
        YES → Use Session Context
        NO → Update relevant existing document
```

## Folder Structure

Documentation is organized by feature area or domain, not by document type. Each area contains its own PRDs, ADRs, and related documentation.

```
/03 Documentation/
├── CLAUDE.md                           # This file
├── Documentation-Standards.md          # Global standards
├── platform-core/                      # Core platform decisions
│   ├── ADR-001-Technical-Architecture.md
│   ├── ADR-002-Data-Export-Strategy.md
│   ├── ADR-003-Frontend-First-Prototyping.md
│   └── PRD-001-Platform-v1.md
├── experiment-creation/                # Experiment creation feature
│   ├── PRD-002-Experiment-Creation.md
│   ├── ADR-004-Creation-Flow.md
│   └── UX-Research.md
├── activity-feed/                      # Activity feed feature
│   ├── PRD-003-Activity-Feed.md
│   ├── ADR-005-Real-Time-Updates.md
│   └── Performance-Considerations.md
├── fork-system/                        # Forking functionality
│   ├── PRD-004-Fork-System.md
│   ├── ADR-006-Fork-Lineage.md
│   └── Fork-Visualization-Concepts.md
├── auth-system/                        # Authentication
│   ├── ADR-007-Clerk-Integration.md
│   └── Domain-Restrictions.md
└── [feature-area]/                     # New areas as needed
    ├── PRD-XXX-Feature-Name.md
    ├── ADR-XXX-Decision.md
    └── Supporting-Docs.md
```

## Naming Conventions

### Folder Names
- **Format:** `feature-area/` (lowercase, hyphenated)
- **Examples:** 
  - `experiment-creation/`
  - `activity-feed/`
  - `user-profiles/`
  - `data-export/`

### Document Numbering
- PRDs and ADRs use **global sequential numbering** across all folders
- This ensures unique identifiers regardless of location
- Format: `PRD-XXX-Brief-Title.md` or `ADR-XXX-Brief-Title.md`

### When to Create a New Folder
Create a new feature folder when:
1. Starting work on a distinct feature or system
2. Multiple documents will relate to the same area
3. The feature has its own PRD

### Core Folders

#### `platform-core/`
Contains foundational decisions that affect the entire platform:
- Overall architecture
- Core tech stack
- Development methodology
- Platform-wide strategies

#### Feature-Specific Folders
Each major feature gets its own folder containing:
- Feature PRD
- Related ADRs
- UX research or designs
- Technical specifications
- Performance considerations

## Document Relationships

### Cross-References
When documents reference each other across folders:
```markdown
**Related Documents:**
- [PRD-001](../platform-core/PRD-001-Platform-v1.md) - Platform overview
- [ADR-004](../experiment-creation/ADR-004-Creation-Flow.md) - Creation flow decision
```

### Document Metadata
Always include folder context in metadata:
```markdown
**Document ID:** PRD-002
**Feature Area:** Experiment Creation
**Location:** /03 Documentation/experiment-creation/
```

## Adding New Documentation

### Step 1: Determine Feature Area
- Is this about a new feature? → Create new folder
- Is this about an existing feature? → Add to existing folder
- Is this platform-wide? → Add to `platform-core/`

### Step 2: Create Folder (if needed)
```bash
mkdir "03 Documentation/feature-name"
```

### Step 3: Create Document
- Use next sequential number (check all folders)
- Follow naming convention
- Include proper metadata

### Step 4: Update Indexes
1. Update this CLAUDE.md if adding new folder
2. Update main `/CLAUDE.md` document index
3. Update feature folder's README if exists

## Current Feature Areas

| Folder | Description | Key Documents |
|--------|-------------|---------------|
| `platform-core/` | Foundational platform decisions | PRD-001, ADR-001, ADR-002, ADR-003 |
| `experiment-creation/` | 5-second creation flow | *Coming soon* |
| `activity-feed/` | Homepage activity pulse | *Coming soon* |
| `fork-system/` | Experiment forking and lineage | *Coming soon* |

## Best Practices

### Do's
- Keep related documents together in feature folders
- Update existing documents rather than creating new ones
- Use consistent naming within folders
- Link between related documents
- Consolidate similar documents immediately

### Don'ts
- Don't create multiple documents for the same topic
- Don't mix features in the same folder
- Don't skip sequential numbers
- Don't create deep subfolder hierarchies
- Don't duplicate information - reference instead
- Don't keep drafts once decisions are made

## Finding Documents

### By Feature
Look in the specific feature folder

### By ID
Use global search for document ID (e.g., "PRD-002")

### By Type
Search across folders for pattern (e.g., "ADR-*.md")

### By Status
Check document metadata for status field

## Maintenance

### Quarterly Review
- Archive deprecated feature folders to `/04 Archive/`
- Update this guide with new patterns
- Consolidate sparse folders

### When Features Merge
If features consolidate:
1. Create new combined folder
2. Move relevant documents
3. Update all references
4. Archive old folders

---

*Last Updated: 23 Aug 2024*
*This guide governs documentation organization for Nile Labs*