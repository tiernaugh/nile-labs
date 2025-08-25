import { api } from "~/trpc/react";
import { type ExperimentStatus, type ExperimentCategory, type ExperimentSortBy } from "~/lib/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Hook for listing experiments with filters
export function useExperiments(filters?: {
  status?: ExperimentStatus[];
  category?: ExperimentCategory[];
  ownerId?: string;
  search?: string;
  sortBy?: ExperimentSortBy;
  sortOrder?: "asc" | "desc";
}) {
  return api.experiments.listExperiments.useQuery(filters, {
    staleTime: 10000, // 10 seconds
    refetchOnWindowFocus: false, // Don't refetch on every focus for list views
  });
}

// Hook for single experiment
export function useExperiment(id: string) {
  return api.experiments.getExperiment.useQuery(
    { id },
    {
      enabled: !!id,
      staleTime: 5000,
    }
  );
}

// Hook for creating experiment with optimistic update
export function useCreateExperiment() {
  const router = useRouter();
  const utils = api.useUtils();
  
  return api.experiments.createExperiment.useMutation({
    onSuccess: (newExperiment) => {
      // Invalidate queries to refetch with new data
      utils.experiments.listExperiments.invalidate();
      utils.experiments.getGroupedActivities.invalidate();
      
      // Redirect to new experiment page
      router.push(`/experiments/${newExperiment.id}`);
    },
  });
}

// Hook for updating experiment
export function useUpdateExperiment() {
  const utils = api.useUtils();
  
  return api.experiments.updateExperiment.useMutation({
    onMutate: async (updatedExperiment) => {
      // Cancel outgoing refetches
      await utils.experiments.getExperiment.cancel({ id: updatedExperiment.id });
      
      // Snapshot the previous value
      const previousExperiment = utils.experiments.getExperiment.getData({
        id: updatedExperiment.id,
      });
      
      // Optimistically update to the new value
      if (previousExperiment) {
        utils.experiments.getExperiment.setData(
          { id: updatedExperiment.id },
          { ...previousExperiment, ...updatedExperiment }
        );
      }
      
      return { previousExperiment };
    },
    onError: (err, updatedExperiment, context) => {
      // Rollback on error
      if (context?.previousExperiment) {
        utils.experiments.getExperiment.setData(
          { id: updatedExperiment.id },
          context.previousExperiment
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Sync with server state
      utils.experiments.getExperiment.invalidate({ id: variables.id });
      utils.experiments.listExperiments.invalidate();
      
      // Invalidate activity feed if status changed
      if (variables.status) {
        utils.experiments.getGroupedActivities.invalidate();
      }
    },
  });
}

// Hook for forking experiment
export function useForkExperiment() {
  const router = useRouter();
  const utils = api.useUtils();
  
  return api.experiments.forkExperiment.useMutation({
    onSuccess: (forkedExperiment) => {
      // Invalidate queries
      utils.experiments.listExperiments.invalidate();
      utils.experiments.getGroupedActivities.invalidate();
      
      // Redirect to forked experiment
      router.push(`/experiments/${forkedExperiment?.id}`);
    },
  });
}

// Hook for adding progress update
export function useAddProgressUpdate() {
  const utils = api.useUtils();
  
  return api.experiments.addProgressUpdate.useMutation({
    onSuccess: (data, variables) => {
      // Invalidate the experiment to show new progress
      utils.experiments.getExperiment.invalidate({ id: variables.experimentId });
      utils.experiments.getGroupedActivities.invalidate();
    },
  });
}

// Hook for soft delete
export function useDeleteExperiment() {
  const utils = api.useUtils();
  
  return api.experiments.deleteExperiment.useMutation({
    onSuccess: () => {
      utils.experiments.listExperiments.invalidate();
    },
  });
}

// Hook for restore
export function useRestoreExperiment() {
  const utils = api.useUtils();
  
  return api.experiments.restoreExperiment.useMutation({
    onSuccess: () => {
      utils.experiments.listExperiments.invalidate();
    },
  });
}

// Hook for search with debouncing
export function useExperimentSearch() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 200); // 200ms debounce as per requirements
    
    return () => clearTimeout(timer);
  }, [search]);
  
  const query = useExperiments({
    search: debouncedSearch || undefined,
  });
  
  return {
    search,
    setSearch,
    results: query.data,
    isSearching: query.isLoading,
  };
}

// Hook for user's experiments
export function useUserExperiments(userId: string) {
  return api.experiments.getUserExperiments.useQuery(
    { userId },
    {
      enabled: !!userId,
      staleTime: 10000,
    }
  );
}

// Hook for fork count
export function useForkCount(experimentId: string) {
  return api.experiments.getForkCount.useQuery(
    { experimentId },
    {
      enabled: !!experimentId,
      staleTime: 30000, // Fork count doesn't change often
    }
  );
}