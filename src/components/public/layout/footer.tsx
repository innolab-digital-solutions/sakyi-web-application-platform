import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
          <footer className="relative overflow-hidden bg-slate-50 py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
            <div className="absolute bottom-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
          </div>
  
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-4">
              {/* Brand Column */}
              <div className="lg:col-span-1" data-aos="fade-up" data-aos-duration="1000">
                <Link href="/" className="group mb-6 flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src="/images/logo-thin.png"
                      alt="SaKyi Logo"
                      width={48}
                      height={48}
                      className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#35bec5]/20 to-[#0c96c4]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                  <span
                    className="bg-gradient-to-r from-slate-900 to-[#35bec5] bg-clip-text text-2xl font-bold text-transparent transition-all duration-300 group-hover:from-[#35bec5] group-hover:to-[#0c96c4]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    SaKyi
                  </span>
                </Link>
  
                <p
                  className="mb-6 text-base leading-relaxed text-slate-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Transforming lives through personalized wellness programs designed by certified
                  doctors and wellness experts. Your journey to optimal health starts here.
                </p>
  
                {/* Social Icons */}
                <div className="flex space-x-3">
                  <Link
                    href="#"
                    className="group rounded-full border border-slate-300 bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#35bec5] hover:bg-[#35bec5] hover:shadow-md"
                  >
                    <Facebook className="h-4 w-4 text-slate-600 transition-colors group-hover:text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="group rounded-full border border-slate-300 bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#35bec5] hover:bg-[#35bec5] hover:shadow-md"
                  >
                    <Instagram className="h-4 w-4 text-slate-600 transition-colors group-hover:text-white" />
                  </Link>
                  <Link
                    href="#"
                    className="group rounded-full border border-slate-300 bg-white p-3 shadow-sm transition-all duration-300 hover:border-[#35bec5] hover:bg-[#35bec5] hover:shadow-md"
                  >
                    <Linkedin className="h-4 w-4 text-slate-600 transition-colors group-hover:text-white" />
                  </Link>
                </div>
              </div>
  
              {/* Quick Links */}
              <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                <h3
                  className="mb-6 text-lg font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Quick Links
                </h3>
                <div className="space-y-3">
                  {[
                    { href: "#home", label: "Home" },
                    { href: "#about", label: "About Us" },
                    { href: "#programs", label: "Programs" },
                    { href: "#testimonials", label: "Success Stories" },
                    { href: "#blog", label: "Insights" },
                    { href: "#contact", label: "Contact" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group block text-slate-600 transition-colors duration-300 hover:text-[#35bec5]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-[#35bec5] to-[#0c96c4] transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Programs */}
              <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                <h3
                  className="mb-6 text-lg font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Our Programs
                </h3>
                <div className="space-y-3">
                  {[
                    "Mind Wellness",
                    "Weight Management",
                    "Healthy Aging",
                    "Productivity & Lifestyle",
                    "Stress Management",
                    "Nutrition Guidance",
                  ].map((program) => (
                    <Link
                      key={program}
                      href="#programs"
                      className="group block text-slate-600 transition-colors duration-300 hover:text-[#35bec5]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <span className="relative">
                        {program}
                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-[#35bec5] to-[#0c96c4] transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
  
              {/* Contact Info */}
              <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                <h3
                  className="mb-6 text-lg font-bold text-slate-900"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Get in Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                      <span className="text-xs text-white">📍</span>
                    </div>
                    <div>
                      <p
                        className="mb-1 text-sm font-semibold text-slate-900"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Location
                      </p>
                      <p
                        className="text-sm text-slate-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Yangon, Myanmar
                      </p>
                    </div>
                  </div>
  
                  <div className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#0c96c4] to-[#35bec5]">
                      <span className="text-xs text-white">📧</span>
                    </div>
                    <div>
                      <p
                        className="mb-1 text-sm font-semibold text-slate-900"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Email
                      </p>
                      <p
                        className="text-sm text-slate-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        hello@sakyiwellness.com
                      </p>
                    </div>
                  </div>
  
                  <div className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]">
                      <span className="text-xs text-white">☎️</span>
                    </div>
                    <div>
                      <p
                        className="mb-1 text-sm font-semibold text-slate-900"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Phone
                      </p>
                      <p
                        className="text-sm text-slate-600"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        +95 (example placeholder)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Bottom Section */}
            <div
              className="mt-12 border-t border-slate-200 pt-8"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <div className="flex flex-col items-center justify-between space-y-4 lg:flex-row lg:space-y-0">
                <p className="text-sm text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
                  © 2025 SaKyi Health & Wellness. All rights reserved.
                </p>
  
                <div className="flex items-center space-x-6">
                  <Link
                    href="#"
                    className="text-sm text-slate-600 transition-colors hover:text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-slate-600 transition-colors hover:text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-slate-600 transition-colors hover:text-[#35bec5]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
  );
}   