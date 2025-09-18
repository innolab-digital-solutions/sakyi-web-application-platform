import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import LoginForm from "@/features/auth/components/login-form";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Main Container */}
            <div className="w-full max-w-6xl mx-auto relative z-10">
                <Card className="overflow-hidden rounded-lg p-0 border-0 shadow-lg bg-white/95 backdrop-blur-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                        {/* Left Side - Logo and Branding */}
                        <div className="hidden lg:flex relative bg-gradient-to-br from-primary/90 via-primary to-accent/90 p-8 lg:p-12 flex-col justify-center items-center text-white overflow-hidden">
                            <div className="relative z-10 text-center space-y-10">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 rounded-xl bg-white/25 backdrop-blur-sm p-3 shadow-xl ring-1 ring-white/20">
                                        <div className="w-full h-full rounded-lg bg-white flex items-center justify-center shadow-inner">
                                            <Image
                                                src="/images/logo.jpg"
                                                alt="SaKyi Health & Wellness"
                                                width={56}
                                                height={56}
                                                className="rounded-md object-cover"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h1 className="text-xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
                                            SaKyi Health & Wellness
                                        </h1>
                                        <div className="w-16 h-0.5 bg-white/50 mx-auto rounded-full"></div>
                                        <p className="text-lg font-medium text-white tracking-wide">
                                            Administrative Portal
                                        </p>
                                    </div>


                                    <p className="text-white/75 text-sm max-w-sm mx-auto leading-relaxed">
                                        Empowering healthcare professionals with advanced tools for patient care and operational efficiency
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <LoginForm />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bottom Branding */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <p className="text-gray-500 text-xs text-center">
                    © 2025 SaKyi Health & Wellness. All rights reserved.
                </p>
            </div>
        </main>
    );
}