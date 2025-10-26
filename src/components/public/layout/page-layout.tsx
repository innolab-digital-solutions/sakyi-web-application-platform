"use client";

import "aos/dist/aos.css";

import AOS from "aos";
import { useEffect } from "react";
import React from "react";

import Footer from "@/components/public/layout/footer";
import Navbar from "@/components/public/layout/navbar";
import QueryProvider from "@/components/shared/query-provider";

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
            <Navbar />
            {children}
            <Footer />
        </QueryProvider>
    )
}