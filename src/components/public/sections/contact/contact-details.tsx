import { Clock, Mail, MapPin, Phone, Users } from "lucide-react";

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
      title: "Phone Consultation",
      description: "Speak directly with our certified doctors",
      value: "09250357339",
      href: "tel:09250357339",
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
      title: "Available Hours",
      description: "24/7 support for your wellness journey",
      value: "Mon - Fri: 9AM - 6PM",
      href: undefined,
    },
  ];

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
            Connect with our wellness experts through multiple channels. Whether you prefer 
            email, phone, or visiting our center, we&apos;re here to support your health journey.
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
      </div>
    </section>
  );
}
