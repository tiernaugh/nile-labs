import { api } from "~/trpc/react";

const POLL_INTERVAL = 8000; // 8 seconds per ADR-004

export function useActivityFeed() {
  // Get grouped activities with polling
  const activitiesQuery = api.experiments.getGroupedActivities.useQuery(
    undefined,
    {
      refetchInterval: POLL_INTERVAL,
      refetchIntervalInBackground: false, // Pause when tab not visible
      refetchOnWindowFocus: true, // Immediate refresh on focus
      refetchOnReconnect: true,
      staleTime: 5000, // Consider data stale after 5 seconds
      retry: 2, // Retry failed requests twice
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    }
  );

  // Get activity pulse (count of events in last 24h)
  const pulseQuery = api.experiments.getActivityPulse.useQuery(
    undefined,
    {
      refetchInterval: POLL_INTERVAL,
      refetchIntervalInBackground: false,
      staleTime: 5000,
    }
  );

  return {
    activities: activitiesQuery.data,
    pulse: pulseQuery.data,
    isLoading: activitiesQuery.isLoading || pulseQuery.isLoading,
    isError: activitiesQuery.isError || pulseQuery.isError,
    error: activitiesQuery.error || pulseQuery.error,
    refetch: () => {
      activitiesQuery.refetch();
      pulseQuery.refetch();
    },
  };
}

// Hook for fetching activities with custom filters
export function useActivities(filters?: {
  since?: Date;
  types?: string[];
  limit?: number;
}) {
  return api.experiments.getActivities.useQuery(filters, {
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}