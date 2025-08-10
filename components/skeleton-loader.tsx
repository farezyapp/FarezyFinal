import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "circular" | "rectangular" | "text";
  lines?: number;
}

export function Skeleton({ className, variant = "default", lines = 1 }: SkeletonProps) {
  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 skeleton rounded animate-pulse",
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
          />
        ))}
      </div>
    );
  }

  const variantClasses = {
    default: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    text: "h-4 w-full rounded"
  };

  return (
    <div
      className={cn(
        "skeleton animate-pulse",
        variantClasses[variant],
        className
      )}
    />
  );
}

export function RideOptionSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="space-y-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-16 h-3" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-12 h-3" />
        </div>
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="relative w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
      <div className="absolute inset-0 skeleton" />
      <div className="absolute top-4 left-4 right-4">
        <Skeleton className="w-full h-12 rounded-lg" />
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <Skeleton className="w-full h-32 rounded-lg" />
      </div>
    </div>
  );
}

export function FeatureSkeleton() {
  return (
    <div className="text-center p-6">
      <Skeleton variant="circular" className="w-16 h-16 mx-auto mb-4" />
      <Skeleton className="w-32 h-6 mx-auto mb-2" />
      <Skeleton variant="text" lines={3} className="mx-auto" />
    </div>
  );
}