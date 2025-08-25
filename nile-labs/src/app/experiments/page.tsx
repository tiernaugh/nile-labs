"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Grid3X3, List } from "lucide-react";
import { ExperimentStatus, ExperimentCategory, ExperimentSortBy } from "~/lib/types";
import { useExperiments } from "~/lib/hooks/useExperiments";
import { ExperimentGrid } from "~/components/experiments/ExperimentGrid";
import { ExperimentFilters } from "~/components/experiments/ExperimentFilters";
import { cn } from "~/lib/utils";

export default function ExperimentsPage() {
  const [filters, setFilters] = useState({
    status: [] as ExperimentStatus[],
    category: [] as ExperimentCategory[],
    search: "",
  });
  const [sortBy, setSortBy] = useState<ExperimentSortBy>(ExperimentSortBy.CreatedAt);
  const [sortDesc, setSortDesc] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch experiments with filters and sorting
  const { data: experiments, isLoading } = useExperiments({
    status: filters.status.length > 0 ? filters.status : undefined,
    category: filters.category.length > 0 ? filters.category : undefined,
    search: filters.search || undefined,
  });

  // Sort experiments client-side (since we're using mock data)
  const sortedExperiments = useMemo(() => {
    if (!experiments) return [];
    
    return [...experiments].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
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
          const statusOrder = {
            [ExperimentStatus.Idea]: 0,
            [ExperimentStatus.Active]: 1,
            [ExperimentStatus.Findings]: 2,
            [ExperimentStatus.InProduction]: 3,
          };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case ExperimentSortBy.Forks:
          // Count forks by checking forkedFromId references
          const aForks = experiments.filter(e => e.forkedFromId === a.id).length;
          const bForks = experiments.filter(e => e.forkedFromId === b.id).length;
          comparison = aForks - bForks;
          break;
      }
      
      return sortDesc ? -comparison : comparison;
    });
  }, [experiments, sortBy, sortDesc]);

  const handleSortChange = (newSortBy: ExperimentSortBy) => {
    if (newSortBy === sortBy) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(newSortBy);
      setSortDesc(true);
    }
  };

  const sortOptions = [
    { value: ExperimentSortBy.CreatedAt, label: "Newest" },
    { value: ExperimentSortBy.UpdatedAt, label: "Recently Updated" },
    { value: ExperimentSortBy.Forks, label: "Most Forked" },
    { value: ExperimentSortBy.Title, label: "Title" },
    { value: ExperimentSortBy.Status, label: "Status" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Experiments</h1>
          <p className="text-gray-600">
            Explore {sortedExperiments.length} experiments across the team
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-8 bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>
              <ExperimentFilters onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as ExperimentSortBy)}
                  className="px-4 py-2 pr-8 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {/* Sort Direction */}
                <button
                  onClick={() => setSortDesc(!sortDesc)}
                  className={cn(
                    "p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                  aria-label={sortDesc ? "Sort ascending" : "Sort descending"}
                >
                  <ArrowUpDown className={cn("h-4 w-4", sortDesc && "rotate-180")} />
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded",
                    viewMode === "grid" 
                      ? "bg-white shadow-sm" 
                      : "hover:bg-gray-200"
                  )}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded",
                    viewMode === "list" 
                      ? "bg-white shadow-sm" 
                      : "hover:bg-gray-200"
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Results Count */}
            {filters.search && (
              <div className="mb-4 text-sm text-gray-600">
                Found {sortedExperiments.length} experiments matching "{filters.search}"
              </div>
            )}

            {/* Experiments Grid/List */}
            <ExperimentGrid
              experiments={sortedExperiments}
              isLoading={isLoading}
              className={viewMode === "list" ? "!grid-cols-1" : ""}
            />
          </main>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => {
          // TODO: Open mobile filter drawer
          alert("Mobile filters coming soon!");
        }}
      >
        Filters
      </button>
    </div>
  );
}