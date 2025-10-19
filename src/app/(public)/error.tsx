"use client";

import { Home, RefreshCw } from "lucide-react";

import { ErrorPage } from "@/components/shared/error-page";
import { PATHS } from "@/config/paths";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          label: "Go to Home",
          href: PATHS.PUBLIC.HOME,
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
