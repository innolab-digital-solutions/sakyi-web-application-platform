"use client";

import { Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { ErrorPage } from "@/components/shared/error-page";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public route error:", error);
  }, [error]);

  return (
    <ErrorPage
      code="Error"
      imageSrc="/images/500.png"
      imageAlt="Something went wrong"
      title="Something Went Wrong"
      description="We encountered an unexpected error. Please try again."
      actions={[
        {
          label: "Try Again",
          onClick: reset,
          icon: RefreshCw,
          variant: "default",
        },
        {
          label: "Go Home",
          href: "/",
          icon: Home,
          variant: "outline",
        },
      ]}
      technicalDetails={{
        message: error.message,
        digest: error.digest,
      }}
    />
  );
}
