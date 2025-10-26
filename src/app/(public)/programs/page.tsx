import ProgramsCTA from "@/components/public/sections/programs/programs-cta";
import ProgramsExplore from "@/components/public/sections/programs/programs-explore";
import ProgramsFAQ from "@/components/public/sections/programs/programs-faq";
import ProgramsHero from "@/components/public/sections/programs/programs-hero";
import ProgramsHowItWorks from "@/components/public/sections/programs/programs-how-it-works";
import ProgramsPersonalized from "@/components/public/sections/programs/programs-personalized";
import ProgramsWhyChoose from "@/components/public/sections/programs/programs-why-choose";

export default function ProgramsPage() {
  return (
    <>
      <ProgramsHero />

      <ProgramsExplore />

      <ProgramsPersonalized />

      <ProgramsWhyChoose />

      <ProgramsHowItWorks />

      <ProgramsFAQ />

      <ProgramsCTA />
    </>
  );
}
