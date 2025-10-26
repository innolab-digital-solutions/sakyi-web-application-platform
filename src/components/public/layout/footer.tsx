import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-50 py-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-24 h-48 w-48 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center text-center">
          {/* Brand Section */}
          <div className="mb-8" data-aos="fade-up" data-aos-duration="1000">
            <Link href="/" className="group mb-6 flex items-center justify-center space-x-3">
              <div className="relative">
                <Image
                  src="/images/logo-thin.png"
                  alt="SaKyi Logo"
                  width={48}
                  height={48}
                  className="h-12 w-auto"
                />
              </div>
              <span
                className="text-brand-gradient bg-clip-text text-2xl font-bold text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                SaKyi Health & Wellness
              </span>
            </Link>

            <p
              className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Transforming lives through personalized wellness programs designed by certified
              doctors and wellness experts. Your journey to optimal health starts here.
            </p>

            {/* Social Icons */}
            <div className="flex justify-center space-x-3">
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

          {/* Bottom Section */}
          <div
            className="border-t border-slate-200 pt-8"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <p className="text-sm text-slate-600" style={{ fontFamily: "Inter, sans-serif" }}>
              © 2025 SaKyi Health & Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}   