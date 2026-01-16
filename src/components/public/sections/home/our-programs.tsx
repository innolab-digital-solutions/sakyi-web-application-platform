"use client";

import { ArrowRight, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { Program } from "@/types/public/program";

// Large Program Card Component (Left Column)
function ProgramCardLarge({ program }: { program: Program }) {
  const hasThumbnail = program.thumbnail && program.thumbnail.trim() !== "";
  const [imageError, setImageError] = useState(false);
  const thumbnailSource = hasThumbnail && !imageError ? program.thumbnail : "/images/no-image.png";

  return (
    <div
      data-aos="flip-up"
      data-aos-delay="400"
      data-aos-duration="1000"
      data-aos-easing="ease-out-cubic"
    >
      <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex h-full flex-col gap-6">
          {/* Image - Top (Full Width) */}
          <div className="group/image relative w-full overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={thumbnailSource}
              alt={program.title}
              width={1200}
              height={800}
              quality={95}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className={`h-auto w-full transition-transform duration-300 group-hover:scale-105 ${
                hasThumbnail && !imageError ? "object-cover" : "object-contain bg-gray-100"
              }`}
              onLoad={() => {
                // Reset error state if image loads successfully
                if (hasThumbnail && imageError) {
                  setImageError(false);
                }
              }}
              onError={() => {
                // Only set error if we actually tried to load the thumbnail
                if (hasThumbnail) {
                  setImageError(true);
                }
              }}
            />
        
            {/* Subtle dark overlay that disappears on hover */}
            {hasThumbnail && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 to-slate-800/5 transition-opacity duration-300 group-hover:opacity-0"></div>
            )}
          </div>

          {/* Content - Bottom (Full Width) */}
          <div className="flex w-full flex-col justify-center space-y-4">
            <h3
              className="text-xl font-bold text-slate-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {program.title}
            </h3>

            <p className="text-slate-600 line-clamp-3" style={{ fontFamily: "Inter, sans-serif" }}>
              {program.overview}
            </p>

            {/* CTA Link */}
            <div className="pt-2">
              <Link
                href={program.slug ? PATHS.PUBLIC.PROGRAMS_DETAIL(program.slug) : "#"}
                className="group/link inline-flex items-center text-sm font-medium text-[#35bec5] transition-all duration-300 hover:text-[#0c96c4]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span>Learn More</span>
                <ArrowRight className="ml-2 h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small Program Card Component (Right Column)
function ProgramCardSmall({ program, index }: { program: Program; index: number }) {
  const hasThumbnail = program.thumbnail && program.thumbnail.trim() !== "";
  const [imageError, setImageError] = useState(false);
  const thumbnailSource = hasThumbnail && !imageError ? program.thumbnail : "/images/no-image.png";

  return (
    <div
      className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
      data-aos="slide-up"
      data-aos-delay={`${index * 150 + 500}`}
      data-aos-duration="1000"
      data-aos-easing="ease-out-cubic"
    >
      <div className="flex h-full flex-col gap-4 lg:flex-row lg:gap-4">
        {/* Image - Top on mobile, Left on desktop */}
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 lg:w-1/2 lg:h-full">
          <Image
            src={thumbnailSource}
            alt={program.title}
            width={400}
            height={300}
            quality={90}
            sizes="(max-width: 768px) 100vw, 200px"
            className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${
              hasThumbnail && !imageError ? "object-cover" : "object-contain bg-gray-100"
            }`}
            onLoad={() => {
              // Reset error state if image loads successfully
              if (hasThumbnail && imageError) {
                setImageError(false);
              }
            }}
            onError={() => {
              // Only set error if we actually tried to load the thumbnail
              if (hasThumbnail) {
                setImageError(true);
              }
            }}
          />
     
          {/* Subtle dark overlay that disappears on hover */}
          {hasThumbnail && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 to-slate-800/5 transition-opacity duration-300 group-hover:opacity-0"></div>
          )}
        </div>

        {/* Content - Bottom on mobile, Right on desktop */}
        <div className="flex w-full flex-col justify-center space-y-3 lg:w-1/2">
          <h3
            className="text-lg font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {program.title}
          </h3>

          <p
            className="text-sm text-slate-600 line-clamp-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {program.overview}
          </p>

          {/* CTA Link */}
          <div className="pt-2">
            <Link
              href={program.slug ? PATHS.PUBLIC.PROGRAMS_DETAIL(program.slug) : "#"}
              className="group/link inline-flex items-center text-sm font-medium text-[#35bec5] transition-all duration-300 hover:text-[#0c96c4]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <span>Learn More</span>
              <ArrowRight className="ml-2 h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OurPrograms() {
  const {
    data: programsResponse,
    loading: programsLoading,
    isFetching: programsFetching,
  } = useRequest({
    url: ENDPOINTS.PUBLIC.HOME_PROGRAMS,
    queryKey: ["home-programs"],
  });

  const programs = (programsResponse?.data as Program[]) ?? [];
  const isProgramsLoading = programsLoading || programsFetching;
  const hasPrograms = programs.length > 0;

  // Hide section if no programs exist (after loading)
  if (!isProgramsLoading && !hasPrograms) {
    return;
  }

  return (
       <section id="programs" className="relative overflow-hidden bg-slate-50 py-24">
       {/* Background Elements */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute top-1/3 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
         <div className="absolute bottom-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
       </div>

       <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
         {/* Section Header */}
         <div className="mb-16 text-center" data-aos="zoom-in" data-aos-duration="1200" data-aos-easing="ease-out-cubic">
           <div 
             className="mb-6 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2"
             data-aos="slide-down"
             data-aos-delay="200"
             data-aos-duration="800"
             data-aos-easing="ease-out-back"
           >
             <Award className="h-4 w-4 text-[#35bec5]" />
             <span
               className="text-sm font-medium text-[#35bec5]"
               style={{ fontFamily: "Inter, sans-serif" }}
             >
               Our Programs
             </span>
           </div>

           <h2 className="mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
             <span 
               className="block text-slate-900" 
               style={{ fontFamily: "Poppins, sans-serif" }}
               data-aos="fade-up"
               data-aos-delay="300"
               data-aos-duration="1000"
               data-aos-easing="ease-out-cubic"
             >
               Transform Your Life with
             </span>
             <span
               className="block text-brand-gradient bg-clip-text text-transparent"
               style={{ fontFamily: "Poppins, sans-serif" }}
               data-aos="fade-up"
               data-aos-delay="500"
               data-aos-duration="1000"
               data-aos-easing="ease-out-cubic"
             >
               Doctor-Designed Programs
             </span>
           </h2>

           <p
             className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600"
             style={{ fontFamily: "Inter, sans-serif" }}
             data-aos="slide-up"
             data-aos-delay="700"
             data-aos-duration="1000"
             data-aos-easing="ease-out-cubic"
           >
             Discover our comprehensive range of wellness programs, each carefully crafted by
             certified medical professionals to help you achieve lasting health transformation with
             proven results.
           </p>
         </div>

         {/* Asymmetric Program Cards Layout */}
         {isProgramsLoading ? (
           <div className="grid gap-8 lg:grid-cols-2">
             {/* Left Column - Single Large Card Skeleton */}
             <div data-aos="flip-up" data-aos-delay="400" data-aos-duration="1000" data-aos-easing="ease-out-cubic">
               <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                 <div className="flex h-full flex-col gap-6">
                   {/* Image Skeleton */}
                   <div className="relative w-full overflow-hidden rounded-xl bg-slate-100">
                     <Skeleton className="aspect-[3/2] w-full" />
                   </div>
                   {/* Content Skeleton */}
                   <div className="flex w-full flex-col justify-center space-y-4">
                     <Skeleton className="h-7 w-3/4" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-5/6" />
                     <div className="pt-2">
                       <Skeleton className="h-5 w-24" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Right Column - Two Cards Skeleton */}
             <div className="grid gap-6">
               {Array.from({ length: 2 }).map((_, index) => (
                 <div
                   key={index}
                   className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                   data-aos="slide-up"
                   data-aos-delay={`${(index + 1) * 150 + 500}`}
                   data-aos-duration="1000"
                   data-aos-easing="ease-out-cubic"
                 >
                   <div className="flex h-full flex-col gap-4 lg:flex-row lg:gap-4">
                     {/* Image Skeleton */}
                     <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 lg:w-1/2 lg:h-full">
                       <Skeleton className="h-full w-full" />
                     </div>
                     {/* Content Skeleton */}
                     <div className="flex w-full flex-col justify-center space-y-3 lg:w-1/2">
                       <Skeleton className="h-6 w-3/4" />
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-5/6" />
                       <div className="pt-2">
                         <Skeleton className="h-5 w-24" />
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         ) : (
           <div className="grid gap-8 lg:grid-cols-2">
             {/* Left Column - Single Large Card with Side-by-Side Layout */}
             {programs[0] && (
               <ProgramCardLarge program={programs[0]} />
             )}

             {/* Right Column - Two Cards with Side-by-Side Layout */}
             <div className="grid gap-6">
               {programs.slice(1).map((program, index) => (
                 <ProgramCardSmall key={program.id} program={program} index={index + 1} />
               ))}
             </div>
           </div>
         )}

         {/* Clean CTA */}
         <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="800">
           <Link
             href="/programs"
             className="group inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
             style={{ fontFamily: "Inter, sans-serif" }}
           >
             <span className="relative z-10">Explore All Programs</span>
             <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
           </Link>
         </div>
       </div>
     </section>
  );
}