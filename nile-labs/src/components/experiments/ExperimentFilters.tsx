"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { ExperimentStatus, ExperimentCategory } from "~/lib/types";
import { cn } from "~/lib/utils";
import { debounce } from "~/lib/utils";

interface ExperimentFiltersProps {
  onFiltersChange: (filters: {
    status: ExperimentStatus[];
    category: ExperimentCategory[];
    search: string;
  }) => void;
  className?: string;
}

export function ExperimentFilters({ onFiltersChange, className }: ExperimentFiltersProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<ExperimentStatus[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ExperimentCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search handler
  const debouncedSearch = debounce((query: string) => {
    onFiltersChange({
      status: selectedStatuses,
      category: selectedCategories,
      search: query,
    });
  }, 200);

  // Update filters when selections change
  useEffect(() => {
    onFiltersChange({
      status: selectedStatuses,
      category: selectedCategories,
      search: searchQuery,
    });
  }, [selectedStatuses, selectedCategories]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const toggleStatus = (status: ExperimentStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleCategory = (category: ExperimentCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSearchQuery("");
    onFiltersChange({
      status: [],
      category: [],
      search: "",
    });
  };

  const hasActiveFilters = selectedStatuses.length > 0 || selectedCategories.length > 0 || searchQuery;

  // Status options in semantic order
  const statusOptions = [
    { value: ExperimentStatus.Idea, label: "Idea", color: "bg-gray-100" },
    { value: ExperimentStatus.Active, label: "Active", color: "bg-green-100" },
    { value: ExperimentStatus.Findings, label: "Findings", color: "bg-amber-100" },
    { value: ExperimentStatus.InProduction, label: "In Production", color: "bg-blue-100" },
  ];

  const categoryOptions = [
    { value: ExperimentCategory.ProcessMethods, label: "Process & Methods" },
    { value: ExperimentCategory.ClientDeliverables, label: "Client Deliverables" },
    { value: ExperimentCategory.InternalCapability, label: "Internal Capability" },
    { value: ExperimentCategory.DesignPatterns, label: "Design Patterns" },
    { value: ExperimentCategory.AIAutomation, label: "AI & Automation" },
    { value: ExperimentCategory.Other, label: "Other" },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search */}
      <div>
        <label htmlFor="search" className="text-sm font-medium text-gray-700 block mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search experiments..."
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
        <div className="space-y-2">
          {statusOptions.map((status) => (
            <label
              key={status.value}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status.value)}
                onChange={() => toggleStatus(status.value)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="flex items-center gap-2 text-sm">
                <span className={cn("w-2 h-2 rounded-full", status.color)} />
                {status.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
        <div className="space-y-2">
          {categoryOptions.map((category) => (
            <label
              key={category.value}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.value)}
                onChange={() => toggleCategory(category.value)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X className="h-4 w-4" />
          Clear filters
        </button>
      )}
    </div>
  );
}