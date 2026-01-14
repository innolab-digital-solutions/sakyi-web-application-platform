import { Facebook, Linkedin, Mail, Music2, Users, Youtube } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Dr. Kyaw Htin",
    role: "Founder, Sa Kyi",
    description: `Dr. Kyaw Htin is a Medical Doctor with advanced training in Health Sciences, specializing in health behaviour and behaviour change. His work focuses on understanding why unhealthy habits persist and how sustainable change can truly happen. Through Sa Kyi—meaning “Let’s Start”—he helps people build healthier lifestyles through small, realistic, and achievable behaviour changes designed for real life.
    <br />
    <br />
    <strong>
      <i>
      “Healthy living is not about perfection. It starts with understanding ourselves and taking small, realistic steps that we can sustain.”
      </i>
    </strong>
    `,
    image: "/images/about/profile_2.jpg",
    socials: {
      linkedin: "https://www.linkedin.com/in/kyaw-htin-86b0ba144/",
      email: "michael@sakyi.com"
    }
  },
    {
    name: "Dr. Swam Htet",
    role: "Co-Founder & Technical Director",
    description: `Dr. Swam Htet is a Medical Doctor and lifestyle health specialist with expertise in exercise physiology and evidence-based health optimisation. As Co-Founder and Technical Director of Sa Kyi Health and Wellness, he leads the scientific and technical development of Sa Kyi’s programs, translating research into practical, sustainable strategies that support long-term behaviour change and overall well-being.
    <br />
    
    <br />
    <strong>
      <i>
      “Lasting health is built through consistent habits, guided by science and designed for real life.”
      </i>
    </strong>
    `,
    image: "/images/about/profile_3.jpg",
    socials: {
      linkedin: "www.linkedin.com/in/swam-htet-830b71129",
      email: "drswamhtet@sakyihealthandwellness.com "
    }
  },
  {
    name: "Pho Thit Nwe",
    role: "Co-Founder & Operations Director",
    description: `Pho Thit Nwe is the Co-Founder and Operations Director of Sa Kyi Health and Wellness, with a strong passion for behaviour change and sustainable lifestyle transformation. Drawing from both professional work and personal experience, she also works as a lifestyle vlogger and content creator, sharing real-life journeys that bridge science-based health concepts with everyday living.
    <br />
    <br />
    <strong>
      <i>
        “Real change becomes possible when science meets everyday life—and when we allow ourselves to start, learn, and grow step by step.”
      </i>
    </strong>
    `,
    image: "/images/about/profile_1.jpg",
    socials: {
      facebook: "https://www.facebook.com/share/1CfUg3DzMW/?mibextid=wwXIfr",
      tiktok: "https://www.tiktok.com/@phothitnwe7?_r=1&_t=ZS-92poyHOmwwy",
      youtube: "https://www.youtube.com/@phothitnwe4467",
    }
  }
];

export default function AboutTeam() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2 mb-6">
            <Users className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Meet Our Founder
            </span>
          </div>

          <h2 className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
            <span
              className="block text-slate-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our{" "}
              <span
                className="text-brand-gradient bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Expert Team
              </span>
            </span>
          </h2>

          <p
            className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
     We are pleased to present the professionals who will lead your journey because we know that consumers want to see the faces behind a brand. Our group brings together decades of expertise in wellness, psychology, nutrition, and medicine:
          </p>
        </div>

        {/* Team Grid - Flexible Layout */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              {/* Profile Image */}
              <div className="mb-6 flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-white shadow-xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    quality={90}
                  />
                  {/* Subtle dark overlay that disappears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/10 to-slate-800/5 transition-opacity duration-300 group-hover:opacity-0"></div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3
                    className="text-xl font-bold text-slate-900"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="mt-1 text-sm font-semibold text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {member.role}
                  </p>
                </div>

                <div
                  className="text-sm leading-relaxed text-left text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: member.description }}
                />

                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:scale-110"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.socials.email && (
                    <a
                      href={`mailto:${member.socials.email}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:scale-110"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {
                    member.socials.facebook && (
                      <a 
                      href={member.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:scale-110"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    )
                  }
                  {
                    member.socials.youtube && (
                      <a 
                      href={member.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:scale-110"
                      >
                        <Youtube className="h-4 w-4" />
                      </a>
                    )
                  }
                  {
                    member.socials.tiktok && (
                      <a href={member.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:scale-110"
                      >
                        <Music2 className="h-4 w-4" />

                      </a>
                    )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
