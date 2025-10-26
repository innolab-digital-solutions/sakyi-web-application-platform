import { Award, Heart, Users } from "lucide-react";
import Image from "next/image";

export default function MeetTheTeam() {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine & Preventive Care",
      experience: "15+ years",
      image: "/images/team/sarah-chen.jpg",
      bio: "Dr. Chen leads our medical team with over 15 years of experience in preventive medicine and personalized healthcare.",
      achievements: ["Board Certified Internal Medicine", "Harvard Medical School Graduate", "Published 50+ Research Papers"]
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Head of Wellness Programs",
      specialty: "Integrative Medicine & Nutrition",
      experience: "12+ years",
      image: "/images/team/michael-rodriguez.jpg",
      bio: "Dr. Rodriguez specializes in integrative approaches to wellness, combining traditional and modern medicine.",
      achievements: ["Certified Integrative Medicine", "Nutrition Specialist", "Wellness Program Designer"]
    },
    {
      name: "Dr. Emily Watson",
      role: "Mental Health Director",
      specialty: "Psychology & Behavioral Health",
      experience: "10+ years",
      image: "/images/team/emily-watson.jpg",
      bio: "Dr. Watson focuses on the mental health aspects of wellness, ensuring holistic care for all our members.",
      achievements: ["Licensed Clinical Psychologist", "Cognitive Behavioral Therapy Expert", "Mental Health Advocate"]
    },
    {
      name: "Dr. James Park",
      role: "Technology & Innovation Lead",
      specialty: "Digital Health & AI",
      experience: "8+ years",
      image: "/images/team/james-park.jpg",
      bio: "Dr. Park bridges the gap between technology and healthcare, developing innovative solutions for personalized wellness.",
      achievements: ["AI in Healthcare Specialist", "Digital Health Pioneer", "Technology Innovation Award"]
    }
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-6 text-center" data-aos="fade-up">
          <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
            <Users className="h-4 w-4 text-[#35bec5]" />
            <span
              className="text-sm font-medium text-[#35bec5]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Meet the People Behind SaKyi
            </span>
          </div>

          <h2
            className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            The{" "}
            <span
              className="text-brand-gradient bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Expert Team
            </span>{" "}
            Dedicated to Your Wellness
          </h2>

          <p
            className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Our team of certified doctors, wellness experts, and healthcare professionals 
            are united by a shared passion for transforming lives through personalized, 
            compassionate care.
          </p>
        </div>

        {/* Team Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                {/* Experience Badge */}
                <div className="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4] px-2 py-1 text-xs font-semibold text-white">
                  {member.experience}
                </div>
              </div>

              {/* Member Info */}
              <h3
                className="mb-2 text-lg font-bold text-slate-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {member.name}
              </h3>
              
              <p
                className="mb-1 text-sm font-semibold text-[#35bec5]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {member.role}
              </p>
              
              <p
                className="mb-4 text-xs text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {member.specialty}
              </p>

              <p
                className="mb-4 text-sm text-slate-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {member.bio}
              </p>

              {/* Key Achievements */}
              <div className="space-y-2">
                {member.achievements.slice(0, 2).map((achievement, achievementIndex) => (
                  <div
                    key={achievementIndex}
                    className="flex items-center space-x-2 text-xs text-slate-500"
                  >
                    <Award className="h-3 w-3 text-[#35bec5]" />
                    <span style={{ fontFamily: "Inter, sans-serif" }}>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Team Values */}
        <div className="mt-20">
          <h3
            className="mb-12 text-center text-2xl font-bold text-slate-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
            data-aos="fade-up"
          >
            What Unites Our Team
          </h3>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Patient-Centered Care",
                description: "Every decision we make is guided by what's best for our patients' health and wellbeing."
              },
              {
                icon: Award,
                title: "Continuous Learning",
                description: "We stay at the forefront of medical research and wellness innovation to provide the best care."
              },
              {
                icon: Users,
                title: "Collaborative Approach",
                description: "We work together as a unified team to provide comprehensive, integrated wellness solutions."
              }
            ].map((value, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10">
                  <value.icon className="h-8 w-8 text-[#35bec5]" />
                </div>
                <h4
                  className="mb-3 text-lg font-semibold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {value.title}
                </h4>
                <p
                  className="text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
