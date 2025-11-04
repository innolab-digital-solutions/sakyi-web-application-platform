import { cn } from "@/utils/shared/cn";

function Skeleton({ className, ...properties }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-gray-100", className)}
      {...properties}
    />
  );
}

export { Skeleton };
