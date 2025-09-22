import { cn } from "@/utils/shared/cn";

function Skeleton({ className, ...properties }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...properties}
    />
  );
}

export { Skeleton };
