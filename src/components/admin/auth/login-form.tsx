"use client";

import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import InputField from "@/components/shared/forms/input-field";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { PATHS } from "@/config/paths";
import { useAuth } from "@/context/auth-context";
import { useForm } from "@/hooks/use-form";
import { LoginSchema } from "@/lib/validations/admin/login-schema";
import { ApiError } from "@/types/shared/api";
import { getRedirectUrl } from "@/utils/auth/guards";

export default function LoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const router = useRouter();
  const searchParameters = useSearchParams();
  const { login } = useAuth();

  const form = useForm(
    {
      email: "",
      password: "",
      device_type: "web",
    },
    {
      validate: LoginSchema,
      requireAuth: false,
    },
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Clear any existing errors
    form.clearErrors();

    // Run Zod validation first
    const validationResult = LoginSchema.safeParse(form.data);
    if (!validationResult.success) {
      // Set validation errors
      for (const error of validationResult.error.issues) {
        const path = error.path.join(".") as string;
        form.setError(path, error.message);
      }
      return; // Validation failed
    }

    setIsLoggingIn(true);

    try {
      // Use auth-context login method
      const response = await login(form.data);

      if (response.status === "success") {
        // Success - auth-context already handled token storage and navigation
        // Check for redirect parameter or use default
        const redirectParameter = searchParameters.get("redirect");
        const redirectUrl =
          redirectParameter || getRedirectUrl(redirectParameter || PATHS.ADMIN.OVERVIEW, true);
        router.push(redirectUrl || PATHS.ADMIN.OVERVIEW);
      } else {
        // Handle validation/backend errors
        const errorResponse = response as ApiError;

        // Set backend validation errors on form fields
        if (errorResponse.errors && typeof errorResponse.errors === "object") {
          // Handle field-specific errors
          for (const [field, error] of Object.entries(errorResponse.errors)) {
            if (field !== "system" && typeof error === "string") {
              form.setError(field, error);
            }
          }
        }

        // Handle system errors with smart field assignment
        const errorMessage = errorResponse.errors?.system as string;
        if (errorMessage && errorMessage.length > 0) {
          if (errorMessage.toLowerCase().includes("email")) {
            form.setError("email", errorMessage);
          } else if (errorMessage.toLowerCase().includes("password")) {
            form.setError("password", errorMessage);
          } else if (
            errorMessage.toLowerCase().includes("account") ||
            errorMessage.toLowerCase().includes("inactive")
          ) {
            form.setError("email", errorMessage);
          } else {
            // Default to password field for generic errors
            form.setError("password", errorMessage);
          }
        }
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      form.setError("password", errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Access your admin dashboard to manage health services
        </CardDescription>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <InputField
          id="email"
          name="email"
          type="text"
          value={form.data.email}
          onChange={(event) => form.setData("email", event.target.value)}
          placeholder="admin@sakyihealth.com"
          disabled={isLoggingIn}
          error={form.errors.email}
          label={
            <>
              <Mail className="text-muted-foreground h-4 w-4" />
              Email Address
            </>
          }
        />

        {/* Password Field */}
        <InputField
          id="password"
          name="password"
          type="password"
          value={form.data.password}
          onChange={(event) => form.setData("password", event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isLoggingIn}
          error={form.errors.password}
          label={
            <>
              <Lock className="text-muted-foreground h-4 w-4" />
              Password
            </>
          }
        />

        {/* Sign In Button */}
        <Button
          type="submit"
          className="from-primary to-accent hover:from-primary/90 hover:to-accent/90 group relative flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden bg-gradient-to-r text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
          disabled={isLoggingIn}
        >
          <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/10 to-white/5 transition-transform duration-700 ease-out group-hover:translate-x-[100%]" />
          {isLoggingIn ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="relative">Signing in...</span>
            </>
          ) : (
            <>
              <span className="relative">Sign In</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      <div className="flex items-center justify-center">
        <Button
          variant="link"
          className="text-primary hover:text-primary/80 h-auto cursor-pointer p-0 font-medium"
        >
          Forgot Password?
        </Button>
      </div>
    </div>
  );
}
