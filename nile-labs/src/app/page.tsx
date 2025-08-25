import { ActivityFeed } from "~/components/activity/ActivityFeed";
import { QuickCreateForm } from "~/components/experiments/QuickCreateForm";
import { ExperimentCard } from "~/components/experiments/ExperimentCard";
import { HydrateClient, api } from "~/trpc/server";
import { ExperimentStatus } from "~/lib/types";
import { Sparkles, Beaker } from "lucide-react";

export default async function Home() {
  // Prefetch data for the activity feed
  void api.experiments.getGroupedActivities.prefetch();
  void api.experiments.getActivityPulse.prefetch();
  
  // Get active experiments for the homepage
  const activeExperiments = await api.experiments.listExperiments({
    status: [ExperimentStatus.Active],
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Beaker className="h-6 w-6 text-purple-600" />
                <span className="text-xl font-bold text-gray-900">Nile Labs</span>
              </div>
              <nav className="flex items-center gap-6">
                <a href="/experiments" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  All Experiments
                </a>
                <a href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  About
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Activity Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Create */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Start an Experiment
                </h2>
                <QuickCreateForm />
              </div>

              {/* Active Experiments Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Active Experiments
                  </h2>
                  <a 
                    href="/experiments" 
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View all →
                  </a>
                </div>
                
                {activeExperiments && activeExperiments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeExperiments.slice(0, 4).map((experiment) => (
                      <ExperimentCard key={experiment.id} experiment={experiment} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Beaker className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No active experiments yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Create your first experiment above
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Activity Feed */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Activity Feed
                </h2>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <ActivityFeed />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </HydrateClient>
  );
}