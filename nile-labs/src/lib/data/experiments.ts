import {
  type Experiment,
  type CreateExperimentInput,
  type UpdateExperimentInput,
  type ForkExperimentInput,
  type ExperimentFilters,
  type ExperimentSortOptions,
  type PaginatedResult,
  type AddProgressUpdateInput,
  type ProgressUpdate,
  ExperimentStatus,
  ExperimentSortBy,
  ActivityEventType,
} from "../types";
import {
  mockExperiments,
  mockUsers,
  generateId,
  delay,
  mockActivityEvents,
} from "./mock-data";
import { addActivityEvent } from "./activities";

// In-memory store for experiments (will be replaced with API calls in Phase 2)
let experiments = [...mockExperiments];

// Get all experiments with optional filters
export async function listExperiments(
  filters?: ExperimentFilters,
  sort?: ExperimentSortOptions,
): Promise<Experiment[]> {
  await delay(300); // Simulate network delay

  let result = [...experiments];

  // Apply filters
  if (filters) {
    // Filter out deleted unless explicitly included
    if (!filters.includeDeleted) {
      result = result.filter((exp) => !exp.deletedAt);
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter((exp) => filters.status?.includes(exp.status));
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      result = result.filter((exp) => 
        exp.category && filters.category?.includes(exp.category)
      );
    }

    // Owner filter
    if (filters.ownerId) {
      result = result.filter((exp) => exp.ownerId === filters.ownerId);
    }

    // Collaborator filter
    if (filters.collaboratorId) {
      result = result.filter((exp) =>
        exp.collaboratorIds.includes(filters.collaboratorId!)
      );
    }

    // Search filter (searches title, description, and tags)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((exp) => {
        const inTitle = exp.title.toLowerCase().includes(searchLower);
        const inDescription = exp.description.toLowerCase().includes(searchLower);
        const inTags = exp.tags?.some((tag) =>
          tag.toLowerCase().includes(searchLower)
        );
        return inTitle || inDescription || inTags;
      });
    }
  }

  // Apply sorting
  if (sort) {
    result.sort((a, b) => {
      let comparison = 0;

      switch (sort.by) {
        case ExperimentSortBy.CreatedAt:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case ExperimentSortBy.UpdatedAt:
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case ExperimentSortBy.Title:
          comparison = a.title.localeCompare(b.title);
          break;
        case ExperimentSortBy.Status:
          comparison = a.status.localeCompare(b.status);
          break;
        case ExperimentSortBy.MostForked:
          // Count forks for each experiment
          const aForks = experiments.filter((e) => e.forkedFromId === a.id).length;
          const bForks = experiments.filter((e) => e.forkedFromId === b.id).length;
          comparison = aForks - bForks;
          break;
      }

      return sort.order === "asc" ? comparison : -comparison;
    });
  }

  // Add owner and collaborator details
  return result.map((exp) => ({
    ...exp,
    owner: mockUsers.find((u) => u.id === exp.ownerId),
    collaborators: mockUsers.filter((u) => exp.collaboratorIds.includes(u.id)),
  }));
}

// Get a single experiment by ID
export async function getExperiment(id: string): Promise<Experiment | null> {
  await delay(200);
  
  const experiment = experiments.find((exp) => exp.id === id);
  if (!experiment) return null;

  // Add related data
  return {
    ...experiment,
    owner: mockUsers.find((u) => u.id === experiment.ownerId),
    collaborators: mockUsers.filter((u) =>
      experiment.collaboratorIds.includes(u.id)
    ),
    forkedFrom: experiment.forkedFromId
      ? experiments.find((e) => e.id === experiment.forkedFromId)
      : undefined,
  };
}

// Create a new experiment
export async function createExperiment(
  input: CreateExperimentInput,
  userId: string,
): Promise<Experiment> {
  await delay(500);

  const newExperiment: Experiment = {
    id: generateId("exp"),
    title: input.title,
    description: input.description,
    status: input.status || ExperimentStatus.Idea,
    category: input.category,
    tags: input.tags || [],
    links: input.links?.map((link) => ({
      ...link,
      id: generateId("link"),
    })),
    ownerId: userId,
    owner: mockUsers.find((u) => u.id === userId),
    collaboratorIds: [],
    collaborators: [],
    progressUpdates: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  experiments.push(newExperiment);

  // Add activity event
  await addActivityEvent({
    type: ActivityEventType.ExperimentCreated,
    userId,
    experimentId: newExperiment.id,
  });

  return newExperiment;
}

// Update an experiment
export async function updateExperiment(
  id: string,
  input: UpdateExperimentInput,
  userId: string,
): Promise<Experiment | null> {
  await delay(400);

  const index = experiments.findIndex((exp) => exp.id === id);
  if (index === -1) return null;

  const oldExperiment = experiments[index];
  const updatedExperiment = {
    ...oldExperiment,
    ...input,
    updatedAt: new Date(),
  };

  experiments[index] = updatedExperiment;

  // Add status change event if status changed
  if (input.status && input.status !== oldExperiment.status) {
    await addActivityEvent({
      type: ActivityEventType.StatusChanged,
      userId,
      experimentId: id,
      metadata: {
        oldStatus: oldExperiment.status,
        newStatus: input.status,
      },
    });
  }

  return updatedExperiment;
}

// Soft delete an experiment
export async function deleteExperiment(
  id: string,
  userId: string,
): Promise<boolean> {
  await delay(300);

  const index = experiments.findIndex((exp) => exp.id === id);
  if (index === -1) return false;

  experiments[index] = {
    ...experiments[index],
    deletedAt: new Date(),
    updatedAt: new Date(),
  };

  return true;
}

// Restore a deleted experiment
export async function restoreExperiment(
  id: string,
  userId: string,
): Promise<Experiment | null> {
  await delay(300);

  const index = experiments.findIndex((exp) => exp.id === id);
  if (index === -1) return null;

  const restoredExperiment = {
    ...experiments[index],
    deletedAt: undefined,
    updatedAt: new Date(),
  };

  experiments[index] = restoredExperiment;
  return restoredExperiment;
}

// Fork an experiment
export async function forkExperiment(
  input: ForkExperimentInput,
  userId: string,
): Promise<Experiment | null> {
  await delay(500);

  const original = experiments.find((exp) => exp.id === input.originalId);
  if (!original) return null;

  const forkedExperiment: Experiment = {
    id: generateId("exp"),
    title: input.title || `${original.title} (Fork)`,
    description: input.description || original.description,
    status: ExperimentStatus.Idea,
    category: original.category,
    tags: [...(original.tags || [])],
    links: [],
    ownerId: userId,
    owner: mockUsers.find((u) => u.id === userId),
    collaboratorIds: [],
    collaborators: [],
    forkedFromId: original.id,
    forkedFrom: original,
    progressUpdates: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  experiments.push(forkedExperiment);

  // Add fork event
  await addActivityEvent({
    type: ActivityEventType.ExperimentForked,
    userId,
    experimentId: original.id,
    metadata: {
      forkedExperimentId: forkedExperiment.id,
    },
  });

  return forkedExperiment;
}

// Add a collaborator to an experiment
export async function addCollaborator(
  experimentId: string,
  collaboratorId: string,
  userId: string,
): Promise<Experiment | null> {
  await delay(300);

  const index = experiments.findIndex((exp) => exp.id === experimentId);
  if (index === -1) return null;

  // Check if user exists
  const collaborator = mockUsers.find((u) => u.id === collaboratorId);
  if (!collaborator) return null;

  // Check if already a collaborator
  if (experiments[index].collaboratorIds.includes(collaboratorId)) {
    return experiments[index];
  }

  experiments[index] = {
    ...experiments[index],
    collaboratorIds: [...experiments[index].collaboratorIds, collaboratorId],
    updatedAt: new Date(),
  };

  // Add collaborator event
  await addActivityEvent({
    type: ActivityEventType.CollaboratorAdded,
    userId,
    experimentId,
    metadata: {
      collaboratorId,
    },
  });

  return experiments[index];
}

// Remove a collaborator from an experiment
export async function removeCollaborator(
  experimentId: string,
  collaboratorId: string,
  userId: string,
): Promise<Experiment | null> {
  await delay(300);

  const index = experiments.findIndex((exp) => exp.id === experimentId);
  if (index === -1) return null;

  experiments[index] = {
    ...experiments[index],
    collaboratorIds: experiments[index].collaboratorIds.filter(
      (id) => id !== collaboratorId
    ),
    updatedAt: new Date(),
  };

  return experiments[index];
}

// Add a progress update
export async function addProgressUpdate(
  input: AddProgressUpdateInput,
  userId: string,
): Promise<ProgressUpdate | null> {
  await delay(400);

  const experimentIndex = experiments.findIndex(
    (exp) => exp.id === input.experimentId
  );
  if (experimentIndex === -1) return null;

  const newUpdate: ProgressUpdate = {
    id: generateId("progress"),
    experimentId: input.experimentId,
    content: input.content,
    createdById: userId,
    createdBy: mockUsers.find((u) => u.id === userId),
    createdAt: new Date(),
  };

  // Add to experiment's progress updates
  if (!experiments[experimentIndex].progressUpdates) {
    experiments[experimentIndex].progressUpdates = [];
  }
  experiments[experimentIndex].progressUpdates!.push(newUpdate);
  experiments[experimentIndex].updatedAt = new Date();

  // Add activity event
  await addActivityEvent({
    type: ActivityEventType.ProgressAdded,
    userId,
    experimentId: input.experimentId,
    metadata: {
      progressUpdate: newUpdate,
    },
  });

  return newUpdate;
}

// Get fork count for an experiment
export async function getForkCount(experimentId: string): Promise<number> {
  await delay(100);
  return experiments.filter((exp) => exp.forkedFromId === experimentId).length;
}

// Get experiments by user (owned or collaborating)
export async function getUserExperiments(userId: string): Promise<Experiment[]> {
  await delay(300);
  
  return experiments.filter(
    (exp) =>
      !exp.deletedAt &&
      (exp.ownerId === userId || exp.collaboratorIds.includes(userId))
  );
}