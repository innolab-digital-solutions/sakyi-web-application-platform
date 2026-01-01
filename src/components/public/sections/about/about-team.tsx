import { Linkedin, Mail, Twitter, Users } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Dr. Swam Htet",
    role: "Technical Director",
    description: `Leads and mentors our interdisciplinary medical team, ensuring a cohesive approach to preventive and integrative health care.
Supervises the creation of evidence-based wellness initiatives, encompassing novel mobility and recovery strategies, and formulates program roadmaps that correspond with contemporary lifestyle medicine methodologies.
<br />
Collaborates with specialists in nutrition, movement therapy, and community engagement to integrate their expertise into cohesive, holistic plans.
<br />
Establishes clinical standards and guidelines, assesses program outcomes, and promotes ongoing enhancement in client care.`,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    socials: {
      linkedin: "https://linkedin.com/in/sarah-johnson",
      twitter: "https://twitter.com/sarahjohnson",
      email: "sarah@sakyi.com"
    }
  },
  {
    name: "Dr. Pyae Sone Aung",
    role: "Assistance lifestyle medical doctor",
    description: `Supports the Technical Director in implementing wellness initiatives and contributes to program development.
<br />
Manages health data and analytics to ensure all programs remain evidence-based and up to date.
<br />
Provides clinical support as needed and liaises with other team members to facilitate program execution.`,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    socials: {
      linkedin: "https://linkedin.com/in/michael-chen",
      email: "michael@sakyi.com"
    }
  },
  {
    name: "Dr. Yune Nadar Hlaing",
    role: "Lifestyle medical doctor",
    description: `Provides client consultations in alignment with the most recent lifestyle medicine principles, guaranteeing superior, individualized care.
<br />
Operates under the supervision of the Technical Director to execute designated wellness strategies and assess client advancement.
Complies with established standard operating procedures and communicates with the wider wellness team to ensure consistency in program implementation.`,
    image: "https://images.unsplash.com/photo-1665779912168-c6d48ec98dcb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29uJTIwaW1hZ2V8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&q=60&w=500",
    socials: {
      linkedin: "https://linkedin.com/in/emily-rodriguez",
      email: "emily@sakyi.com"
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
              Meet Our Team
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
                  {member.socials.twitter && (
                    <a
                      href={member.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 hover:bg-[#35bec5] hover:text-white hover:scale-110"
                    >
                      <Twitter className="h-4 w-4" />
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
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
