import type { Metadata } from "next";
import Image from "next/image";

import LoginForm from "@/components/admin/auth/login-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin Login | SaKyi Health & Wellness",
  description: "Access your admin dashboard to manage health services and wellness programs.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Card className="overflow-hidden rounded-lg border-0 bg-white/95 p-0 shadow-lg backdrop-blur-xl">
          <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-2">
            {/* Login Form Logo and Title Section (Left Side) */}
            <div className="from-primary/90 via-primary to-accent/90 relative hidden flex-col items-center justify-center overflow-hidden bg-linear-to-br p-8 text-white lg:flex lg:p-12">
              <div className="relative z-10 space-y-10 text-center">
                <div className="flex justify-center">
                  <div className="h-20 w-20 rounded-xl bg-white/25 p-3 shadow-xl ring-1 ring-white/20 backdrop-blur-sm">
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-white shadow-inner">
                      <Image
                        src="/images/logo.png"
                        alt="SaKyi Health & Wellness Logo"
                        width={28}
                        height={28}
                        className="rounded-md object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h1 className="text-xl leading-tight font-bold tracking-tight text-white lg:text-3xl">
                      SaKyi Health & Wellness
                    </h1>
                    <div className="mx-auto h-0.5 w-16 rounded-full bg-white/50"></div>
                    <p className="text-lg font-medium tracking-wide text-white">
                      Administrative Portal
                    </p>
                  </div>

                  <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/75">
                    Empowering healthcare professionals with advanced tools for patient care and
                    operational efficiency
                  </p>
                </div>
              </div>
            </div>

            {/* Login Form Input Section (Right Side) */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <LoginForm />
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform">
        <p className="text-center text-xs text-gray-500">
          © 2025 SaKyi Health & Wellness. All rights reserved.
        </p>
      </div>
    </main>
  );
}
