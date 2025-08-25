"use client";

import Link from "next/link";
import { type Experiment } from "~/lib/types";
import { ExperimentCard } from "./ExperimentCard";
import { cn } from "~/lib/utils";

interface ExperimentGridProps {
  experiments: Experiment[];
  isLoading?: boolean;
  className?: string;
}

export function ExperimentGrid({ experiments, isLoading, className }: ExperimentGridProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (experiments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">🧪</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No experiments found
        </h3>
        <p className="text-gray-600 max-w-md">
          Try adjusting your filters or search query. Or better yet, start a new experiment!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {experiments.map((experiment) => (
        <Link
          key={experiment.id}
          href={`/experiments/${experiment.id}`}
          className="block hover:scale-[1.02] transition-transform"
        >
          <ExperimentCard experiment={experiment} />
        </Link>
      ))}
    </div>
  );
}