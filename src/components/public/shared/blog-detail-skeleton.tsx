import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden bg-slate-50 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Title Skeleton */}
          <div className="mb-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-5/6" />
          </div>

          {/* Description Skeleton */}
          <div className="mb-8 space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
          </div>

          {/* Meta Information Skeleton */}
          <div className="mb-8 flex flex-wrap items-center gap-6">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Featured Image Skeleton */}
          <div className="relative overflow-hidden rounded-2xl">
            <Skeleton className="aspect-[16/9] w-full" />
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="relative overflow-hidden bg-white py-16">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <div className="pt-4">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#35bec5] to-[#0c96c4] py-16">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Skeleton className="mx-auto mb-4 h-10 w-96" />
            <Skeleton className="mx-auto mb-8 h-6 w-80" />
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Skeleton className="h-12 w-48 rounded-full" />
              <Skeleton className="h-12 w-48 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

