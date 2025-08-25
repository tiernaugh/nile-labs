"use client";

import { useState } from "react";
import { Plus, CheckCircle, Circle } from "lucide-react";
import { type ProgressUpdate } from "~/lib/types";
import { timeAgo } from "~/lib/utils";
import { cn } from "~/lib/utils";

interface ProgressTimelineProps {
  updates: ProgressUpdate[];
  onAddUpdate?: (title: string, description: string) => void;
  canEdit?: boolean;
  className?: string;
}

export function ProgressTimeline({ 
  updates, 
  onAddUpdate, 
  canEdit = false,
  className 
}: ProgressTimelineProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && onAddUpdate) {
      onAddUpdate(newTitle.trim(), newDescription.trim());
      setNewTitle("");
      setNewDescription("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewTitle("");
    setNewDescription("");
    setIsAdding(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Add Button */}
      {canEdit && !isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          aria-label="Add progress update"
        >
          <Plus className="h-4 w-4" />
          Add Progress Update
        </button>
      )}

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What did you accomplish?"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            required
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add details (optional)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add Update
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Timeline */}
      {updates.length > 0 ? (
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-200" />
          
          {/* Updates */}
          <div className="space-y-6">
            {updates.map((update, index) => (
              <div key={update.id} className="relative flex gap-4">
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {index === 0 ? (
                    <CheckCircle className="h-8 w-8 text-green-500 bg-white rounded-full" />
                  ) : (
                    <Circle className="h-8 w-8 text-gray-400 bg-white rounded-full" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {update.title}
                    </h4>
                    {update.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {update.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{update.createdBy?.name || "Unknown"}</span>
                      <span>•</span>
                      <span>{timeAgo(update.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Circle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No progress updates yet</p>
          {canEdit && (
            <p className="text-xs mt-1">Click the button above to add the first update</p>
          )}
        </div>
      )}
    </div>
  );
}