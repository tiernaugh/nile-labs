# CLAUDE.md - Nile Labs Project Guide

## Project Overview
Nile Labs is an internal innovation platform for Nile, a design consultancy in Edinburgh. It's designed to make experimentation visible and collaborative across the team, without adding workflow overhead.

**Core Philosophy:** "The platform serves the experiments, not vice versa."

## Current Project Status
- **Phase:** Frontend Prototyping
- **Approach:** Frontend-first development - build complete UI prototype before backend
- **Next Milestone:** Team Trip Workshop (TBD)
- **Tech Stack:** Next.js 15, Prisma, Vercel Postgres, Clerk Auth

## Session Context
**When starting a new chat session**, load the latest session context:
```
Load @'02 Areas/Session Context/Session-003.md'
```

See [Session Context Guide](./02%20Areas/Session%20Context/CLAUDE.md) for details on maintaining continuity between chat sessions.

## Document Index

### 📋 Formal Documentation (`/03 Documentation/`)

**Organization:** Documentation is organized by feature area. See [Documentation Guide](./03%20Documentation/CLAUDE.md) for structure.

**⚠️ CANONICAL DOCUMENTS ONLY:** Each topic has ONE source of truth. Always update existing documents rather than creating new ones.

#### Platform Core (`/platform-core/`)
| Document | Status | Description | Last Updated |
|----------|--------|-------------|--------------|
| [PRD-001-Platform-v1.md](./03%20Documentation/platform-core/PRD-001-Platform-v1.md) | Approved | Core platform requirements | 23 Aug 2024 |
| [ADR-001-Technical-Architecture.md](./03%20Documentation/platform-core/ADR-001-Technical-Architecture.md) | Approved | Technical stack decisions | 23 Aug 2024 |
| [ADR-002-Data-Export-Strategy.md](./03%20Documentation/platform-core/ADR-002-Data-Export-Strategy.md) | Proposed | Export and portability approach | 23 Aug 2024 |
| [ADR-003-Frontend-First-Prototyping.md](./03%20Documentation/platform-core/ADR-003-Frontend-First-Prototyping.md) | Approved | Frontend prototype before backend | 23 Aug 2024 |

#### Global Documentation
| Document | Status | Description | Last Updated |
|----------|--------|-------------|--------------|
| [Documentation-Standards.md](./03%20Documentation/Documentation-Standards.md) | Active | How we document | 23 Aug 2024 |
| [Documentation CLAUDE.md](./03%20Documentation/CLAUDE.md) | Active | Documentation organization guide | 23 Aug 2024 |

### 🎯 Strategic Context (`/02 Areas/`)
| Document | Purpose | Key Insights |
|----------|---------|--------------|
| [Context Brief.md](./02%20Areas/Early%20project%20shape/Context%20Brief.md) | Project philosophy and stakeholder context | Lloyd wants client value, not internal tools |
| [Decisions from Advisory Review.md](./02%20Areas/Decisions%20from%20Advisory%20Review.md) | Consolidated decisions after advisory panel | 5-second creation, activity feed, no AI in MVP |
| [Advisory Panel.md](./02%20Areas/Advisory%20Panel.md) | Dream team of advisors for perspective | 8 industry leaders to channel |
| [Building Labs Culture.md](./02%20Areas/Culture%20&%20Rituals/Building%20Labs%20Culture.md) | Rituals and culture building | Labs & Libations, launch plan |
| [Session Context/](./02%20Areas/Session%20Context/) | Continuity between chat sessions | Load latest context when starting new chat |

### 🚧 Active Development (`/01 Active Development/`)
*Currently empty - will contain active sprint work*

### 🗄️ Archive (`/04 Archive/`)
| Document | Reason for Archive |
|----------|-------------------|
| [v1 PRD.md](./02%20Areas/Early%20project%20shape/v1%20PRD.md) | Superseded by PRD-001 |

## Key Decisions to Date

### Technical
- ✅ Next.js 15 with App Router
- ✅ Prisma over Drizzle (maturity)
- ✅ Vercel Postgres (serverless)
- ✅ Clerk for authentication (not NextAuth)
- ✅ Frontend-first prototyping approach
- ✅ API-ready architecture
- ❌ No AI features in MVP

### Product
- ✅ "Findings" not "Archived"
- ✅ "In Production" status for graduated experiments
- ✅ 5-second creation (title + description only)
- ✅ Activity feed as core feature
- ✅ Cover images with defaults
- ✅ Progress timeline with "+" button
- ❌ No comments/discussions
- ❌ No automated Slack (yet)

### Cultural
- ✅ Leadership goes first
- ✅ Labs & Libations ritual (Fridays)
- ✅ Celebrate findings equally with successes
- ✅ Fork liberally philosophy

## Development Commands

### Phase 1: Frontend Prototype
```bash
# Create Next.js app
pnpm create next-app@latest nile-labs --typescript --tailwind --app

# Install UI dependencies
pnpm add @radix-ui/react-* # as needed
pnpm add class-variance-authority clsx tailwind-merge
pnpm add lucide-react

# Run prototype with mock data
pnpm dev
```

### Phase 2: Backend Integration
```bash
# Install Clerk
pnpm add @clerk/nextjs

# Install database dependencies
pnpm add @prisma/client prisma
pnpm add @vercel/postgres

# Setup Prisma
pnpm prisma init
pnpm prisma migrate dev
pnpm prisma generate
```

### Development
```bash
# Run development server
pnpm dev

# Run Prisma Studio
pnpm prisma studio

# Create migration
pnpm prisma migrate dev --name [migration-name]

# Lint and typecheck
pnpm lint
pnpm typecheck
```

### Deployment
```bash
# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

## Environment Variables Required
```env
# Database (Phase 2)
DATABASE_URL="[Vercel Postgres URL]"

# Clerk Auth (Phase 2)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="[from Clerk Dashboard]"
CLERK_SECRET_KEY="[from Clerk Dashboard]"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Vercel Blob (for images)
BLOB_READ_WRITE_TOKEN="[from Vercel]"
```

## AI Assistant Instructions

When working on Nile Labs:

1. **Maintain the experimental spirit** - This platform is itself an experiment. Keep it lightweight and fun.

2. **Follow the 5-second rule** - Any feature that slows down experiment creation should be questioned.

3. **Prevent document sprawl** - ALWAYS update existing documents rather than creating new ones:
   - Check if topic exists in current docs
   - Update the canonical document
   - Never duplicate information
   - Consolidate related content

4. **Reference documents properly** - Use document IDs (PRD-001, ADR-001) when referencing decisions.

5. **Update documentation** - When making changes:
   - Update relevant PRDs/ADRs (don't create new ones)
   - Add to Change Log
   - Update this CLAUDE.md index
   - Delete any temporary drafts

6. **Consider the advisors** - Channel the advisory panel perspectives when making decisions.

7. **Remember the context** - Lloyd wants client value, team wants to experiment, platform should enable both.

8. **Keep it simple** - Resist over-engineering. We can always add complexity later.

## Common Tasks

### Adding a new PRD
1. Determine feature area (or create new folder)
2. Create file: `/03 Documentation/[feature-area]/PRD-XXX-Title.md`
3. Use template from Documentation-Standards.md
4. Update this index and feature area listing
5. Link related ADRs

### Adding a new ADR
1. Determine feature area (or use platform-core)
2. Create file: `/03 Documentation/[feature-area]/ADR-XXX-Title.md`
3. Use template from Documentation-Standards.md
4. Update this index and feature area listing
5. Link related PRDs

### Updating after advisory review
1. Read advisory feedback
2. Update Decisions document
3. Revise relevant PRDs/ADRs
4. Update Change Logs

## Questions for Clarification

Before starting development, confirm:
- [ ] Team trip date for launch?
- [ ] Clerk account created with Google OAuth configured?
- [ ] Vercel project created?
- [ ] Initial experiment examples prepared?
- [ ] Leadership buy-in on going first?
- [ ] Stakeholders available for prototype review?

## Next Steps

### Phase 1: Frontend Prototype (Current)
1. Set up Next.js with TypeScript
2. Create all UI components with mock data
3. Build complete user flows
4. Test with stakeholders
5. Iterate based on feedback

### Phase 2: Backend Integration
1. Set up Clerk authentication
2. Create Prisma schema
3. Build API routes
4. Replace mock data with real API calls
5. Add image uploads

### Phase 3: Pre-Launch
1. Pre-populate with examples
2. Test with core team
3. Polish and bug fixes
4. Launch at team trip

---

*Last updated: 23 Aug 2024*
*Maintained by: Nile Labs Team*