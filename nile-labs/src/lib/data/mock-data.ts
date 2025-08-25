import {
  type User,
  type Experiment,
  type ProgressUpdate,
  type ActivityEvent,
  ExperimentStatus,
  ExperimentCategory,
  ActivityEventType,
  type ExperimentCreatedEvent,
  type StatusChangedEvent,
  type ProgressAddedEvent,
  type ExperimentForkedEvent,
  type CollaboratorAddedEvent,
} from "../types";

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "tiernan@nile.com",
    name: "Tiernan",
    avatarUrl: undefined,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user-2",
    email: "sarah@nile.com",
    name: "Sarah Chen",
    avatarUrl: undefined,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user-3",
    email: "alex@nile.com",
    name: "Alex Kumar",
    avatarUrl: undefined,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user-4",
    email: "emma@nile.com",
    name: "Emma Wilson",
    avatarUrl: undefined,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user-5",
    email: "tom@nile.com",
    name: "Tom Mitchell",
    avatarUrl: undefined,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user-6",
    email: "lloyd@nile.com",
    name: "Lloyd",
    avatarUrl: undefined,
    createdAt: new Date("2024-01-01"),
  },
];

// Helper to generate deterministic color from string
export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

// Helper to generate initials
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Mock progress updates
const mockProgressUpdates: ProgressUpdate[] = [
  {
    id: "progress-1",
    experimentId: "exp-1",
    content: "Completed initial user research interviews with 5 participants",
    createdById: "user-2",
    createdBy: mockUsers[1],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "progress-2",
    experimentId: "exp-1",
    content: "Synthesized findings into key themes and opportunities",
    createdById: "user-2",
    createdBy: mockUsers[1],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "progress-3",
    experimentId: "exp-2",
    content: "Built initial prototype using Figma",
    createdById: "user-3",
    createdBy: mockUsers[2],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "progress-4",
    experimentId: "exp-3",
    content: "Tested ChatGPT API for discussion guide generation",
    createdById: "user-4",
    createdBy: mockUsers[3],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "progress-5",
    experimentId: "exp-3",
    content: "Created template library with 10 discussion guide formats",
    createdById: "user-4",
    createdBy: mockUsers[3],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

// Mock experiments
export const mockExperiments: Experiment[] = [
  {
    id: "exp-1",
    title: "AI Brief Generator",
    description: "Exploring how we can use LLMs to generate creative briefs from client conversations. Testing with GPT-4 and Claude to see which produces better strategic outputs.",
    status: ExperimentStatus.Active,
    category: ExperimentCategory.AIAutomation,
    coverImageUrl: undefined,
    ownerId: "user-2",
    owner: mockUsers[1],
    collaboratorIds: ["user-3", "user-4"],
    collaborators: [mockUsers[2], mockUsers[3]],
    forkedFromId: undefined,
    links: [
      { id: "link-1", title: "Miro Board", url: "https://miro.com/board/123" },
      { id: "link-2", title: "Test Results", url: "https://docs.google.com/123" },
    ],
    tags: ["AI", "automation", "briefs", "GPT-4"],
    progressUpdates: mockProgressUpdates.filter((p) => p.experimentId === "exp-1"),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "exp-2",
    title: "Customer Journey Mapping Tool",
    description: "Building a digital tool to help clients map their customer journeys in real-time during workshops. Will integrate with our existing facilitation toolkit.",
    status: ExperimentStatus.Active,
    category: ExperimentCategory.ServiceDesign,
    coverImageUrl: undefined,
    ownerId: "user-3",
    owner: mockUsers[2],
    collaboratorIds: ["user-5"],
    collaborators: [mockUsers[4]],
    forkedFromId: undefined,
    tags: ["journey mapping", "workshops", "digital tools"],
    progressUpdates: mockProgressUpdates.filter((p) => p.experimentId === "exp-2"),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "exp-3",
    title: "Using ChatGPT for Interview Guides",
    description: "Creating a prompt library to help consultants quickly generate discussion guides for user interviews. Testing different prompt structures.",
    status: ExperimentStatus.Active,
    category: ExperimentCategory.ResearchInsights,
    coverImageUrl: undefined,
    ownerId: "user-4",
    owner: mockUsers[3],
    collaboratorIds: [],
    collaborators: [],
    forkedFromId: undefined,
    tags: ["ChatGPT", "research", "interviews", "prompts"],
    progressUpdates: mockProgressUpdates.filter((p) => p.experimentId === "exp-3"),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "exp-4",
    title: "Design System 2.0",
    description: "Evolving our design system to be more flexible and component-based. Exploring token-based theming for client projects.",
    status: ExperimentStatus.InProduction,
    category: ExperimentCategory.InternalCapability,
    coverImageUrl: undefined,
    ownerId: "user-5",
    owner: mockUsers[4],
    collaboratorIds: ["user-2", "user-3"],
    collaborators: [mockUsers[1], mockUsers[2]],
    forkedFromId: undefined,
    tags: ["design system", "components", "tokens"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "exp-5",
    title: "Storyboard Generator with Gemini",
    description: "Using Google's Gemini to create storyboards from text descriptions. Could speed up our concept visualization process.",
    status: ExperimentStatus.Idea,
    category: ExperimentCategory.AIAutomation,
    coverImageUrl: undefined,
    ownerId: "user-1",
    owner: mockUsers[0],
    collaboratorIds: [],
    collaborators: [],
    forkedFromId: "exp-3",
    forkedFrom: mockExperiments[2],
    tags: ["Gemini", "AI", "storyboards", "visualization"],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "exp-6",
    title: "Workshop Energy Tracker",
    description: "Tried using sentiment analysis to track energy levels during virtual workshops. Interesting insights but privacy concerns made us park it.",
    status: ExperimentStatus.Findings,
    category: ExperimentCategory.ProcessMethods,
    coverImageUrl: undefined,
    ownerId: "user-6",
    owner: mockUsers[5],
    collaboratorIds: ["user-2"],
    collaborators: [mockUsers[1]],
    forkedFromId: undefined,
    tags: ["workshops", "sentiment", "virtual", "energy"],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    deletedAt: undefined,
  },
  {
    id: "exp-7",
    title: "Conversational UI for Sales Training",
    description: "Building a chatbot to help new consultants practice sales conversations. Uses role-play scenarios based on real client interactions.",
    status: ExperimentStatus.Active,
    category: ExperimentCategory.InternalCapability,
    coverImageUrl: undefined,
    ownerId: "user-2",
    owner: mockUsers[1],
    collaboratorIds: ["user-6"],
    collaborators: [mockUsers[5]],
    forkedFromId: undefined,
    tags: ["training", "chatbot", "sales", "AI"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "exp-8",
    title: "Client Portal v2",
    description: "Reimagining how clients access project deliverables. Testing a new interface with better search and filtering.",
    status: ExperimentStatus.Active,
    category: ExperimentCategory.ClientExperience,
    coverImageUrl: undefined,
    ownerId: "user-3",
    owner: mockUsers[2],
    collaboratorIds: ["user-4", "user-5"],
    collaborators: [mockUsers[3], mockUsers[4]],
    forkedFromId: undefined,
    tags: ["portal", "client", "UX", "search"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

// Generate activity events
export const mockActivityEvents: ActivityEvent[] = [
  // Recent experiment creation
  {
    id: "event-1",
    type: ActivityEventType.ExperimentCreated,
    userId: "user-1",
    user: mockUsers[0],
    experimentId: "exp-5",
    experiment: mockExperiments[4],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  } as ExperimentCreatedEvent,
  
  // Progress update
  {
    id: "event-2",
    type: ActivityEventType.ProgressAdded,
    userId: "user-4",
    user: mockUsers[3],
    experimentId: "exp-3",
    experiment: mockExperiments[2],
    progressUpdate: mockProgressUpdates[4],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  } as ProgressAddedEvent,
  
  // Fork event
  {
    id: "event-3",
    type: ActivityEventType.ExperimentForked,
    userId: "user-1",
    user: mockUsers[0],
    experimentId: "exp-3",
    experiment: mockExperiments[2],
    forkedExperimentId: "exp-5",
    forkedExperiment: mockExperiments[4],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  } as ExperimentForkedEvent,
  
  // Status change
  {
    id: "event-4",
    type: ActivityEventType.StatusChanged,
    userId: "user-2",
    user: mockUsers[1],
    experimentId: "exp-7",
    experiment: mockExperiments[6],
    oldStatus: ExperimentStatus.Idea,
    newStatus: ExperimentStatus.Active,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  } as StatusChangedEvent,
  
  // Collaborator added
  {
    id: "event-5",
    type: ActivityEventType.CollaboratorAdded,
    userId: "user-3",
    user: mockUsers[2],
    experimentId: "exp-8",
    experiment: mockExperiments[7],
    collaboratorId: "user-5",
    collaborator: mockUsers[4],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  } as CollaboratorAddedEvent,
  
  // More progress updates
  {
    id: "event-6",
    type: ActivityEventType.ProgressAdded,
    userId: "user-4",
    user: mockUsers[3],
    experimentId: "exp-3",
    experiment: mockExperiments[2],
    progressUpdate: mockProgressUpdates[3],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  } as ProgressAddedEvent,
  
  // Older events
  {
    id: "event-7",
    type: ActivityEventType.ExperimentCreated,
    userId: "user-3",
    user: mockUsers[2],
    experimentId: "exp-8",
    experiment: mockExperiments[7],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  } as ExperimentCreatedEvent,
  
  {
    id: "event-8",
    type: ActivityEventType.StatusChanged,
    userId: "user-5",
    user: mockUsers[4],
    experimentId: "exp-4",
    experiment: mockExperiments[3],
    oldStatus: ExperimentStatus.Active,
    newStatus: ExperimentStatus.InProduction,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  } as StatusChangedEvent,
];

// Helper to generate new IDs
let idCounter = 100;
export function generateId(prefix = "id"): string {
  return `${prefix}-${++idCounter}`;
}

// Helper to simulate network delay
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}