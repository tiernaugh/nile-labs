"use client";

import { useState, useRef, useEffect } from "react";
import { useCreateExperiment } from "~/lib/hooks/useExperiments";
import { cn } from "~/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

interface QuickCreateFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function QuickCreateForm({ className, onSuccess }: QuickCreateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  const createMutation = useCreateExperiment();
  const isSubmitting = createMutation.isPending;
  
  // Focus title input when component mounts
  useEffect(() => {
    titleRef.current?.focus();
  }, []);
  
  // Focus description when title is filled and user presses Enter
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && title.trim()) {
      e.preventDefault();
      setIsExpanded(true);
      setTimeout(() => descriptionRef.current?.focus(), 50);
    }
  };
  
  // Submit when description is filled and user presses Enter (not Shift+Enter)
  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && description.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    
    try {
      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setIsExpanded(false);
      titleRef.current?.focus();
      
      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error("Failed to create experiment:", error);
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
        <div className="p-4 space-y-3">
          {/* Title Input */}
          <div className="relative">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onFocus={() => title && setIsExpanded(true)}
              placeholder="What's your experiment?"
              className="w-full px-3 py-2 text-lg font-medium placeholder-gray-400 border-0 focus:outline-none focus:ring-0"
              disabled={isSubmitting}
              aria-label="Experiment title"
            />
            {!title && !isExpanded && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs text-gray-400">
                <Sparkles className="h-3 w-3" />
                <span>5-second creation</span>
              </div>
            )}
          </div>
          
          {/* Description Input - Shows when title is entered */}
          {(isExpanded || title) && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              <textarea
                ref={descriptionRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleDescriptionKeyDown}
                placeholder="Brief description (one line is enough)"
                className="w-full px-3 py-2 text-sm placeholder-gray-400 border-0 focus:outline-none focus:ring-0 resize-none"
                rows={2}
                disabled={isSubmitting}
                aria-label="Experiment description"
              />
              
              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 rounded">Enter</kbd> to create
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !description.trim() || isSubmitting}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    title.trim() && description.trim() && !isSubmitting
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-100 text-gray-400"
                  )}
                  aria-label="Create experiment"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="inline h-3 w-3 mr-1 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Success State */}
      {createMutation.isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 rounded-lg animate-in fade-in duration-200">
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Experiment created!</p>
          </div>
        </div>
      )}
    </div>
  );
}