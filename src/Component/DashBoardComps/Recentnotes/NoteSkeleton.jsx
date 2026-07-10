import { memo } from "react";
import { CircleNotch } from "@phosphor-icons/react";

const NoteSkeleton = memo(({ isGridView }) => {
    return (
        <div className={`relative flex flex-col gap-4 p-5 bg-card border border-border rounded-xl overflow-hidden animate-pulse ${isGridView ? 'h-48' : 'h-36'}`}>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent animate-[shimmer_1.5s_infinite]" />

            <div className="flex justify-between items-center w-full">
                <div className="flex gap-2">
                    <div className="h-6 w-20 bg-muted rounded-full" />
                    <div className="h-6 w-24 bg-[#8b5cf6]/20 rounded-full" />
                </div>
                <div className="h-4 w-12 bg-muted rounded" />
            </div>

            <div className="mt-2 space-y-3">
                <div className="h-7 w-3/4 bg-muted rounded-lg" />
                <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-5/6 bg-muted rounded" />
                    {isGridView && <div className="h-4 w-4/6 bg-muted rounded" />}
                </div>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <CircleNotch className="size-4 text-[#8b5cf6] animate-spin" />
                <span className="text-xs font-medium text-[#8b5cf6]">AI is writing...</span>
            </div>
        </div>
    );
});

NoteSkeleton.displayName = "NoteSkeleton";

export default NoteSkeleton;
