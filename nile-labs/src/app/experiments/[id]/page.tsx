"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Edit, 
  GitFork, 
  Users, 
  Calendar, 
  Tag, 
  ExternalLink,
  Trash2,
  RotateCcw 
} from "lucide-react";
import { useExperiment, useForkExperiment, useDeleteExperiment, useRestoreExperiment, useAddProgressUpdate } from "~/lib/hooks/useExperiments";
import { ProgressTimeline } from "~/components/experiments/ProgressTimeline";
import { ExperimentStatus } from "~/lib/types";
import { timeAgo, generateColorFromString, getInitials, cn } from "~/lib/utils";

export default function ExperimentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: experiment, isLoading } = useExperiment(params.id);
  const forkMutation = useForkExperiment();
  const deleteMutation = useDeleteExperiment();
  const restoreMutation = useRestoreExperiment();
  const addProgressMutation = useAddProgressUpdate();
  
  const [showForkModal, setShowForkModal] = useState(false);
  const [forkTitle, setForkTitle] = useState("");
  const [forkDescription, setForkDescription] = useState("");

  // Mock current user (in real app, get from auth context)
  const currentUserId = "user-1";
  const isOwner = experiment?.ownerId === currentUserId;
  const isCollaborator = experiment?.collaboratorIds.includes(currentUserId);
  const canEdit = isOwner || isCollaborator;

  const handleFork = async () => {
    if (!experiment) return;
    
    const result = await forkMutation.mutateAsync({
      parentId: experiment.id,
      title: forkTitle || `${experiment.title} (Fork)`,
      description: forkDescription || experiment.description,
    });
    
    setShowForkModal(false);
    router.push(`/experiments/${result.id}`);
  };

  const handleDelete = async () => {
    if (!experiment || !confirm("Are you sure you want to delete this experiment?")) return;
    await deleteMutation.mutateAsync(experiment.id);
    router.push("/experiments");
  };

  const handleRestore = async () => {
    if (!experiment) return;
    await restoreMutation.mutateAsync(experiment.id);
  };

  const handleAddProgress = async (title: string, description: string) => {
    if (!experiment) return;
    await addProgressMutation.mutateAsync({
      experimentId: experiment.id,
      title,
      description,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Experiment not found</h2>
          <p className="text-gray-600 mb-4">This experiment might have been deleted or doesn't exist.</p>
          <Link href="/experiments" className="text-blue-600 hover:text-blue-700">
            ← Back to experiments
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    [ExperimentStatus.Idea]: "bg-gray-100 text-gray-700",
    [ExperimentStatus.Active]: "bg-green-100 text-green-700",
    [ExperimentStatus.Findings]: "bg-amber-100 text-amber-700",
    [ExperimentStatus.InProduction]: "bg-blue-100 text-blue-700",
  };

  const coverColor = generateColorFromString(experiment.title);
  const initials = getInitials(experiment.title);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/experiments" className="hover:text-gray-900">Experiments</Link>
            <span>/</span>
            <span className="text-gray-900">{experiment.title}</span>
          </nav>

          {/* Title and Actions */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {experiment.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  by {experiment.owner?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {timeAgo(experiment.createdAt)}
                </span>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[experiment.status])}>
                  {experiment.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {canEdit && !experiment.deletedAt && (
                <Link
                  href={`/experiments/${experiment.id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
              )}
              {!experiment.deletedAt && (
                <button
                  onClick={() => {
                    setForkTitle(`${experiment.title} (Fork)`);
                    setForkDescription(experiment.description);
                    setShowForkModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <GitFork className="h-4 w-4" />
                  Fork
                </button>
              )}
              {isOwner && experiment.deletedAt && (
                <button
                  onClick={handleRestore}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restore
                </button>
              )}
              {isOwner && !experiment.deletedAt && (
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete experiment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover Image */}
            <div 
              className="h-48 rounded-lg flex items-center justify-center text-white text-4xl font-bold"
              style={{ backgroundColor: coverColor }}
            >
              {experiment.coverImageUrl ? (
                <img 
                  src={experiment.coverImageUrl} 
                  alt={experiment.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                initials
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{experiment.description}</p>
            </div>

            {/* Progress Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Timeline</h2>
              <ProgressTimeline
                updates={experiment.progressUpdates || []}
                onAddUpdate={canEdit ? handleAddProgress : undefined}
                canEdit={canEdit}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="space-y-3">
                {experiment.category && (
                  <div>
                    <dt className="text-sm text-gray-600">Category</dt>
                    <dd className="text-sm font-medium text-gray-900">{experiment.category}</dd>
                  </div>
                )}
                {experiment.forkedFrom && (
                  <div>
                    <dt className="text-sm text-gray-600">Forked from</dt>
                    <dd>
                      <Link 
                        href={`/experiments/${experiment.forkedFrom.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {experiment.forkedFrom.title}
                      </Link>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-600">Last updated</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {timeAgo(experiment.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Tags */}
            {experiment.tags && experiment.tags.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {experiment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Collaborators */}
            {experiment.collaborators && experiment.collaborators.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Collaborators</h3>
                <div className="space-y-2">
                  {experiment.collaborators.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                        {getInitials(user.name || "")}
                      </div>
                      <span className="text-sm text-gray-700">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {experiment.links && experiment.links.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Links</h3>
                <div className="space-y-2">
                  {experiment.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fork Modal */}
      {showForkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fork Experiment</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fork-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="fork-title"
                  type="text"
                  value={forkTitle}
                  onChange={(e) => setForkTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="fork-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="fork-description"
                  value={forkDescription}
                  onChange={(e) => setForkDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  required
                />
              </div>
              <div className="text-sm text-gray-600">
                This will create a new experiment based on "{experiment.title}"
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleFork}
                  disabled={!forkTitle.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Fork
                </button>
                <button
                  onClick={() => setShowForkModal(false)}
                  className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}