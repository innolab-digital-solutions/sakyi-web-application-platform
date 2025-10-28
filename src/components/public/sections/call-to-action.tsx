import React from "react";

interface CallToActionProperties {
  title: string;
  description: string;
  actions: React.ReactNode;
}

export default function CallToAction({ title, description, actions }: CallToActionProperties) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#35bec5] to-[#0c96c4] py-24">
    {/* Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
    </div>

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center" data-aos="zoom-in" data-aos-duration="1200" data-aos-easing="ease-out-cubic">
        <h2
          className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "Poppins, sans-serif" }}
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="1000"
          data-aos-easing="ease-out-cubic"
        >
      {title}
        </h2>
        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90"
          style={{ fontFamily: "Inter, sans-serif" }}
          data-aos="slide-up"
          data-aos-delay="400"
          data-aos-duration="1000"
          data-aos-easing="ease-out-cubic"
        >
          {description}
        </p>

        {/* CTA Buttons */}
        <div 
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          data-aos="fade-up"
          data-aos-delay="600"
          data-aos-duration="1000"
          data-aos-easing="ease-out-cubic"
        >
         {actions}
        </div>
      </div>
    </div>
  </section>
  );
}