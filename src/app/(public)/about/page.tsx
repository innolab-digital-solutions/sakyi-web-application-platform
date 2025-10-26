import AboutHero from "@/components/public/sections/about/about-hero";
import JoinCommunity from "@/components/public/sections/about/join-community";
import MeetTheTeam from "@/components/public/sections/about/meet-the-team";
import MissionPhilosophy from "@/components/public/sections/about/mission-philosophy";
import OurApproach from "@/components/public/sections/about/our-approach";
import OurImpact from "@/components/public/sections/about/our-impact";

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <MissionPhilosophy />

      <OurApproach />

      <MeetTheTeam />

      <OurImpact />

      <JoinCommunity />
    </>
  );
}
