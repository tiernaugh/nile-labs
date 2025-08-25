"use client";

import { type ActivityEvent, ActivityEventType } from "~/lib/types";
import { timeAgo, getInitials, generateColorFromString } from "~/lib/utils";
import { 
  Plus, 
  GitFork, 
  UserPlus, 
  TrendingUp, 
  ArrowRight,
  Sparkles 
} from "lucide-react";
import Link from "next/link";

interface ActivityItemProps {
  event: ActivityEvent;
}

export function ActivityItem({ event }: ActivityItemProps) {
  const Icon = getActivityIcon(event.type);
  const content = getActivityContent(event);
  
  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900">
          {content.action}
        </div>
        {content.target && (
          <div className="text-sm text-gray-600 mt-0.5">
            <Link 
              href={`/experiments/${content.targetId}`}
              className="font-medium hover:text-gray-900 transition-colors"
            >
              {content.target}
            </Link>
            {content.description && (
              <span className="text-gray-500"> · {content.description}</span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Avatar user={event.user} size="xs" />
          <span className="text-xs text-gray-500">
            {event.user?.name || "Unknown"} · {timeAgo(event.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

function getActivityIcon(type: ActivityEventType) {
  switch (type) {
    case ActivityEventType.ExperimentCreated:
      return Plus;
    case ActivityEventType.ExperimentForked:
      return GitFork;
    case ActivityEventType.CollaboratorAdded:
      return UserPlus;
    case ActivityEventType.ProgressAdded:
      return TrendingUp;
    case ActivityEventType.StatusChanged:
      return ArrowRight;
    default:
      return Sparkles;
  }
}

function getActivityContent(event: ActivityEvent): {
  action: string;
  target?: string;
  targetId?: string;
  description?: string;
} {
  switch (event.type) {
    case ActivityEventType.ExperimentCreated:
      return {
        action: "Created a new experiment",
        target: event.experiment?.title,
        targetId: event.experimentId,
        description: event.experiment?.category,
      };
      
    case ActivityEventType.ExperimentForked:
      return {
        action: "Forked an experiment",
        target: (event as any).forkedExperiment?.title,
        targetId: (event as any).forkedExperimentId,
        description: `from ${event.experiment?.title}`,
      };
      
    case ActivityEventType.CollaboratorAdded:
      return {
        action: `Added ${(event as any).collaborator?.name} as collaborator`,
        target: event.experiment?.title,
        targetId: event.experimentId,
      };
      
    case ActivityEventType.ProgressAdded:
      return {
        action: "Added progress update",
        target: event.experiment?.title,
        targetId: event.experimentId,
        description: (event as any).progressUpdate?.content,
      };
      
    case ActivityEventType.StatusChanged:
      const statusEvent = event as any;
      return {
        action: `Changed status from ${statusEvent.oldStatus} to ${statusEvent.newStatus}`,
        target: event.experiment?.title,
        targetId: event.experimentId,
      };
      
    default:
      return {
        action: "Activity",
        target: event.experiment?.title,
        targetId: event.experimentId,
      };
  }
}

interface AvatarProps {
  user?: {
    name?: string;
    avatarUrl?: string;
  };
  size?: "xs" | "sm" | "md" | "lg";
}

function Avatar({ user, size = "sm" }: AvatarProps) {
  const sizeClasses = {
    xs: "h-4 w-4 text-xs",
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };
  
  const name = user?.name || "Unknown";
  const initials = getInitials(name);
  const bgColor = generateColorFromString(name);
  
  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={name}
        className={`rounded-full ${sizeClasses[size]}`}
      />
    );
  }
  
  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}