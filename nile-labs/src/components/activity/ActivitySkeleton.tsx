export function ActivitySkeleton() {
  return (
    <div className="flex gap-3 p-3 animate-pulse">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}