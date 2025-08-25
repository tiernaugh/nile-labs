import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";

const POLL_INTERVAL = 8000; // 8 seconds per ADR-004
const POLL_INTERVAL_BACKGROUND = 30000; // 30 seconds when tab not active

export function useActivityFeed() {
  const isTabVisible = useRef(true);
  const lastFocusTime = useRef(Date.now());

  // Get grouped activities with polling
  const activitiesQuery = api.experiments.getGroupedActivities.useQuery(
    undefined,
    {
      refetchInterval: isTabVisible.current ? POLL_INTERVAL : POLL_INTERVAL_BACKGROUND,
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

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisible.current = !document.hidden;
      
      if (!document.hidden) {
        // Tab became visible - check if we should refetch
        const timeSinceLastFocus = Date.now() - lastFocusTime.current;
        if (timeSinceLastFocus > POLL_INTERVAL) {
          activitiesQuery.refetch();
          pulseQuery.refetch();
        }
        lastFocusTime.current = Date.now();
      }
    };

    const handleFocus = () => {
      // Window received focus
      isTabVisible.current = true;
      const timeSinceLastFocus = Date.now() - lastFocusTime.current;
      if (timeSinceLastFocus > POLL_INTERVAL) {
        activitiesQuery.refetch();
        pulseQuery.refetch();
      }
      lastFocusTime.current = Date.now();
    };

    const handleBlur = () => {
      // Window lost focus
      isTabVisible.current = false;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [activitiesQuery, pulseQuery]);

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