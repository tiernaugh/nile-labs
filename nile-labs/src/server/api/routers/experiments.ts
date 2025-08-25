import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  listExperiments,
  getExperiment,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  restoreExperiment,
  forkExperiment,
  addCollaborator,
  removeCollaborator,
  addProgressUpdate,
  getForkCount,
  getUserExperiments,
} from "~/lib/data/experiments";
import {
  listActivities,
  getActivityPulse,
  getGroupedActivities,
} from "~/lib/data/activities";
import { ExperimentStatus, ExperimentCategory, ActivityEventType, ExperimentSortBy } from "~/lib/types";

// Mock experiments router using our data layer
export const experimentsRouter = createTRPCRouter({
  // Activity feed endpoints
  getActivities: publicProcedure
    .input(
      z.object({
        since: z.date().optional(),
        types: z.array(z.nativeEnum(ActivityEventType)).optional(),
        limit: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return await listActivities(input);
    }),

  getActivityPulse: publicProcedure.query(async () => {
    return await getActivityPulse();
  }),

  getGroupedActivities: publicProcedure.query(async () => {
    return await getGroupedActivities();
  }),

  // Experiment endpoints
  listExperiments: publicProcedure
    .input(
      z.object({
        status: z.array(z.nativeEnum(ExperimentStatus)).optional(),
        category: z.array(z.nativeEnum(ExperimentCategory)).optional(),
        ownerId: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.nativeEnum(ExperimentSortBy).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const filters = input ? {
        status: input.status,
        category: input.category,
        ownerId: input.ownerId,
        search: input.search,
      } : undefined;

      const sort = input?.sortBy ? {
        by: input.sortBy,
        order: input.sortOrder || "desc",
      } : undefined;

      return await listExperiments(filters, sort);
    }),

  getExperiment: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getExperiment(input.id);
    }),

  createExperiment: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1),
        status: z.nativeEnum(ExperimentStatus).optional(),
        category: z.nativeEnum(ExperimentCategory).optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Mock user ID for prototype
      const userId = "user-1";
      return await createExperiment(input, userId);
    }),

  updateExperiment: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(100).optional(),
        description: z.string().min(1).optional(),
        status: z.nativeEnum(ExperimentStatus).optional(),
        category: z.nativeEnum(ExperimentCategory).optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const userId = "user-1";
      return await updateExperiment(id, updateData, userId);
    }),

  deleteExperiment: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const userId = "user-1";
      return await deleteExperiment(input.id, userId);
    }),

  restoreExperiment: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const userId = "user-1";
      return await restoreExperiment(input.id, userId);
    }),

  forkExperiment: publicProcedure
    .input(
      z.object({
        originalId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userId = "user-1";
      return await forkExperiment(input, userId);
    }),

  addProgressUpdate: publicProcedure
    .input(
      z.object({
        experimentId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const userId = "user-1";
      return await addProgressUpdate(input, userId);
    }),

  addCollaborator: publicProcedure
    .input(
      z.object({
        experimentId: z.string(),
        collaboratorId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const userId = "user-1";
      return await addCollaborator(input.experimentId, input.collaboratorId, userId);
    }),

  getForkCount: publicProcedure
    .input(z.object({ experimentId: z.string() }))
    .query(async ({ input }) => {
      return await getForkCount(input.experimentId);
    }),

  getUserExperiments: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await getUserExperiments(input.userId);
    }),
});