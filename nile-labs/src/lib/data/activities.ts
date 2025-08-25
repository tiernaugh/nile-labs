import {
  type ActivityEvent,
  type ActivityFilters,
  type ExperimentCreatedEvent,
  type StatusChangedEvent,
  type ProgressAddedEvent,
  type ExperimentForkedEvent,
  type CollaboratorAddedEvent,
  ActivityEventType,
  type ProgressUpdate,
  ExperimentStatus,
} from "../types";
import { mockActivityEvents, mockUsers, generateId, delay } from "./mock-data";

// In-memory store for activity events
let activityEvents = [...mockActivityEvents];

// Get activity events with optional filters
export async function listActivities(
  filters?: ActivityFilters
): Promise<ActivityEvent[]> {
  await delay(200); // Simulate network delay

  let result = [...activityEvents];

  if (filters) {
    // Filter by time
    if (filters.since) {
      result = result.filter((event) => event.createdAt > filters.since!);
    }

    // Filter by event types
    if (filters.types && filters.types.length > 0) {
      result = result.filter((event) => filters.types?.includes(event.type));
    }

    // Filter by user
    if (filters.userId) {
      result = result.filter((event) => event.userId === filters.userId);
    }

    // Filter by experiment
    if (filters.experimentId) {
      result = result.filter((event) => event.experimentId === filters.experimentId);
    }

    // Apply limit
    if (filters.limit) {
      result = result.slice(0, filters.limit);
    }
  }

  // Sort by most recent first
  result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Add user and experiment details (in real app, this would be a join)
  return result.map((event) => ({
    ...event,
    user: mockUsers.find((u) => u.id === event.userId),
  }));
}

// Add a new activity event (called internally by other functions)
export async function addActivityEvent(params: {
  type: ActivityEventType;
  userId: string;
  experimentId: string;
  metadata?: any;
}): Promise<ActivityEvent> {
  const baseEvent = {
    id: generateId("event"),
    userId: params.userId,
    user: mockUsers.find((u) => u.id === params.userId),
    experimentId: params.experimentId,
    createdAt: new Date(),
  };

  let newEvent: ActivityEvent;

  switch (params.type) {
    case ActivityEventType.ExperimentCreated:
      newEvent = {
        ...baseEvent,
        type: ActivityEventType.ExperimentCreated,
      } as ExperimentCreatedEvent;
      break;

    case ActivityEventType.StatusChanged:
      newEvent = {
        ...baseEvent,
        type: ActivityEventType.StatusChanged,
        oldStatus: params.metadata.oldStatus as ExperimentStatus,
        newStatus: params.metadata.newStatus as ExperimentStatus,
      } as StatusChangedEvent;
      break;

    case ActivityEventType.ProgressAdded:
      newEvent = {
        ...baseEvent,
        type: ActivityEventType.ProgressAdded,
        progressUpdate: params.metadata.progressUpdate as ProgressUpdate,
      } as ProgressAddedEvent;
      break;

    case ActivityEventType.ExperimentForked:
      newEvent = {
        ...baseEvent,
        type: ActivityEventType.ExperimentForked,
        forkedExperimentId: params.metadata.forkedExperimentId as string,
      } as ExperimentForkedEvent;
      break;

    case ActivityEventType.CollaboratorAdded:
      newEvent = {
        ...baseEvent,
        type: ActivityEventType.CollaboratorAdded,
        collaboratorId: params.metadata.collaboratorId as string,
        collaborator: mockUsers.find(
          (u) => u.id === params.metadata.collaboratorId
        ),
      } as CollaboratorAddedEvent;
      break;

    default:
      throw new Error(`Unknown activity event type: ${params.type}`);
  }

  activityEvents.unshift(newEvent); // Add to beginning for most recent first
  return newEvent;
}

// Get activity count for a time period
export async function getActivityCount(since: Date): Promise<number> {
  await delay(100);
  return activityEvents.filter((event) => event.createdAt > since).length;
}

// Get activity pulse (events in last 24 hours)
export async function getActivityPulse(): Promise<{
  count: number;
  recentEvents: ActivityEvent[];
}> {
  await delay(150);
  
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentEvents = activityEvents
    .filter((event) => event.createdAt > oneDayAgo)
    .slice(0, 5);

  return {
    count: activityEvents.filter((event) => event.createdAt > oneDayAgo).length,
    recentEvents,
  };
}

// Simulate new activity (for demo purposes)
export async function simulateActivity(): Promise<void> {
  const eventTypes = [
    ActivityEventType.ExperimentCreated,
    ActivityEventType.ProgressAdded,
    ActivityEventType.StatusChanged,
  ];

  const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const experimentIds = ["exp-1", "exp-2", "exp-3", "exp-4", "exp-5", "exp-6", "exp-7", "exp-8"];
  const randomExperimentId = experimentIds[Math.floor(Math.random() * experimentIds.length)];

  const metadata: any = {};

  switch (randomType) {
    case ActivityEventType.StatusChanged:
      metadata.oldStatus = ExperimentStatus.Idea;
      metadata.newStatus = ExperimentStatus.Active;
      break;
    case ActivityEventType.ProgressAdded:
      metadata.progressUpdate = {
        id: generateId("progress"),
        experimentId: randomExperimentId,
        content: "Made some interesting progress on this experiment",
        createdById: randomUser.id,
        createdBy: randomUser,
        createdAt: new Date(),
      };
      break;
  }

  await addActivityEvent({
    type: randomType,
    userId: randomUser.id,
    experimentId: randomExperimentId,
    metadata,
  });
}

// Group activities by time period
export async function getGroupedActivities(): Promise<{
  recent: ActivityEvent[];
  today: ActivityEvent[];
  thisWeek: ActivityEvent[];
  older: ActivityEvent[];
}> {
  await delay(200);

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const all = await listActivities();

  return {
    recent: all.filter((e) => e.createdAt > oneHourAgo),
    today: all.filter(
      (e) => e.createdAt <= oneHourAgo && e.createdAt > oneDayAgo
    ),
    thisWeek: all.filter(
      (e) => e.createdAt <= oneDayAgo && e.createdAt > oneWeekAgo
    ),
    older: all.filter((e) => e.createdAt <= oneWeekAgo),
  };
}