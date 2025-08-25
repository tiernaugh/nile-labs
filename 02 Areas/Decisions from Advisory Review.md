# Decisions from Advisory Review

## Technical Stack ✅

### Database
- **Decision:** PostgreSQL via Vercel Postgres (serverless, managed)
- **Rationale:** Already integrated with Vercel, no separate Neon account needed, scales automatically
- **Model:** Keep current schema - avoid unnecessary migrations, we can move fast with AI tools

### ORM
- **Decision:** Prisma over Drizzle
- **Rationale:** More mature, better documented, free and open source
- **Note:** Yes, Prisma is completely free!

### API Strategy
- **Decision:** Design for API extensibility from day one
- **Implementation:** Structure routes and data models to be API-ready, even if not exposed initially
- **Future:** Slack bots, CLI tools, browser extensions can be added

### Export Strategy
- **Decision:** Manual database export initially
- **Implementation:** Admin can export from Vercel Postgres dashboard
- **Future:** Build automated export feature if needed

## Feature Decisions ✅

### Status Options
- **OUT:** "Archived" 
- **IN:** "Findings" (for completed experiments with learnings)
- **NEW:** "In Production" (for experiments that graduated to real projects)
- **Keep:** "Idea" → "Active" → "Findings" or "In Production"

### Experiment Fields
- **Question:** "So What?" vs "Hypothesis"
- **Consideration:** "So What?" might be better for findings/retrospective. Maybe "Why This Matters?" or "Potential Impact?" for creation?
- **Alternative:** Keep it simple with "Description" and let people structure it themselves

### Media & Visualization
- **Cover Images:** Yes! With nice defaults
- **Progress Timeline:** Add a "+" button on experiment cards for updates
  - Creates nodes on a timeline
  - Teams can use as changelog, diary, or progress tracker
  - Visual progress without prescribing format

### Categories
- **Decision:** Keep consultant-friendly categories
- **List:** Can evolve over time based on usage
- **Philosophy:** Categories should speak to client value, not just internal organization

## Cultural Decisions ✅

### Pre-population
- **Tiernan's experiments:** Add real ones, including half-baked/failed ones
- **Team starters:** Create experiments people can fork immediately
- **No anonymous mode:** Full transparency from start
- **No grace period:** Trust the team

### Magical Moments
**Two core experiences to optimize:**
1. **Creating first experiment** - Make this feel amazing
2. **Landing page activity feed** - Show real movement, what's happening, who's building
   - Recent updates
   - New experiments
   - Forks created
   - Status changes
   - "Pulse" of innovation

### Rituals & Culture
- **Create folder:** `/02 Areas/Culture & Rituals/`
- **Track:** Weekly rituals, recognition systems, celebration moments
- **Start manual:** Slack integration can come later

### AI Strategy
- **Decision:** No AI features in MVP
- **Rationale:** Blank canvas problem doesn't need platform solution
- **Alternative:** People can use ChatGPT in another window
- **Future:** Track AI feature ideas for v2

## What We're NOT Doing ❌

- Complex permissions
- Anonymous mode  
- Grace periods
- AI brief generator
- Automated Slack (yet)
- Hypothesis field (keeping it simple)
- Real-time features
- Comments/discussions

## Next Priority Order

1. **Core CRUD** with the refined status model
2. **Cover images** with beautiful defaults
3. **Activity feed** on landing page (the pulse)
4. **Progress timeline** with + button
5. **Fork visualization** (the tree/galaxy view)
6. **API structure** (even if not exposed)

## Key Insight Adopted from Each Advisor

- **Karri:** Keep it to 5 seconds to add (title + description only required)
- **Linus:** "Findings" not "Archived" + beautiful fork lineage
- **Julie:** Recognition will come through activity feed visibility
- **Des:** "In Production" status to show graduated experiments
- **Amelia:** Cover images + progress visualization
- **Tom:** API-ready architecture from day one
- **Chesky:** Two magical moments: creation + activity pulse
- **Caitlin:** AI can wait, focus on core behavior first

## Success Metrics Refined

**Week 1:**
- 10+ experiments created
- Activity visible on landing page
- At least 1 fork

**Month 1:**
- 30+ experiments
- 5+ "In Production" graduations
- Activity feed checked daily

**Month 3:**
- Decide on v2 based on usage patterns
- API needs assessment
- Culture assessment (is it sticky?)