# Architecture Decision Record (ADR)

## **ADR-003: Frontend-First Prototyping Strategy**

### **Document Metadata**
**ADR ID:** ADR-003  
**Title:** Frontend-First Prototyping Strategy  
**Date:** 23 Aug 2024  
**Status:** Approved  
**Authors:** Nile Labs Team  
**Related PRDs:** PRD-001  
**Related ADRs:** ADR-001  
**Supersedes:** None  
**Superseded By:** None  

---

### **Status**
Approved ✅

### **Context**
Building software without validating the user experience often leads to rework. For Nile Labs, where the goal is to make experimentation frictionless and engaging, the UI/UX is critical to adoption. We need to test flows, validate assumptions, and get stakeholder buy-in before committing to backend implementation.

### **Decision**

#### **Development Approach**

**Phase 1: Pure Frontend Prototype**
- Build complete UI with Next.js 15
- Use mock data and local state
- No backend, no database, no auth
- Focus entirely on user experience
- Rapid iteration based on feedback

**Phase 2: Product Decisions**
- Test with stakeholders
- Validate information architecture
- Confirm interaction patterns
- Lock core features
- Get leadership buy-in

**Phase 3: Backend Integration**
- Wire up Clerk authentication
- Connect Prisma to Vercel Postgres
- Replace mock data with API calls
- Maintain exact same UI/UX

#### **Prototyping Stack**

**Frontend Technologies:**
```typescript
// Mock data structure
const mockExperiments = [
  {
    id: 'mock-1',
    title: 'AI Brief Generator',
    status: 'Active',
    owner: { name: 'Tiernan', avatar: '/mock-avatar.png' },
    coverImage: '/mock-cover.png',
    updatedAt: new Date()
  }
]

// Local state management
const [experiments, setExperiments] = useState(mockExperiments)

// Simulated API calls
const createExperiment = async (data) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  // Update local state
  setExperiments([...experiments, newExperiment])
}
```

**Mock Authentication:**
```typescript
// Simple context for prototype
const MockAuthContext = {
  user: {
    id: 'mock-user',
    name: 'Test User',
    email: 'test@nile.com'
  },
  signIn: () => console.log('Mock sign in'),
  signOut: () => console.log('Mock sign out')
}
```

#### **Benefits of This Approach**

1. **Faster Iteration**
   - No database migrations for UI changes
   - No API contracts to update
   - Instant feedback on UX decisions

2. **Better Product Decisions**
   - See the full experience before building
   - Test with real users early
   - Avoid backend rework

3. **Cleaner Architecture**
   - UI components built without backend dependencies
   - Clear separation of concerns
   - Easy to swap mock for real data

4. **Stakeholder Alignment**
   - Lloyd can see client value immediately
   - Team can play with it before it's "real"
   - Lower stakes for experimental features

#### **Prototype Deliverables**

**Week 1:**
- Homepage with activity feed
- Experiment cards with all states
- Create experiment flow
- Fork visualization

**Week 2:**
- Progress timeline interaction
- Filter/search functionality
- Profile pages
- Cover image uploads (simulated)

**Decision Points After Prototype:**
- Is 5-second creation actually achievable?
- Does the activity feed create the right energy?
- Is the fork visualization compelling?
- What's missing from the experience?

### **Consequences**

**Positive:**
- Reduced risk of building wrong features
- Faster time to user feedback
- Cleaner component architecture
- Better stakeholder buy-in
- Lower cost of changes

**Negative:**
- Slightly longer total development time
- Risk of prototype-production drift
- Need to maintain mock data
- Potential for scope creep during prototype

### **Implementation Guidelines**

**Do's:**
- Keep mock data realistic
- Simulate network delays
- Build production-quality UI
- Document component props
- Use TypeScript interfaces

**Don'ts:**
- Don't over-engineer the mock layer
- Don't add features not in PRD
- Don't skip loading states
- Don't ignore edge cases
- Don't couple to mock structure

### **Transition to Production**

**Step 1: Authentication**
```typescript
// Replace MockAuthContext with Clerk
import { useUser } from '@clerk/nextjs'
```

**Step 2: Data Fetching**
```typescript
// Replace local state with React Query
import { useQuery } from '@tanstack/react-query'
const { data: experiments } = useQuery({
  queryKey: ['experiments'],
  queryFn: fetchExperiments
})
```

**Step 3: Mutations**
```typescript
// Replace mock functions with API calls
const mutation = useMutation({
  mutationFn: createExperiment,
  onSuccess: () => queryClient.invalidateQueries(['experiments'])
})
```

### **Success Metrics**

**Prototype Phase:**
- 5+ stakeholder reviews
- 10+ UI iterations
- All core flows tested
- Leadership approval

**Integration Phase:**
- <1 week to wire up backend
- No UI changes required
- All mock data replaced
- Performance targets met

### **References**
- [Frontend-First Development](https://www.smashingmagazine.com/2019/09/frontend-first-design/)
- [Prototyping Best Practices](https://www.nngroup.com/articles/prototypes/)
- [Mock Data Strategies](https://kentcdodds.com/blog/stop-mocking-fetch)

---

### **Change Log**

**v1.0 (23 Aug 2024):**
- Initial ADR created
- Defined frontend-first approach
- Established prototyping phases