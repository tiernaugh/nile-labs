// Core data types for Nile Labs platform
// Based on PRD-001 v1.3 data model

export enum ExperimentStatus {
  Idea = "Idea",
  Active = "Active",
  Findings = "Findings",
  InProduction = "In Production",
}

export enum ExperimentCategory {
  ClientExperience = "Client Experience",
  ServiceDesign = "Service Design",
  StrategyInnovation = "Strategy & Innovation",
  ResearchInsights = "Research & Insights",
  ProcessMethods = "Process & Methods",
  AIAutomation = "AI & Automation",
  InternalCapability = "Internal Capability",
  Other = "Other",
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Link {
  id: string;
  title: string;
  url: string;
}

export interface ProgressUpdate {
  id: string;
  experimentId: string;
  content: string;
  createdById: string;
  createdBy?: User;
  createdAt: Date;
}

export interface Experiment {
  id: string;
  title: string;
  description: string;
  status: ExperimentStatus;
  category?: ExperimentCategory;
  coverImageUrl?: string;
  ownerId: string;
  owner?: User;
  collaboratorIds: string[];
  collaborators?: User[];
  forkedFromId?: string;
  forkedFrom?: Experiment;
  links?: Link[];
  tags?: string[];
  progressUpdates?: ProgressUpdate[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete capability
}

// Activity feed event types
export enum ActivityEventType {
  ExperimentCreated = "experiment_created",
  StatusChanged = "status_changed",
  ProgressAdded = "progress_added",
  ExperimentForked = "experiment_forked",
  CollaboratorAdded = "collaborator_added",
}

export interface BaseActivityEvent {
  id: string;
  type: ActivityEventType;
  userId: string;
  user?: User;
  experimentId: string;
  experiment?: Experiment;
  createdAt: Date;
}

export interface ExperimentCreatedEvent extends BaseActivityEvent {
  type: ActivityEventType.ExperimentCreated;
}

export interface StatusChangedEvent extends BaseActivityEvent {
  type: ActivityEventType.StatusChanged;
  oldStatus: ExperimentStatus;
  newStatus: ExperimentStatus;
}

export interface ProgressAddedEvent extends BaseActivityEvent {
  type: ActivityEventType.ProgressAdded;
  progressUpdate: ProgressUpdate;
}

export interface ExperimentForkedEvent extends BaseActivityEvent {
  type: ActivityEventType.ExperimentForked;
  forkedExperimentId: string;
  forkedExperiment?: Experiment;
}

export interface CollaboratorAddedEvent extends BaseActivityEvent {
  type: ActivityEventType.CollaboratorAdded;
  collaboratorId: string;
  collaborator?: User;
}

export type ActivityEvent =
  | ExperimentCreatedEvent
  | StatusChangedEvent
  | ProgressAddedEvent
  | ExperimentForkedEvent
  | CollaboratorAddedEvent;

// Input types for mutations
export interface CreateExperimentInput {
  title: string;
  description: string;
  status?: ExperimentStatus;
  category?: ExperimentCategory;
  tags?: string[];
  links?: Omit<Link, "id">[];
}

export interface UpdateExperimentInput {
  title?: string;
  description?: string;
  status?: ExperimentStatus;
  category?: ExperimentCategory;
  tags?: string[];
  links?: Omit<Link, "id">[];
}

export interface AddProgressUpdateInput {
  experimentId: string;
  content: string;
}

export interface ForkExperimentInput {
  originalId: string;
  title?: string;
  description?: string;
}

// Filter and search types
export interface ExperimentFilters {
  status?: ExperimentStatus[];
  category?: ExperimentCategory[];
  ownerId?: string;
  collaboratorId?: string;
  includeDeleted?: boolean;
  search?: string;
}

export interface ActivityFilters {
  since?: Date;
  types?: ActivityEventType[];
  userId?: string;
  experimentId?: string;
  limit?: number;
}

// Utility types
export type ExperimentWithDetails = Experiment & {
  owner: User;
  collaborators: User[];
  progressUpdates: ProgressUpdate[];
  forkedFrom?: Experiment;
};

export type ActivityEventWithDetails = ActivityEvent & {
  user: User;
  experiment: Experiment;
};

// Sort options
export enum ExperimentSortBy {
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  Title = "title",
  Status = "status",
  MostForked = "mostForked",
}

export interface ExperimentSortOptions {
  by: ExperimentSortBy;
  order: "asc" | "desc";
}

// Pagination
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// Mock auth context type
export interface MockAuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface MockAuthContextType {
  user: MockAuthUser | null;
  signIn: (email: string) => void;
  signOut: () => void;
  isSignedIn: boolean;
}