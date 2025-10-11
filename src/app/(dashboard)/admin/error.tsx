"use client";

import { Home, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  // Determine error type
  const errorMessage = error.message || "";
  const statusCode = error.statusCode || 500;

  const is403 = statusCode === 403 || errorMessage.toLowerCase().includes("permission");
  const is404 = statusCode === 404 || errorMessage.toLowerCase().includes("not found");
  const is503 =
    statusCode === 503 ||
    errorMessage.toLowerCase().includes("service unavailable") ||
    errorMessage.toLowerCase().includes("maintenance");

  // Configure error display
  let errorType = "500";
  let imageSource = "/images/500.png";
  let title = "Internal Server Error";
  let description =
    "We encountered an unexpected error while processing your request. Our team has been notified and is working to resolve the issue.";
  let suggestion = "Please try again in a few moments.";

  if (is403) {
    errorType = "403";
    imageSource = "/images/403.png";
    title = "Access Denied";
    description = errorMessage || "You don't have permission to access this resource.";
    suggestion = "If you believe this is a mistake, please contact your administrator for access.";
  } else if (is404) {
    errorType = "404";
    imageSource = "/images/404.png";
    title = "Resource Not Found";
    description = "The resource you're looking for doesn't exist or has been removed.";
    suggestion = "Please check the URL or return to the dashboard.";
  } else if (is503) {
    errorType = "503";
    imageSource = "/images/503.png";
    title = "Service Temporarily Unavailable";
    description = "The service is currently undergoing maintenance or experiencing high traffic.";
    suggestion = "We apologize for the inconvenience. Please check back shortly.";
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        {/* Hero Image */}
        <div className="mb-12 flex justify-center">
          <Image
            src={imageSource}
            alt={`Error ${errorType}`}
            width={400}
            height={300}
            priority
            className="h-auto w-full max-w-md"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Error Badge & Title */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <span className="bg-accent/10 text-accent inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                Error {errorType}
              </span>
            </div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h1>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">{description}</p>
            <p className="text-muted-foreground text-sm">{suggestion}</p>
          </div>

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === "development" && errorMessage && (
            <div className="bg-muted/50 mx-auto max-w-lg rounded-lg border p-4 text-left">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Technical Details
              </p>
              <p className="text-foreground font-mono text-xs break-words">{errorMessage}</p>
              {error.digest && (
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Error ID (Production Only) */}
          {process.env.NODE_ENV === "production" && error.digest && (
            <p className="text-muted-foreground font-mono text-sm">Error ID: {error.digest}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Button onClick={() => reset()} size="lg" className="min-w-[140px]">
              <RefreshCw className="mr-2 size-4" />
              Try Again
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[140px]">
              <Link href="/admin/overview">
                <Home className="mr-2 size-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
