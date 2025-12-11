import { Skeleton } from "@/components/ui/skeleton";

export default function ProgramDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-slate-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-slate-200 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-slate-200 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Title Skeleton */}
              <div className="space-y-6">
                <Skeleton className="h-16 w-full max-w-2xl" />
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-5/6" />
                  <Skeleton className="h-6 w-4/6" />
                </div>
              </div>

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                {Array.from({length: 4}).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons Skeleton */}
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Skeleton className="h-12 w-full rounded-full sm:w-64" />
                <Skeleton className="h-12 w-full rounded-full sm:w-64" />
              </div>
            </div>

            {/* Right Column - Image Skeleton */}
            <div className="relative">
              <Skeleton className="aspect-4/5 w-full rounded-3xl sm:aspect-3/4" />
            </div>
          </div>
        </div>
      </section>

      {/* Program Details Section Skeleton */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Title */}
          <div className="mb-16">
            <Skeleton className="h-12 w-96" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-6 w-full max-w-4xl" />
              <Skeleton className="h-6 w-5/6 max-w-4xl" />
              <Skeleton className="h-6 w-4/6 max-w-4xl" />
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="mb-16 grid gap-12 lg:grid-cols-2">
            {/* Left Column */}
            <div>
              <Skeleton className="mb-6 h-8 w-48" />
              <div className="space-y-4">
                {Array.from({length: 4}).map((_, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Skeleton className="mt-1 h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 flex-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <Skeleton className="mb-6 h-8 w-48" />
              <div className="space-y-4">
                {Array.from({length: 3}).map((_, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Skeleton className="mt-1 h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Results Section Skeleton */}
      <section className="relative overflow-hidden bg-slate-50 py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <Skeleton className="mx-auto h-12 w-96" />
            <Skeleton className="mx-auto mt-6 h-6 w-full max-w-3xl" />
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {Array.from({length: 5}).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6"
              >
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure Section Skeleton */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <Skeleton className="mx-auto h-12 w-96" />
            <Skeleton className="mx-auto mt-6 h-6 w-full max-w-3xl" />
          </div>

          {/* Structure Cards */}
          <div className="space-y-6 sm:space-y-8">
            {Array.from({length: 4}).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:hidden">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                  </div>
                </div>

                <div className="hidden sm:flex sm:items-start sm:gap-6">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-7 w-48" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section Skeleton */}
      <section className="relative overflow-hidden bg-slate-50 py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <Skeleton className="mx-auto h-12 w-96" />
            <Skeleton className="mx-auto mt-6 h-6 w-full max-w-3xl" />
          </div>

          {/* Stories Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {Array.from({length: 2}).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8"
              >
                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-5 w-4/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section Skeleton */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <Skeleton className="mx-auto h-12 w-96" />
            <Skeleton className="mx-auto mt-6 h-6 w-full max-w-3xl" />
          </div>

          {/* FAQ Cards */}
          <div className="space-y-6">
            {Array.from({length: 4}).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8"
              >
                <Skeleton className="mb-4 h-6 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#35bec5] to-[#0c96c4] py-24">
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <Skeleton className="mx-auto mb-6 h-12 w-96 bg-white/20" />
          <Skeleton className="mx-auto mb-12 h-6 w-full max-w-3xl bg-white/20" />
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Skeleton className="h-14 w-full rounded-full bg-white/20 sm:w-64" />
            <Skeleton className="h-14 w-full rounded-full bg-white/20 sm:w-64" />
          </div>
        </div>
      </section>
    </div>
  );
}