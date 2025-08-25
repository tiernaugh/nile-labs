# Architecture Decision Record (ADR)

## **ADR-004: State Management and Polling Strategy**

### **Document Metadata**
**ADR ID:** ADR-004  
**Title:** State Management and Polling Strategy  
**Date:** 23 Aug 2024  
**Status:** Approved  
**Authors:** Nile Labs Team  
**Related PRDs:** PRD-001  
**Related ADRs:** ADR-003  
**Feature Area:** Platform Core  
**Location:** /03 Documentation/platform-core/  
**Supersedes:** None  
**Superseded By:** None  

---

### **Status**
Approved ✅

### **Context**
The platform needs to show near real-time updates in the activity feed (within ~10 seconds per PRD-001) while maintaining simplicity and avoiding the complexity of WebSockets or SSE for v1. We also need a pragmatic approach to state management that works well with Next.js 15's server components while providing good DX during the prototype phase.

### **Decision**

#### **State Management**

**For Frontend Prototype (Phase 1):**
- Use React's built-in useState/useReducer for local state
- Keep mock data in memory during prototype phase
- Simple context for auth/user state

**For Production (Phase 2):**
- **TanStack Query (React Query)** for server state management
- Leverages server components where possible
- Client components with React Query for interactive features
- No global state management library (Redux/Zustand) in v1

**Rationale:**
- React Query handles caching, synchronization, and background updates elegantly
- Works well with Next.js 15's app router and server components
- Reduces boilerplate compared to manual fetch management
- Built-in optimistic updates for better UX

#### **Activity Feed Updates**

**Polling Strategy:**
```typescript
// Activity feed polling configuration
const POLL_INTERVAL = 8000; // 8 seconds (under 10s requirement)
const POLL_INTERVAL_BACKGROUND = 30000; // 30s when tab not active

// React Query implementation
const { data: activities } = useQuery({
  queryKey: ['activities'],
  queryFn: fetchActivities,
  refetchInterval: POLL_INTERVAL,
  refetchIntervalInBackground: false, // Pause when not visible
  staleTime: 5000, // Consider data stale after 5s
});
```

**Smart Polling Features:**
- Pause polling when tab is not visible
- Immediate refresh on window focus
- Exponential backoff on errors
- Manual refresh button as fallback

#### **Data Fetching Patterns**

**Server Components (default):**
```typescript
// For static/less frequently updated content
async function ExperimentList() {
  const experiments = await fetchExperiments();
  return <ExperimentGrid experiments={experiments} />;
}
```

**Client Components with React Query:**
```typescript
// For interactive/frequently updated content
'use client';
function ActivityFeed() {
  const { data, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    refetchInterval: POLL_INTERVAL,
  });
  // ...
}
```

### **Implementation Guidelines**

#### **Query Key Convention**
```typescript
// Consistent query key structure
['experiments'] // All experiments
['experiments', experimentId] // Single experiment
['experiments', 'user', userId] // User's experiments
['activities'] // Activity feed
['activities', { limit: 20 }] // With parameters
```

#### **Optimistic Updates**
```typescript
// For instant feedback on user actions
const mutation = useMutation({
  mutationFn: updateExperimentStatus,
  onMutate: async (newStatus) => {
    // Cancel in-flight queries
    await queryClient.cancelQueries(['experiments']);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['experiments']);
    
    // Optimistically update
    queryClient.setQueryData(['experiments'], (old) => {
      // Update logic
    });
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['experiments'], context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(['experiments']);
  },
});
```

### **Consequences**

**Positive:**
- Simple implementation without WebSocket complexity
- Good enough UX for v1 (updates within 10s)
- Works well with Next.js 15 architecture
- Easy to reason about and debug
- Can upgrade to real-time in v2 if needed
- Reduced server load compared to real-time

**Negative:**
- Not truly real-time (8-10 second delay)
- Increased API calls compared to WebSockets
- Potential for missed updates between polls
- Higher bandwidth usage than SSE

### **Alternatives Considered**

**Alternative 1: WebSockets (Socket.io)**
- **Rejected:** Over-engineering for v1, complex infrastructure
- **Revisit if:** Need sub-second updates, chat features

**Alternative 2: Server-Sent Events (SSE)**
- **Rejected:** Still requires persistent connections, limited browser support
- **Revisit if:** Need one-way real-time updates

**Alternative 3: SWR instead of React Query**
- **Rejected:** React Query has better DevEx, more features
- **Could work:** Both are viable options

**Alternative 4: No polling (manual refresh)**
- **Rejected:** Poor UX, doesn't meet 10-second requirement
- **Not recommended:** Goes against product vision

### **Migration Path to Real-Time (v2)**

If real-time becomes necessary:
1. Keep React Query for data fetching
2. Add WebSocket layer for live updates
3. Use WebSocket events to trigger React Query invalidation
4. Gradual rollout by feature (activity feed first)

### **Monitoring**

Track these metrics:
- Average update latency (goal: <10s)
- API request volume
- Client-side performance impact
- User engagement with activity feed

### **References**
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js 15 Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Polling vs WebSockets](https://ably.com/topic/websockets-vs-http-streaming)

---

### **Change Log**

**v1.0 (23 Aug 2024):**
- Initial ADR created
- Defined polling strategy for activity feed
- Chose React Query for state management