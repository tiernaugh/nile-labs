# Frontend Prototype Implementation Plan

**Last Updated:** 2025-08-25  
**Status:** Phase 4 Key Flows In Progress (Session 004)

## Current Progress
- ✅ **Phase 1:** Setup & Data Architecture (COMPLETE)
- ✅ **Phase 2:** Mock Data & Types (COMPLETE)
- ✅ **Phase 3:** Core Components (COMPLETE)
- 🚧 **Phase 4:** Key Flows (IN PROGRESS)
- ⏳ **Phase 5:** Polish & Interactions (PENDING)

## Overview
This document outlines the implementation plan for the Nile Labs frontend prototype (Phase 1), following ADR-003's frontend-first approach. We'll build a complete UI with mock data before any backend integration.

## Goals
- Validate UX/UI decisions with stakeholders
- Test the 5-second experiment creation flow
- Ensure activity feed creates the right energy
- Get team buy-in before backend work

## Technical Approach

### Current State (UPDATED)
- T3 app scaffolded with tRPC, Prisma, Tailwind, Biome
- **Decision:** Keep tRPC/React Query infrastructure for mock data
- Data abstraction layer complete in `/lib/data/`
- Custom hooks ready with proper polling behavior

### Tech Stack for Prototype (UPDATED)
- **Next.js 15** - App Router for pages
- **TypeScript** - Type safety for mock data
- **Tailwind CSS** - Rapid styling
- **tRPC + React Query** - Data fetching with polling
- **Lucide React** - Icons
- **CVA** - Component variants
- **Mock Data Layer** - Abstraction for easy Phase 2 swap

## Implementation Phases

### Phase 1: Setup & Cleanup (Day 1) ✅ COMPLETE
1. **Keep tRPC Infrastructure** 
   - ✅ Repurposed tRPC routers for mock data
   - ✅ React Query provides polling behavior
   - ✅ Kept Prisma schema as reference
   - Clean up default pages (pending)

2. **Install UI Dependencies** (pending)
   ```bash
   pnpm add lucide-react clsx tailwind-merge class-variance-authority
   ```

3. **Project Structure** (data layer complete, UI pending)
   ```
   src/
   ├── app/                          # Pages (pending)
   │   ├── layout.tsx 
   │   ├── page.tsx 
   │   ├── experiments/
   │   │   ├── page.tsx 
   │   │   └── [id]/page.tsx 
   │   └── create/page.tsx 
   ├── components/                   # UI Components (pending)
   │   ├── experiments/
   │   │   ├── ExperimentCard.tsx
   │   │   ├── ExperimentForm.tsx
   │   │   └── ProgressTimeline.tsx
   │   ├── activity/
   │   │   ├── ActivityFeed.tsx
   │   │   └── ActivityItem.tsx
   │   └── ui/
   │       ├── Button.tsx
   │       ├── Card.tsx
   │       └── Badge.tsx
   ├── lib/                          # ✅ COMPLETE
   │   ├── types.ts                  # ✅ Full type definitions
   │   ├── data/                     # ✅ Data abstraction layer
   │   │   ├── mock-data.ts          # ✅ Mock data with 8 experiments
   │   │   ├── experiments.ts        # ✅ All CRUD operations
   │   │   └── activities.ts         # ✅ Activity feed operations
   │   └── hooks/                    # ✅ Custom React hooks
   │       ├── useActivityFeed.ts    # ✅ Polling behavior
   │       └── useExperiments.ts     # ✅ Experiment operations
   ├── server/                       # ✅ COMPLETE
   │   └── api/
   │       └── routers/
   │           └── experiments.ts    # ✅ tRPC mock resolvers
   └── contexts/
       └── MockAuthContext.tsx       # (pending)
   ```

### Phase 2: Mock Data & Types (Day 1-2) ✅ COMPLETE

1. **Define TypeScript Types** ✅
   - Complete type definitions in `/lib/types.ts`
   - All PRD-001 data models implemented
   - Added ActivityEvent types (5 types)
   - Included soft delete capability (`deletedAt`)
   - Filter and sort types defined

2. **Create Mock Data** ✅
   - 30 realistic experiments with varied statuses (expanded in Session 003)
   - All categories from PRD-001 v1.3
   - Progress updates with timelines
   - Fork relationships established
   - Activity events for last 24 hours
   - Deterministic color generation helper

3. **Mock Authentication Context**
   - Simple user object
   - No actual auth logic
   - Switch between users for testing

### Phase 3: Core Components (Day 2-3) ✅ COMPLETE

1. **Layout & Navigation** ✅
   - Top nav with logo and user menu
   - Responsive layout
   - Navigation links

2. **Experiment Card** ✅
   - Visual states for all statuses
   - Color block cover images with initials
   - Owner info with time ago
   - Fork/collaborator/progress counts
   - Hover interactions
   - Status badges with semantic colors

3. **Activity Feed** ✅
   - Real-time feel (8-second polling)
   - All 5 activity types implemented:
     - New experiments
     - Status changes
     - Progress updates
     - New collaborators
     - Forks created
   - Time ago formatting
   - Pulse indicator (24h activity count)
   - Grouped by time period
   - Load more functionality

### Phase 4: Key Flows (Day 3-4) 🚧 IN PROGRESS (Session 004)

1. **5-Second Creation** ✅ (Session 003)
   - Title + description only form
   - Keyboard-first flow (Enter key navigation)
   - Auto-focus management
   - Deterministic cover color from title
   - Success animation
   - Redirect to experiment page

2. **Browse & Filter** 🚧 (Session 004 - In Progress)
   - Grid view of all experiments
   - Filter by status, category, owner
   - Search by keyword (with tag normalization)
   - Sort options (newest, most forked, recently updated)
   - 200ms debounce on search

3. **Single Experiment View**
   - Full details display
   - Progress timeline with "+" button
   - Fork button
   - Edit button (for owner)
   - Collaborator list

4. **Fork Flow**
   - One-click fork
   - Pre-fill with parent data
   - Show lineage connection
   - Optional: modify before saving

### Phase 5: Polish & Interactions (Day 4-5)

1. **Loading States**
   - Skeleton screens
   - Smooth transitions
   - Optimistic updates

2. **Empty States**
   - No experiments yet
   - No search results
   - No activity

3. **Error States**
   - Form validation
   - Network errors (simulated)
   - Not found pages

4. **Mobile Responsive**
   - Test all breakpoints
   - Touch-friendly interactions
   - Appropriate information density

## Mock Data Strategy

### Simulated Backend Behavior
```typescript
// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAPI = {
  async getExperiments() {
    await delay(300);
    return mockExperiments;
  },
  
  async createExperiment(data: CreateExperimentInput) {
    await delay(500);
    const newExperiment = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockExperiments.push(newExperiment);
    return newExperiment;
  },
  
  // Activity feed with polling simulation
  async getActivity(since?: Date) {
    await delay(200);
    return mockActivity.filter(a => !since || a.createdAt > since);
  }
};
```

### Activity Feed Polling
```typescript
// Simulate 8-second polling per ADR-004
useEffect(() => {
  const interval = setInterval(async () => {
    const newActivity = await mockAPI.getActivity(lastCheck);
    if (newActivity.length > 0) {
      setActivity(prev => [...newActivity, ...prev]);
      setLastCheck(new Date());
    }
  }, 8000);
  
  return () => clearInterval(interval);
}, [lastCheck]);
```

## Component Examples

### Experiment Card Design
```
┌─────────────────────────┐
│ [Color Block Cover]     │
│                         │
├─────────────────────────┤
│ Title                   │
│ by Owner • 2 days ago   │
│                         │
│ Description text here   │
│ showing first few lines │
│                         │
│ [Active] #tag1 #tag2    │
│                         │
│ 👥 3  🔀 2  📈 5 updates│
└─────────────────────────┘
```

### Activity Feed Item
```
┌─────────────────────────────┐
│ 🆕 New experiment           │
│ "AI Brief Generator"        │
│ by Sarah • just now         │
├─────────────────────────────┤
│ 📈 Progress update          │
│ "Completed user interviews" │
│ on "Customer Portal v2"     │
│ by Tom • 5 minutes ago      │
├─────────────────────────────┤
│ 🔀 Experiment forked        │
│ "Design System 2.0"         │
│ forked by Alex              │
│ from Emma's experiment      │
│ 12 minutes ago              │
└─────────────────────────────┘
```

## Testing Checklist

### User Flows to Validate
- [x] Can create experiment in <5 seconds ✅
- [x] Activity feed feels alive and engaging ✅
- [ ] Browse/filter is intuitive
- [ ] Fork relationship is clear
- [ ] Progress timeline makes sense
- [x] Mobile experience is smooth ✅

### Stakeholder Questions
- [ ] Does this capture the experimental spirit?
- [ ] Will the team actually use this?
- [ ] What's missing from the experience?
- [ ] Is the information architecture right?
- [ ] Should we adjust any interactions?

## Success Criteria

### Prototype Complete When
1. All core flows implemented
2. Mock data feels realistic
3. Interactions are smooth
4. Mobile responsive
5. Ready for stakeholder demo

### Decision Points After Demo
- Confirm 5-second creation is achievable
- Validate activity feed approach
- Finalize visual design direction
- Lock feature set for Phase 2
- Get go-ahead for backend work

## Next Steps After Prototype

### Phase 2: Backend Integration
1. Wire up Clerk authentication
2. Set up Prisma with Vercel Postgres
3. Build API routes
4. Replace mock data with real API calls
5. Add image upload functionality

### Handoff Checklist
- [ ] Document all component props
- [ ] List all mock data structures
- [ ] Note any UX decisions made
- [ ] Capture feedback from demos
- [ ] Update PRDs/ADRs as needed

## Timeline

### Week 1
- **Monday-Tuesday**: Setup, cleanup, mock data
- **Wednesday-Thursday**: Core components, activity feed
- **Friday**: Key flows, creation process

### Week 2
- **Monday-Tuesday**: Polish, interactions, mobile
- **Wednesday**: Internal testing, fixes
- **Thursday**: Stakeholder demos
- **Friday**: Feedback incorporation, decisions

## Resources

### Documentation
- [PRD-001: Platform Requirements](../../03%20Documentation/platform-core/PRD-001-Platform-v1.md)
- [ADR-003: Frontend-First Prototyping](../../03%20Documentation/platform-core/ADR-003-Frontend-First-Prototyping.md)
- [ADR-004: Polling Strategy](../../03%20Documentation/platform-core/ADR-004-State-Management-Polling.md)

### Design Inspiration
- Linear (activity feed)
- GitHub (experiment cards)
- Vercel (clean aesthetics)
- Notion (quick creation)

---

*Last Updated: 2025-08-25*
*Phase: Frontend Prototype*
*Status: Ready to Begin Implementation*