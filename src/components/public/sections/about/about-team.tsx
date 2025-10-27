import Image from "next/image";

const teamMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Chief Medical Officer",
    specialty: "Internal Medicine & Wellness",
    experience: "15+ years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    bio: "Dr. Johnson leads our medical team with expertise in preventive medicine and holistic health approaches.",
  },
  {
    name: "Dr. Michael Chen",
    role: "Director of Nutrition",
    specialty: "Clinical Nutrition & Lifestyle Medicine",
    experience: "12+ years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    bio: "Dr. Chen specializes in personalized nutrition plans and sustainable lifestyle modifications.",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Head of Mental Wellness",
    specialty: "Psychology & Mindfulness",
    experience: "10+ years",
    image: "https://images.unsplash.com/photo-1594824388852-95c0a0a557d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    bio: "Dr. Rodriguez focuses on mental health integration and stress management techniques.",
  },
  {
    name: "Dr. James Wilson",
    role: "Director of Movement Therapy",
    specialty: "Physical Therapy & Exercise Science",
    experience: "18+ years",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
    bio: "Dr. Wilson develops personalized movement programs for optimal physical health and recovery.",
  },
];

export default function AboutTeam() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center" data-aos="fade-up">
          <h2
            className="text-3xl leading-tight font-bold text-slate-900 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Meet Our{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Expert Team
            </span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Our team of certified healthcare professionals brings together decades of experience 
            in medicine, nutrition, psychology, and wellness to provide you with comprehensive, 
            evidence-based care.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={`${index * 100}`}
            >
              {/* Profile Image */}
              <div className="mb-6 flex justify-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Member Info */}
              <div className="text-center">
                <h3
                  className="mb-2 text-lg font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {member.name}
                </h3>
                <p
                  className="mb-2 text-sm font-semibold text-[#35bec5]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {member.role}
                </p>
                <p
                  className="mb-3 text-sm text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {member.specialty}
                </p>
                <p
                  className="mb-4 text-xs text-slate-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {member.experience} experience
                </p>
                <p
                  className="text-sm text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Team Values */}
        <div className="mt-20 rounded-3xl border border-slate-200 bg-slate-50 p-12">
          <div className="text-center">
            <h3
              className="mb-8 text-2xl font-bold text-slate-900"
              style={{ fontFamily: "Poppins, sans-serif" }}
              data-aos="fade-up"
            >
              Our Team Values
            </h3>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center" data-aos="fade-up" data-aos-delay="200">
                <div
                  className="mb-4 text-4xl font-bold text-[#35bec5]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Excellence
                </div>
                <p
                  className="text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  We maintain the highest standards in everything we do, from patient care to professional development.
                </p>
              </div>
              <div className="text-center" data-aos="fade-up" data-aos-delay="400">
                <div
                  className="mb-4 text-4xl font-bold text-[#35bec5]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Compassion
                </div>
                <p
                  className="text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  We approach every interaction with empathy, understanding, and genuine care for your wellbeing.
                </p>
              </div>
              <div className="text-center" data-aos="fade-up" data-aos-delay="600">
                <div
                  className="mb-4 text-4xl font-bold text-[#35bec5]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Innovation
                </div>
                <p
                  className="text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  We continuously seek new ways to improve care and stay at the forefront of wellness science.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
