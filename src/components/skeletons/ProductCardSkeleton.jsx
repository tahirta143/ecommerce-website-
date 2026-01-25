export function ProductCardSkeleton() {
    return (
        <div className="product-card bg-card rounded-3xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5">
            {/* Image Container Skeleton */}
            <div className="relative aspect-[4/5] bg-muted animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
            </div>

            {/* Content Skeleton */}
            <div className="p-3 md:p-5 space-y-3">
                {/* Title */}
                <div className="h-6 bg-muted/50 rounded-md w-3/4 animate-pulse" />

                {/* Category */}
                <div className="h-4 bg-muted/30 rounded-md w-1/3 animate-pulse" />

                {/* Price and Rating */}
                <div className="flex items-center justify-between pt-2">
                    <div className="h-6 bg-muted/40 rounded-md w-1/4 animate-pulse" />
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="size-3 bg-muted/30 rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
