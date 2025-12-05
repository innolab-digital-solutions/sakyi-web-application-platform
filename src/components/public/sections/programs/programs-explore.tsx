"use client";

import { ChevronDown, Grid3X3 } from "lucide-react";
import { useMemo, useRef,useState } from "react";

import ProgramCard from "@/components/public/shared/program-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Program } from "@/types/public/program";

export default function ProgramsExplore() {
  const [showAll, setShowAll] = useState(false);
  const programsSectionReference = useRef<HTMLElement>(null);
  const initialPrograms = 4;

  const { data: programsResponse, loading: programsLoading, isFetching: programsFetching } = useRequest({
    url: ENDPOINTS.PUBLIC.PROGRAMS, 
    queryKey: ["programs"],
    staleTime: 1000 * 60 * 5,
  });

const programs = useMemo(() => {
  if (!programsResponse?.data) return [];
  return (programsResponse.data as Program[]).map((program: Program) => ({
    title: program.title,
    description: program.description,
    image: program.thumbnail,
    slug: program.slug,
    href: `/programs/${program.slug}`,
  }));
}, [programsResponse]);

  const isProgramsLoading = programsLoading || programsFetching;

  const displayedPrograms = showAll ? programs : programs.slice(0, initialPrograms);

  return (
    <section id="programs" ref={programsSectionReference} className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <Grid3X3 className="h-4 w-4 text-[#35bec5]" />
            <span className="text-sm font-medium text-[#35bec5]" style={{ fontFamily: "Inter, sans-serif" }}>
              Our Programs
            </span>
          </div>

          <h2
            className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Explore Our{" "}
            <span className="text-brand-gradient bg-clip-text text-transparent" style={{ fontFamily: "Poppins, sans-serif" }}>
              Programs
            </span>
          </h2>
          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Choose from our comprehensive range of wellness programs, each designed by certified doctors 
            and tailored to help you achieve your specific health and wellness goals.
          </p>
        </div>

           {/* Programs Grid */}
<div className="grid gap-8 lg:grid-cols-2">
  {isProgramsLoading
    ? Array.from({ length: initialPrograms }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 shadow-sm animate-pulse"
        >
          <Skeleton className="h-48 w-full rounded-2xl mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </div>
      ))
    : displayedPrograms.map((program, index) => (
        <ProgramCard key={index} program={program} index={index} />
      ))}
</div>


        {/* Show More / Show Less Button */}
        {programs.length > initialPrograms && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center justify-center rounded-full bg-brand-gradient px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {showAll ? `Show Less` : `Show All ${programs.length} Programs`}
              <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-300 ${showAll && "rotate-180"}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
