"use client";

import "aos/dist/aos.css";

import AOS from "aos";
import { useEffect } from "react";
import React from "react";

import Footer from "@/components/public/layout/footer";
import Navbar from "@/components/public/layout/navbar";

export default function PageLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        AOS.init({
          duration: 1000,
          easing: "ease-in-out",
          once: true,
          offset: 100,
        });
      }, []);
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}