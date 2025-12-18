"use client";

import "aos/dist/aos.css";

import AOS from "aos";
import React, { useEffect } from "react";

import TopLoadingBar from "@/components/admin/layout/top-loading-bar";
import Footer from "@/components/public/layout/footer";
import Navbar from "@/components/public/layout/navbar";
import QueryProvider from "@/components/shared/query-provider";
import { TransitionProvider } from "@/context/transition-context";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out",
      once: true,
      offset: 50,
      delay: 0,
    });
  }, []);

  return (
    <QueryProvider>
      <TransitionProvider defaultTransition="fade">
        <TopLoadingBar />
        <Navbar />
        {children}
        <Footer />
      </TransitionProvider>
    </QueryProvider>
  );
}

