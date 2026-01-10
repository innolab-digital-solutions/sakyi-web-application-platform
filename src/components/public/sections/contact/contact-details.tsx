import { Clock, Facebook, Instagram, Mail, MapPin, Music2, Phone, Users, Youtube } from "lucide-react";

export default function ContactDetails() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get personalized assistance from our wellness experts",
      value: "customerservice@sakyihealthandwellness.com",
      href: "mailto:customerservice@sakyihealthandwellness.com",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "For program-related inquiries and client support",
      value: "+959 250357339",
      href: "tel:+959250357339",
    },
   {
    icon: MapPin,
    title: "Online & Remote Care",
    description: "Access our services from anywhere",
    value: "Available worldwide",
    href: undefined,
  },
    {
      icon: Clock,
      title: "Support Hours (Online Service)",
      description: "24/7 support for your wellness journey",
      value: "Mon - Fri: 9AM - 6PM",
      href: undefined,
    },
  ];

  const socialLinks = [
  {
    icon: Instagram,
    name: "Instagram",
    value: "@SaKyiHealth&Wellness",
    href: "https://www.instagram.com/sakyihealthandwellness",
  },
  {
    icon: Facebook,
    name: "Facebook",
    value: "Sa Kyi Health & Wellness",
    href: "https://www.facebook.com/sakyihealthandwellness",
  },
  {
    icon: Youtube,
    name: "YouTube",
    value: "Sa Kyi Health & Wellness",
    href: "https://www.youtube.com/@sakyihealthandwellness",
  },
  {
    icon: "tiktok",
    name: "TikTok",
    value: "@SaKyiHealth&Wellness",
    href: "https://www.tiktok.com/@sakyihealthandwellness",
  },
];

const TikTokIcon = ({ className }: { className?: string }) => (
 <Music2 className={className} />
);



  return (
    <section id="contact-details" className="relative overflow-hidden bg-white py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <Users className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Contact Details
            </span>
          </div>

          <h2
            className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            Our{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Contact Details
            </span>
          </h2>

          <p
            className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Reach our wellness team anytime through our official online channels. We’re here to support your lifestyle transformation journey.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm !transition-all hover:border-[#35bec5]/50 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={`${index * 200}`}
              data-aos-duration="1000"
            >
              {/* Icon with How It Works style animations */}
              <div className="relative mb-6">
                <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-[#35bec5]/10 to-[#0c96c4]/10 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                  <item.icon className="h-8 w-8 text-[#35bec5] transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3
                  className="text-xl font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.description}
                </p>

                {/* Value */}
                {item.href ? (
                  <a
                    href={item.href}
                    className="inline-block text-base font-medium text-[#35bec5] transition-colors duration-300 hover:text-[#0c96c4]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p
                    className="text-base font-medium text-slate-900"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

 <section className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">

        {/* Title */}
        <h2
          className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl"
          style={{ fontFamily: "Poppins, sans-serif" }}
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          Connect with Us on{" "}
          <span className="bg-gradient-to-r from-[#35bec5] to-[#0c96c4] bg-clip-text text-transparent">
            Social Media
          </span>
        </h2>

        {/* Description */}
        <p
          className="mx-auto mb-16 max-w-3xl text-lg text-slate-600"
          style={{ fontFamily: "Inter, sans-serif" }}
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          Follow Sa Kyi for daily wellness tips, lifestyle education, client success stories, and program updates.
        </p>

        {/* Social Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map((item, index) => {
            const Icon =
              item.icon === "tiktok" ? TikTokIcon : item.icon;

            return (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                data-aos="fade-up"
                data-aos-delay={300 + index * 150}
                data-aos-duration="800"
                className="group rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all hover:border-[#35bec5]/50 hover:shadow-lg"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#35bec5]/10 to-[#0c96c4]/10 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-8 w-8 text-[#35bec5]" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {item.value}
                </p>
              </a>
            );
          })}
        </div>

      </div>
    </section>

      </div>
    </section>
  );
}
