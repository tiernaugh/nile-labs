# Product Requirements Document (PRD)

## **Nile Labs Platform v1**

### **Document Metadata**
**Document ID:** PRD-001  
**Product Name:** Nile Labs Platform  
**Version:** 1.3  
**Date Created:** 22 Aug 2024  
**Last Updated:** 23 Aug 2024  
**Author:** Nile Labs Team  
**Status:** Approved  
**Related ADRs:** ADR-001, ADR-002  

---

### **1. Overview**

**Purpose:**  
Create a lightweight experiment gallery where Nile team members can share what they're building, discover others' work, and build on existing ideas. The platform makes innovation visible without adding workflow overhead.

**Success Criteria:**  
- 50% of team adds at least one experiment within first month
- 10+ experiments forked or collaborated on within 3 months
- Platform requires <5 mins/week of user maintenance time
- Activity feed checked daily by 30%+ of team

**Key Principle:**  
"The platform serves the experiments, not vice versa."

---

### **2. User Stories**

**As a Nile team member, I want to:**  
- Add an experiment in <5 seconds (title + description only)
- Browse what others are building through an activity feed
- Fork someone's experiment to build on their idea
- Add progress updates to show evolution of my work
- Upload a cover image to make my experiment visually engaging
- See experiments that graduated to production work

**As Nile leadership, I want to:**  
- See the pulse of innovation across the business
- Identify experiments that became client value
- Track momentum and participation without heavy reporting

---

### **3. Functional Requirements**

#### **3.1 Core Features**

**Authentication**  
- REQ-1: Google SSO via Clerk (Nile workspace only)
- REQ-2: Auto-create profile on first login via Clerk
- REQ-3: Domain restriction via Clerk's allowlist
- REQ-4: No complex permissions in v1

**Experiment Management**  
- REQ-4: Create experiment with only title + description required
- REQ-5: Optional fields: cover image, category, tags, links
- REQ-6: Status progression: `Idea` → `Active` → `Findings` or `In Production`
- REQ-6a: Soft delete capability for experiments
- REQ-7: Add/remove collaborators (existing users only, show message to invite non-users)
- REQ-8: Fork any experiment (maintains lineage)
- REQ-9: Progress updates via "+" button (creates timeline nodes)

**Discovery & Activity**  
- REQ-10: Activity feed on landing page showing real-time pulse
- REQ-11: Browse all experiments (newest first)
- REQ-12: Filter by status, owner, category
- REQ-13: Search by keyword across all fields
- REQ-14: View fork lineage/tree visualization

**Media & Visualization**  
- REQ-15: Cover image using block colours/placeholders (no upload in v1)
- REQ-16: Progress timeline visualization on cards (text only)
- REQ-17: Fork tree/galaxy view (v1.1 future enhancement - defer after CRUD + feed)

#### **3.2 Data Model**

**Experiment:**
```
- id (UUID, required)
- title (string, required, max 100 chars)
- description (text, required)
- status (enum: Idea|Active|Findings|In Production, required)
- category (enum: optional)
  - Client Experience
  - Service Design
  - Strategy & Innovation
  - Research & Insights
  - Process & Methods
  - AI & Automation
  - Internal Capability
  - Other
- cover_image_url (string, optional)
- owner_id (UUID, required)
- collaborator_ids (UUID[], optional)
- forked_from_id (UUID, optional)
- links (JSON, optional)
- tags (string[], optional, include in UI)
- created_at (timestamp)
- updated_at (timestamp)
```

**User:**
```
- id (UUID)
- email (string, from Google)
- name (string, from Google)
- avatar_url (string, from Google)
- created_at (timestamp)
```

**Progress Update:**
```
- id (UUID)
- experiment_id (UUID, required)
- content (text, required)
- created_by_id (UUID, required)
- created_at (timestamp)
```

---

### **4. Non-Functional Requirements**

**Performance**  
- Page load <2 seconds
- Experiment creation <5 seconds
- Support 100 concurrent users
- Activity feed updates within 10 seconds (polling, no real-time in v1)

**Usability**  
- Mobile responsive
- Zero onboarding required
- Works on Chrome, Safari, Firefox
- Experiment creation in 2 clicks

**Architecture**  
- API-ready structure for future integrations
- Data export capability from day one
- Extensible for Slack bots, CLI tools

**Security**  
- Nile Google workspace accounts only
- All data encrypted at rest
- No sensitive/client data in experiments

---

### **5. Explicitly Out of Scope for v1**

- Comments/discussions on experiments
- Automated notifications (email/Slack)
- Complex permissions or privacy controls
- Budget/resource tracking
- Time tracking
- Client visibility
- AI brief generator
- Real-time collaborative editing
- Automated status management

---

### **6. Success Metrics**

**Week 1:**  
- Platform deployed and accessible
- 10+ experiments created
- 5+ unique users
- Activity feed showing movement

**Month 1:**  
- 30+ experiments
- 50% team participation
- 5+ forks created
- 2+ "In Production" graduations

**Month 3:**  
- Active weekly users >30%
- 5+ experiments referenced in proposals
- Average 3+ progress updates per active experiment
- Decision on v2 based on usage patterns

---

### **7. Development Phases**

**Phase 1: Frontend Prototype (Week 1-2)**
- Build complete UI/UX without backend
- Mock data for all interactions
- Test information architecture
- Validate user flows
- Make product decisions based on prototype
- Get stakeholder buy-in on experience

**Phase 2: Backend Integration (Week 2-3)**
- Wire up Clerk authentication
- Connect to Vercel Postgres
- Implement Prisma models
- Build API routes
- Connect frontend to real data

**Phase 3: Polish & Pre-Launch (Week 3-4)**
- Add cover image uploads
- Implement activity feed
- Pre-populate with examples
- Testing and bug fixes

### **8. Launch Plan**

**Pre-Launch:**
- Leadership adds 5+ real experiments (including failures)
- Pre-populate with starter experiments:
  - Using ChatGPT to create interview discussion guides
  - Creating training conversational UI for consultant sales
  - Creating storyboards with Gemini

**Team Trip Workshop (September, 2.5 hours):**
- Live demos of platform
- Hands-on experiment creation
- Fork challenges
- First "Labs & Libations" ritual

**Post-Launch:**
- Weekly Labs & Libations (Fridays 4pm)
- Daily activity monitoring
- Month 1 retrospective

---

### **9. Future Considerations (v2)**

Based on v1 usage, consider:
- Slack integration for notifications
- API access for external tools
- AI provocations/brief generator
- Public showcase mode
- Advanced analytics dashboard
- Commenting/discussion threads

---

### **Change Log**

**v1.3 (23 Aug 2024):**
- Clarified categories for UK consultancy context  
- Specified polling for activity feed (no real-time)
- Deferred fork visualization to v1.1
- Added soft delete capability
- Clarified collaborators must be existing users
- Progress updates text-only for v1
- Cover images as colour blocks/placeholders
- Added example pre-population experiments
- Set September for team trip

**v1.2 (23 Aug 2024):**
- Added frontend-first prototyping phase
- Changed authentication to Clerk from NextAuth
- Added explicit development phases

**v1.1 (23 Aug 2024):**
- Replaced "Archived" with "Findings" status
- Added "In Production" status for graduated experiments
- Added cover images and progress timeline requirements
- Simplified to 5-second creation (title + description only)
- Added activity feed as core feature
- Specified API-ready architecture requirement
- Added explicit data export capability
- Removed hypothesis field for simplicity

**v1.0 (22 Aug 2024):**
- Initial PRD created