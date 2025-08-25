"use client";

import { useActivityFeed } from "~/lib/hooks/useActivityFeed";
import { ActivityItem } from "./ActivityItem";
import { ActivitySkeleton } from "./ActivitySkeleton";
import { cn } from "~/lib/utils";
import { Sparkles } from "lucide-react";

interface ActivityFeedProps {
  className?: string;
  showPulse?: boolean;
}

export function ActivityFeed({ className, showPulse = true }: ActivityFeedProps) {
  const { activities, pulse, isLoading, isError, error } = useActivityFeed();

  if (isError) {
    return (
      <div className={cn("rounded-lg border border-red-200 bg-red-50 p-4", className)}>
        <p className="text-sm text-red-600">
          Failed to load activity feed. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <ActivitySkeleton />
        <ActivitySkeleton />
        <ActivitySkeleton />
      </div>
    );
  }

  if (!activities || Object.keys(activities).length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No experiments yet
        </h3>
        <p className="text-sm text-gray-500">
          Start your first experiment. Title + one line. Done.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {showPulse && pulse && pulse.total > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              Activity Pulse
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {pulse.total} {pulse.total === 1 ? "event" : "events"} in the last 24 hours
          </span>
        </div>
      )}

      {Object.entries(activities).map(([group, events]) => (
        <div key={group} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-1">
            {getGroupLabel(group)}
          </h3>
          <div className="space-y-2">
            {events.map((event) => (
              <ActivityItem key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}

      <button className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        Load more
      </button>
    </div>
  );
}

function getGroupLabel(group: string): string {
  switch (group) {
    case "recent":
      return "Recent";
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "thisWeek":
      return "This Week";
    case "lastWeek":
      return "Last Week";
    case "older":
      return "Older";
    default:
      return group;
  }
}