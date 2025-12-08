import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { PATHS } from "@/config/paths";

interface Program {
  title: string;
  description: string;
  slug?: string | undefined;
  readTime?: string;
  image: string;
  href?: string;
}

interface ProgramCardProperties {
  program: Program;
  index?: number;
  className?: string;
}


export default function ProgramCard({ program, index = 0, className = "" }: ProgramCardProperties) {
  console.log("Program in ProgramCard:", program);
  return (
    <div
      className={`group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
      data-aos="fade-up"
      data-aos-delay={`${index * 200}`}
    >
      <div className="flex h-full flex-col gap-6">
        {/* Image - Top (Full Width) */}
        <div className="group/image relative w-full overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={program.image}
            alt={program.title}
            width={600}
            height={400}
            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
            quality={90}
            priority
          />
          {/* Subtle dark overlay that disappears on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-slate-800/10 transition-opacity duration-300 group-hover:opacity-0"></div>
        </div>

        {/* Content - Bottom (Full Width) */}
        <div className="flex w-full flex-col justify-center space-y-4">
          <h3
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {program.title}
          </h3>

          <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
            {program.description}
          </p>

          {/* CTA Link */}
          <div className="pt-2">
            <Link
              href={program.slug ? PATHS.PUBLIC.PROGRAMS_DETAIL(program.slug) : ""}
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