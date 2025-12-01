"use client";

import { ArrowRight, Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import InputField from "@/components/shared/forms/input-field";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/config/paths";
import { useAuth } from "@/context/auth-context";
import { useForm } from "@/hooks/use-form";
import { LoginSchema } from "@/lib/validations/admin/login-schema";
import { ApiError } from "@/types/shared/api";
import { getRedirectUrl } from "@/utils/auth/guards";

export default function LoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const router = useRouter();
  const searchParameters = useSearchParams();

  const form = useForm(
    {
      email: "",
      password: "",
    },
    {
      validate: LoginSchema,
    },
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.clearErrors();

    const validationResult = LoginSchema.safeParse(form.data);
    if (!validationResult.success) {
      for (const error of validationResult.error.issues) {
        const path = error.path.join(".") as string;
        form.setError(path, error.message);
      }
      return;
    }

    setIsLoggingIn(true);

    try {
      const response = await login(form.data);

      if (response.status === "success") {
        const redirectParameter = searchParameters.get("redirect");
        const redirectUrl =
          redirectParameter || getRedirectUrl(redirectParameter || PATHS.ADMIN.OVERVIEW, true);
        router.push(redirectUrl || PATHS.ADMIN.OVERVIEW);
      } else {
        const errorResponse = response as ApiError;

        if (errorResponse.errors && typeof errorResponse.errors === "object") {
          for (const [field, error] of Object.entries(errorResponse.errors)) {
            if (field !== "system" && typeof error === "string") {
              form.setError(field, error);
            }
          }
        }

        // Intelligently assign system errors to appropriate form fields
        const errorMessage =
          !errorResponse.errors && errorResponse.message ? errorResponse.message : undefined;

        if (errorMessage && errorMessage.length > 0) {
          form.setError("email", errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      form.setError("password", errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="space-y-3 text-center">
        <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Access your admin dashboard to manage health services
        </CardDescription>
      </div>

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
          className="from-primary to-accent hover:from-primary/90 hover:to-accent/90 group relative flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden bg-linear-to-r text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
          disabled={isLoggingIn}
        >
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/10 to-white/5 transition-transform duration-700 ease-out group-hover:translate-x-full" />
          {isLoggingIn ? (
            <>
              <Spinner />
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
