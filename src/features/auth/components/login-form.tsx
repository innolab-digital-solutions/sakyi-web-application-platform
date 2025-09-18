"use client";

import { Eye, Mail, Lock, ArrowRight, EyeClosed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardDescription, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { useForm } from "@/hooks/use-form";
import { LoginSchema } from "../validations/login-schema";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN } from "@/config/routes";
import { ApiError } from "@/types/api";
import { useAuth } from "@/context/auth-context";
import { getRedirectUrl } from "@/lib/auth-utils";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const form = useForm({
        email: '',
        password: '',
        device_type: 'web',
    }, {
        validate: LoginSchema,
        requireAuth: false,
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Clear any existing errors
        form.clearErrors();

        // Run Zod validation first
        const validationResult = LoginSchema.safeParse(form.data);
        if (!validationResult.success) {
            // Set validation errors
            validationResult.error.issues.forEach((err) => {
                const path = err.path.join(".") as string;
                form.setError(path, err.message);
            });
            return; // Validation failed
        }

        setIsLoggingIn(true);

        try {
            // Use auth-context login method
            const response = await login(form.data);

            if (response.status === "success") {
                // Success - auth-context already handled token storage and navigation
                // Check for redirect parameter or use default
                const redirectParam = searchParams.get('redirect');
                const redirectUrl = redirectParam || getRedirectUrl(redirectParam || ADMIN.OVERVIEW);
                router.push(redirectUrl);
            } else {
                // Handle validation/backend errors
                const errorResponse = response as ApiError;

                // Set backend validation errors on form fields
                if (errorResponse.errors && typeof errorResponse.errors === 'object') {
                    // Handle field-specific errors
                    Object.entries(errorResponse.errors).forEach(([field, error]) => {
                        if (field !== 'system' && typeof error === 'string') {
                            form.setError(field, error);
                        }
                    });
                }

                // Handle system errors with smart field assignment
                const errorMessage = errorResponse.errors?.system as string;
                if (errorMessage) {
                    if (errorMessage.toLowerCase().includes('email')) {
                        form.setError('email', errorMessage);
                    } else if (errorMessage.toLowerCase().includes('password')) {
                        form.setError('password', errorMessage);
                    } else if (errorMessage.toLowerCase().includes('account') || errorMessage.toLowerCase().includes('inactive')) {
                        form.setError('email', errorMessage);
                    } else {
                        // Default to password field for generic errors
                        form.setError('password', errorMessage);
                    }
                }
            }
        } catch (error) {
            // Handle unexpected errors
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            form.setError('password', errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Access your admin dashboard to manage health services
                </CardDescription>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-3">
                {/* Email Field */}
                <div className="space-y-2.5">
                    <Label htmlFor="email">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email Address
                    </Label>

                    <Input
                        id="email"
                        name="text"
                        value={form.data.email}
                        type="text"
                        placeholder="admin@sakyihealth.com"
                        onChange={(e) => form.setData('email', e.target.value)}
                        disabled={isLoggingIn}
                    />

                    <div className="overflow-hidden transition-all duration-300 ease-out">
                        {form.errors.email ? (
                            <p className="text-red-600 text-sm font-medium animate-in slide-in-from-top-1 duration-300 ease-out">
                                {form.errors.email}
                            </p>
                        ) : (
                            <div className="animate-out slide-out-to-top-1 duration-300 ease-out" />
                        )}
                    </div>

                </div>


                {/* Password Field */}
                <div className="space-y-2.5">
                    <Label htmlFor="password">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        Password
                    </Label>

                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="pr-10"
                            disabled={isLoggingIn}
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={togglePasswordVisibility}
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeClosed className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                            </span>
                        </Button>
                    </div>

                    <div className="overflow-hidden transition-all duration-300 ease-out">
                        {form.errors.password ? (
                            <p className="text-red-600 text-sm font-medium animate-in slide-in-from-top-1 duration-300 ease-out">
                                {form.errors.password}
                            </p>
                        ) : (
                            <div className="animate-out slide-out-to-top-1 duration-300 ease-out" />
                        )}
                    </div>

                </div>

                {/* Sign In Button */}
                <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center text-sm gap-2 relative overflow-hidden cursor-pointer"
                    disabled={isLoggingIn}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    {isLoggingIn ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="relative">Signing in...</span>
                        </>
                    ) : (
                        <>
                            <span className="relative">Sign In</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 relative" />
                        </>
                    )}
                </Button>
            </form>

            <div className="flex items-center justify-center ">
                <Button variant='link' className="p-0 h-auto text-primary hover:text-primary/80 font-medium cursor-pointer">Forgot Password?</Button>
            </div>
        </div>
    )
}