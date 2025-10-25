"use client";

import {
Menu,
Smartphone,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, {  useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 50);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <nav
    className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      isScrolled
        ? "border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md"
        : "bg-slate-50/80 backdrop-blur-sm"
    }`}
    id="navbar"
  >
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Clean Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/images/logo-thin.png"
            alt="SaKyi Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span
            className="text-xl font-semibold text-slate-900"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            SaKyi
          </span>
        </Link>

        {/* Clean Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/programs", label: "Programs" },
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
          ].map((item) => {
            const isActive = item.href === "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative text-sm font-medium transition-all duration-300 ${
                  isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
                <span
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r from-[#35bec5]/5 via-[#4bc4db]/5 to-[#0c96c4]/5 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>

        {/* Clean CTA Button */}
        <div className="hidden items-center md:flex">
          <button
            onClick={() => {
              const appSection = document.querySelector("#app");
              if (appSection) {
                appSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Get the App
          </button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Clean Mobile Navigation */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
        isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="border-t border-slate-100 bg-white">
          <div className="space-y-3 px-4 py-4">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/programs", label: "Programs" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
            ].map((item, index) => {
              const isActive = item.href === "/";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                    isActive
                      ? "rounded-lg bg-gradient-to-r from-[#35bec5]/10 via-[#4bc4db]/10 to-[#0c96c4]/10 px-3 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg px-3"
                  }`}
                  style={{ 
                    fontFamily: "Inter, sans-serif",
                    animationDelay: `${index * 50}ms`,
                    animation: isMenuOpen ? "slideInDown 0.3s ease-out forwards" : "none"
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  const appSection = document.querySelector("#app");
                  if (appSection) {
                    appSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Get the App
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  );
}