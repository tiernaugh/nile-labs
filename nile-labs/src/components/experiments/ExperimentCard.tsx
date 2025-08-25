"use client";

import { type Experiment } from "~/lib/types";
import { cn, timeAgo, getInitials, generateColorFromString } from "~/lib/utils";
import { 
  Users, 
  GitFork, 
  TrendingUp, 
  MoreHorizontal,
  Clock,
  Hash
} from "lucide-react";
import Link from "next/link";

interface ExperimentCardProps {
  experiment: Experiment;
  className?: string;
}

export function ExperimentCard({ experiment, className }: ExperimentCardProps) {
  const coverColor = experiment.coverImageUrl || generateColorFromString(experiment.title);
  const statusColor = getStatusColor(experiment.status);
  const initials = getInitials(experiment.title);
  
  return (
    <Link
      href={`/experiments/${experiment.id}`}
      className={cn(
        "block group relative rounded-lg border border-gray-200 bg-white",
        "hover:shadow-lg hover:border-gray-300 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        className
      )}
    >
      {/* Cover Image / Color Block */}
      <div 
        className="h-32 rounded-t-lg relative overflow-hidden"
        style={{ 
          backgroundColor: typeof coverColor === 'string' ? coverColor : undefined 
        }}
      >
        {experiment.coverImageUrl ? (
          <img 
            src={experiment.coverImageUrl} 
            alt={experiment.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-3xl font-bold text-white/70">
              {initials}
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            statusColor
          )}>
            {experiment.status}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Meta */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
            {experiment.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            by {experiment.owner?.name || "Unknown"} · {timeAgo(experiment.createdAt)}
          </p>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {experiment.description}
        </p>
        
        {/* Tags */}
        {experiment.tags && experiment.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <Hash className="h-3 w-3 text-gray-400" />
            {experiment.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {tag}
              </span>
            ))}
            {experiment.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{experiment.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {/* Collaborators */}
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{experiment.collaboratorIds?.length || 0}</span>
            </div>
            
            {/* Forks */}
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              <span>{experiment.forkCount || 0}</span>
            </div>
            
            {/* Progress Updates */}
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{experiment.progressUpdates?.length || 0}</span>
            </div>
          </div>
          
          {/* More Options */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement dropdown menu
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Fork Indicator */}
      {experiment.forkedFromId && (
        <div className="absolute -top-2 left-4 px-2 py-0.5 bg-purple-100 rounded-full">
          <div className="flex items-center gap-1">
            <GitFork className="h-3 w-3 text-purple-600" />
            <span className="text-xs text-purple-700">Forked</span>
          </div>
        </div>
      )}
    </Link>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Idea":
      return "bg-gray-100 text-gray-800";
    case "Active":
      return "bg-green-100 text-green-800";
    case "Findings":
      return "bg-amber-100 text-amber-800";
    case "In Production":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}