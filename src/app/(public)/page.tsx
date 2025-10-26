import AboutPreview from "@/components/public/sections/home/about-preview";
import ArticleInsights from "@/components/public/sections/home/article-insights";
import CallToAction from "@/components/public/sections/home/call-to-action";
import Hero from "@/components/public/sections/home/hero";
import HowItWorks from "@/components/public/sections/home/how-it-works";
import MobileApp from "@/components/public/sections/home/mobile-app";
import OurPrograms from "@/components/public/sections/home/our-programs";
import Testimonials from "@/components/public/sections/home/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />

      <AboutPreview />

      <OurPrograms />

      <HowItWorks />

      <MobileApp />

      <Testimonials />

      <ArticleInsights />

      <CallToAction />
    </>
  );
}
