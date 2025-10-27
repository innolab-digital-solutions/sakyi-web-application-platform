import AboutApproach from "@/components/public/sections/about/about-approach";
import AboutHero from "@/components/public/sections/about/about-hero";
import AboutImpact from "@/components/public/sections/about/about-impact";
import AboutMission from "@/components/public/sections/about/about-mission";
import AboutTeam from "@/components/public/sections/about/about-team";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMission />
      <AboutApproach />
      <AboutTeam />
      <AboutImpact />
    </>
  );
}
