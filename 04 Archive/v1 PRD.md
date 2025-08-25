Product Requirements Document (PRD)

## **Nile Labs Platform v1**

### **1. Overview**

**Product Name:** Nile Labs Platform  
	**Version:** 1.0  
**Date:** 22 Aug 2025
**Author:** Nile Labs Team  
**Status:** Draft  
**Purpose:**  
Create a lightweight experiment gallery where Nile team members can share what they're building, discover others' work, and build on existing ideas. The platform makes innovation visible without adding workflow overhead.  
**Success Criteria:**  

- 50% of team adds at least one experiment within first month
- 10+ experiments forked or collaborated on within 3 months
- Platform requires <5 mins/week of user maintenance time

---

### **2. User Stories**

**As a Nile team member, I want to:**  

- Quickly log an experiment idea so others know what I'm working on
- Browse what others are building so I can learn and get inspired
- Fork someone's experiment so I can build on their idea
- Find experiments looking for collaborators so I can contribute
- Turn my vague idea into an actionable brief so I can get started

**As Nile leadership, I want to:**  

- See what innovation is happening across the business
- Identify promising experiments for client offerings
- Track momentum and participation in Labs

---

### **3. Functional Requirements**

**3.1 Core Features**  
**Authentication**  

- REQ-1: Google SSO (Nile workspace only)
- REQ-2: No user registration required - auto-create profile on first login

**Experiment Management**  

- REQ-3: Create experiment with minimal fields (title, description, status)
- REQ-4: Edit own experiments
- REQ-5: Change experiment status (Idea → Active → Complete → Archived)
- REQ-6: Add/remove collaborators (simple list, no permissions)
- REQ-7: Add links to external resources (GitHub, Slack, prototypes)
- REQ-8: Fork any experiment (creates copy with relationship)

**Discovery**  

- REQ-9: Browse all experiments (newest first)
- REQ-10: Filter by status, owner, category
- REQ-11: Search by keyword across all text fields
- REQ-12: View experiment lineage (forks)

**AI Brief Generator**  

- REQ-13: Input freeform idea description
- REQ-14: Generate structured brief with hypothesis, success criteria, next steps
- REQ-15: One-click convert brief to experiment

**3.2 Data Model**  
**Experiment:**  

- id (UUID)  
- title (required, string)  
- description (required, text)  
- brief (optional, generated text)  
- status (required, enum: Idea|Active|Complete|Archived)  
- category (optional, enum)  
- tags (optional, array)  
- owner_id (required, user reference)  
- collaborator_ids (optional, array)  
- forked_from (optional, experiment reference)  
- links (optional, JSON array)  
- created_at (timestamp)  
- updated_at (timestamp)

  
  
**User:**  

- id (UUID)  
- email (from Google)  
- name (from Google)  
- avatar_url (from Google)  
- created_at (timestamp)

  
  

---

### **4. Non-Functional Requirements**

**Performance**  

- Page load <2 seconds
- Brief generation <5 seconds
- Support 100 concurrent users

**Usability**  

- Mobile responsive
- Works on Chrome, Safari, Firefox
- Zero onboarding required
- Create experiment in <30 seconds

**Security**  

- Nile Google accounts only
- All data encrypted at rest
- No sensitive/client data in experiments

---

### **5. Out of Scope for v1**

- Comments/discussions
- Notifications (email or Slack)
- Automated status management
- Complex permissions
- Analytics dashboard
- API access
- Budgets/resources tracking
- Client visibility

---

### **6. Success Metrics**

**Week 1:**  

- Platform deployed and accessible
- 10+ experiments created
- 5+ unique users

**Month 1:**  

- 30+ experiments
- 50% team participation
- 3+ forks created

**Month 3:**  

- Active weekly users >30%
- 2+ experiments referenced in proposals
- Decision on v2 based on usage

---

# **Architecture Decision Record (ADR)**

## **ADR-001: Nile Labs Platform Technical Architecture**

### **Status**

Proposed  

### **Context**

We need to build a lightweight experiment tracking platform that prioritises speed of delivery and ease of maintenance. The platform itself is an experiment that may be deprecated if it doesn't provide value.  

### **Decision**

**Tech Stack**  
**Frontend:**  

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for rapid styling
- **Shadcn/ui** for consistent components

**Backend:**  

- **Next.js API Routes** (no separate backend)
- **Prisma** as ORM
- **PostgreSQL** for data persistence

**AI Integration:**  

- **OpenAI API** for brief generation
- **Streaming responses** for better UX

**Authentication:**  

- **NextAuth.js** with Google provider
- **JWT sessions** (no database sessions)

**Hosting:**  

- **Vercel** for application
- **Supabase** or **Neon** for PostgreSQL
- **Uploadthing** or **S3** for future file uploads

**Architecture Patterns**  
**Monolithic Next.js Application**  

- Single deployable unit
- Shared codebase for frontend/backend
- Server-side rendering for SEO and performance

**Database Design**  

-- Core tables only  
experiments  
users  
experiment_collaborators (junction table)  
  
-- Forking is just a foreign key  
experiments.forked_from_id -> experiments.id

  
  
**API Design**  

- RESTful routes via Next.js API
- No GraphQL (unnecessary complexity)
- Simple JSON responses

**Key Technical Decisions**  
**1. No Microservices**  

- Rationale: Overhead not justified for MVP
- Trade-off: Less scalable but much faster to build

**2. PostgreSQL over NoSQL**  

- Rationale: Relational data (forks, collaborators)
- Trade-off: Slightly more setup but better for relationships

**3. Vercel over Self-Hosted**  

- Rationale: Zero DevOps overhead
- Trade-off: Vendor lock-in but massive time savings

**4. No Real-time Features**  

- Rationale: Not core to MVP value
- Trade-off: Less dynamic but simpler architecture

**5. Client-Side Search/Filter**  

- Rationale: <1000 experiments expected
- Trade-off: Less scalable but no search infrastructure needed

### **Consequences**

**Positive:**  

- Can build entire platform in 2-3 weeks
- Single developer can maintain
- Low operational overhead
- Easy to deprecate if experiment fails

**Negative:**  

- Will need refactoring if scales beyond 1000 experiments
- No real-time collaboration features
- Limited to Vercel's constraints

### **Alternatives Considered**

**Alternative 1: No-Code Platform (Notion, Airtable)**  

- Rejected: Too limiting for custom features like AI brief generator

**Alternative 2: Full Microservices Architecture**  

- Rejected: Massive overkill for experiment

**Alternative 3: Static Site with GitHub Backend**  

- Rejected: Too technical for non-developer users

### **Implementation Notes**

**Phase 1 (Week 1):**  

- Basic CRUD for experiments
- Google auth
- Simple UI

**Phase 2 (Week 2):**  

- AI brief generator
- Fork functionality
- Search/filter

**Phase 3 (Week 3):**  

- Polish and testing
- Pre-populate content
- Deploy to production

### **Monitoring**

Track via Vercel Analytics:  

- Daily active users
- API response times
- AI generation success rate
- Error rates