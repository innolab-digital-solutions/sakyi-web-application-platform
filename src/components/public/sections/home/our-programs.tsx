import { ArrowRight,Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OurPrograms() {
  const programs = [
    {
      title: "Integrated Diabetes Care Program",
      description:
        "A medically supervised program offering personalized nutrition guidance, medication management, and lifestyle coaching to support effective blood sugar control and improved overall health.",
      image: "/images/program-1.jpg",
    },
    {
      title: "Cardiac Health & Rehab Program",
      description:
        "Comprehensive recovery and prevention plan for individuals with heart disease, featuring monitored exercise sessions, heart-healthy nutrition counseling, and one-on-one support from cardiac specialists.",
      image: "/images/program-2.jpg",
    },
    {
      title: "Mindfulness-Based Stress Reduction Program",
      description:
        "An evidence-based program using mindfulness practices, guided meditation, and counseling to reduce stress, improve sleep, and foster emotional wellbeing.",
      image: "/images/program-3.jpg",
    },
  ];

  return (
       <section id="programs" className="relative overflow-hidden bg-slate-50 py-24">
       {/* Background Elements */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute top-1/3 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
         <div className="absolute bottom-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
       </div>

       <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
         {/* Section Header */}
         <div className="mb-16 text-center" data-aos="fade-up" data-aos-duration="1000">
           <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
             <Award className="h-4 w-4 text-[#35bec5]" />
             <span
               className="text-sm font-medium text-[#35bec5]"
               style={{ fontFamily: "Inter, sans-serif" }}
             >
               Our Programs
             </span>
           </div>

           <h2 className="mb-6 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
             <span className="block text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>
               Transform Your Life with
             </span>
             <span
               className="block text-brand-gradient bg-clip-text text-transparent"
               style={{ fontFamily: "Poppins, sans-serif" }}
             >
               Doctor-Designed Programs
             </span>
           </h2>

           <p
             className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600"
             style={{ fontFamily: "Inter, sans-serif" }}
           >
             Discover our comprehensive range of wellness programs, each carefully crafted by
             certified medical professionals to help you achieve lasting health transformation with
             proven results.
           </p>
         </div>

         {/* Asymmetric Program Cards Layout */}
         <div className="grid gap-8 lg:grid-cols-2">
           {/* Left Column - Single Large Card with Side-by-Side Layout */}
           <div
             className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
             data-aos="fade-up"
             data-aos-delay="200"
           >
             <div className="flex h-full flex-col gap-6">
               {/* Image - Top (Full Width) */}
               <div className="relative w-full overflow-hidden rounded-xl bg-slate-100">
                 <Image
                   src={programs[0].image}
                   alt={programs[0].title}
                   width={600}
                   height={400}
                   className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                   quality={90}
                   priority
                 />
               </div>

               {/* Content - Bottom (Full Width) */}
               <div className="flex w-full flex-col justify-center space-y-4">
                 <h3
                   className="text-xl font-bold text-slate-900"
                   style={{ fontFamily: "Poppins, sans-serif" }}
                 >
                   {programs[0].title}
                 </h3>

                 <p className="text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                   {programs[0].description}
                 </p>

                 {/* CTA Link */}
                 <div className="pt-2">
                   <Link
                     href="#programs"
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

           {/* Right Column - Two Cards with Side-by-Side Layout */}
           <div className="grid gap-6">
             {programs.slice(1).map((program, index) => (
               <div
                 key={index + 1}
                 className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                 data-aos="fade-up"
                 data-aos-delay={`${(index + 1) * 150 + 400}`}
               >
                 <div className="flex h-full flex-col gap-4 lg:flex-row lg:gap-4">
                   {/* Image - Top on mobile, Left on desktop */}
                   <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 lg:w-1/2 lg:h-full">
                     <Image
                       src={program.image}
                       alt={program.title}
                       width={400}
                       height={300}
                       className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                       quality={90}
                     />
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
                       className="text-sm text-slate-600"
                       style={{ fontFamily: "Inter, sans-serif" }}
                     >
                       {program.description}
                     </p>

                     {/* CTA Link */}
                     <div className="pt-2">
                       <Link
                         href="#programs"
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
             ))}
           </div>
         </div>

         {/* Clean CTA */}
         <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="800">
           <Link
             href="#programs"
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