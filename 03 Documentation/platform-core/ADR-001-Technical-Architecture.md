# Architecture Decision Record (ADR)

## **ADR-001: Nile Labs Platform Technical Architecture**

### **Document Metadata**
**ADR ID:** ADR-001  
**Title:** Core Technical Architecture  
**Date:** 22 Aug 2024  
**Last Updated:** 23 Aug 2024  
**Status:** Approved  
**Authors:** Nile Labs Team  
**Related PRDs:** PRD-001  
**Supersedes:** None  
**Superseded By:** None  

---

### **Status**
Approved ✅

### **Context**
We need to build a lightweight experiment tracking platform that prioritizes speed of delivery and ease of maintenance. The platform itself is an experiment that may be deprecated if it doesn't provide value. We need to balance building quickly with building extensibly.

### **Decision**

#### **Core Tech Stack**

**Frontend:**  
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for rapid styling
- **Shadcn/ui** for consistent components
- **React Query (TanStack Query)** for data fetching
- **Biome** for linting and formatting (not ESLint/Prettier)

**Backend:**  
- **Next.js API Routes** (no separate backend)
- **Prisma** as ORM (chosen over Drizzle for maturity)
- **PostgreSQL** via Vercel Postgres (serverless)

**Authentication:**  
- **Clerk** for complete auth solution
- **Google SSO** via Clerk's OAuth providers
- **Nile workspace restriction** via Clerk's domain allowlist
- **User management** handled entirely by Clerk

**Hosting & Infrastructure:**  
- **Vercel** for application hosting
- **Vercel Postgres** for database (managed PostgreSQL)
- **Vercel Blob** for image storage
- **Vercel Analytics** for monitoring

#### **Architecture Patterns**

**Application Architecture:**
```
├── Monolithic Next.js application
├── Server-side rendering for performance
├── API routes colocated with frontend
└── Single deployable unit
```

**Database Design:**
```sql
-- Core tables
experiments
users  
experiment_collaborators (junction)
progress_updates

-- Relationships
experiments.forked_from_id -> experiments.id
experiments.owner_id -> users.id
progress_updates.experiment_id -> experiments.id
```

**API Design Principles:**
- RESTful routes via Next.js API
- API-ready structure (even if not exposed)
- Simple JSON responses
- Consistent error handling
- Rate limiting ready

#### **Key Technical Decisions**

**1. Vercel Postgres over Self-Hosted**
- **Rationale:** Zero DevOps overhead, automatic scaling, integrated with Vercel
- **Trade-off:** Vendor lock-in accepted for speed and simplicity

**2. Prisma over Drizzle**
- **Rationale:** More mature, better documentation, proven in production
- **Trade-off:** Slightly larger bundle size accepted for stability

**3. Monolithic over Microservices**
- **Rationale:** Faster to build, single developer can maintain
- **Trade-off:** Less scalable but appropriate for <1000 experiments

**4. API-Ready Architecture**
- **Rationale:** Future integrations (Slack, CLI) will need API access
- **Trade-off:** Slight additional complexity for future-proofing

**5. Server-Side Rendering**
- **Rationale:** Better performance, SEO, and initial load
- **Trade-off:** More complex than pure SPA

### **Implementation Details**

**Folder Structure:**
```
/app
  /(auth)
    /login
  /(app)
    /experiments
    /profile
  /api
    /experiments
    /auth
    /export
/components
  /ui (shadcn)
  /experiments
  /layout
/lib
  /prisma
  /auth
  /utils
/prisma
  schema.prisma
  migrations/
/public
  /images
```

**Environment Variables:**
```
DATABASE_URL (Vercel Postgres)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
BLOB_STORAGE_URL
```

**Security Considerations:**
- Input validation on all API routes
- SQL injection prevention via Prisma
- XSS prevention via React
- Authentication & session management via Clerk
- Rate limiting via Vercel Edge
- Domain restriction via Clerk allowlist

### **Consequences**

**Positive:**
- Can build entire platform in 2-3 weeks
- Single developer can maintain
- Low operational overhead
- Easy to add features incrementally
- Built-in scaling via Vercel
- Data export capability from day one

**Negative:**
- Vendor lock-in to Vercel ecosystem
- Will need refactoring if scales beyond 10,000 experiments
- Limited to Vercel's constraints
- Costs scale with usage (serverless model)

### **Alternatives Considered**

**Alternative 1: T3 Stack with tRPC**
- **Rejected:** Additional complexity not needed for MVP
- **Revisit if:** API becomes complex with many endpoints

**Alternative 2: Separate Backend (NestJS/FastAPI)**
- **Rejected:** Unnecessary complexity for MVP
- **Revisit if:** Need complex background jobs or ML processing

**Alternative 3: Supabase (Full BaaS)**
- **Rejected:** Wanted more control over data model
- **Revisit if:** Need real-time features

**Alternative 4: Static Site with GitHub Backend**
- **Rejected:** Too technical for non-developer users
- **Not applicable** for this use case

### **Migration Strategy**

If platform succeeds and needs scaling:

1. **Phase 1:** Extract API to separate service
2. **Phase 2:** Move to dedicated PostgreSQL instance
3. **Phase 3:** Add caching layer (Redis)
4. **Phase 4:** Consider event-driven architecture

### **Monitoring & Observability**

Track via Vercel Analytics:
- Page load times
- API response times
- Error rates
- User sessions
- Database query performance

### **References**
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)

---

### **Change Log**

**v1.3 (23 Aug 2024):**
- Added Biome for linting/formatting instead of ESLint/Prettier
- Clarified React Query as TanStack Query

**v1.2 (23 Aug 2024):**
- Changed authentication from NextAuth to Clerk
- Added frontend-first prototyping phase

**v1.1 (23 Aug 2024):**
- Changed from Drizzle to Prisma for ORM
- Selected Vercel Postgres over Supabase/Neon
- Added API-ready architecture requirement
- Specified Next.js 15 over Next.js 14
- Added data export consideration
- Clarified monolithic architecture decision

**v1.0 (22 Aug 2024):**
- Initial ADR created