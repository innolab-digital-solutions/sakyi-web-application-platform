"use client";

import { Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { ErrorPage } from "@/components/shared/error-page";
import { PATHS } from "@/config/paths";

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
  let errorCode = "Error 500";
  let imageSource = "/images/500.png";
  let title = "Internal Server Error";
  let description =
    "We encountered an unexpected error while processing your request. Our team has been notified and is working to resolve the issue.";
  let suggestion = "Please try again in a few moments.";

  if (is403) {
    errorCode = "Error 403";
    imageSource = "/images/403.png";
    title = "Access Denied";
    description = errorMessage || "You don't have permission to access this resource.";
    suggestion = "If you believe this is a mistake, please contact your administrator for access.";
  } else if (is404) {
    errorCode = "Error 404";
    imageSource = "/images/404.png";
    title = "Resource Not Found";
    description = "The resource you're looking for doesn't exist or has been removed.";
    suggestion = "Please check the URL or return to the dashboard.";
  } else if (is503) {
    errorCode = "Error 503";
    imageSource = "/images/503.png";
    title = "Service Temporarily Unavailable";
    description = "The service is currently undergoing maintenance or experiencing high traffic.";
    suggestion = "We apologize for the inconvenience. Please check back shortly.";
  }

  return (
    <ErrorPage
      code={errorCode}
      imageSrc={imageSource}
      imageAlt={title}
      title={title}
      description={description}
      suggestion={suggestion}
      actions={[
        {
          label: "Try Again",
          onClick: reset,
          icon: RefreshCw,
          variant: "default",
        },
        {
          label: "Dashboard",
          href: PATHS.ADMIN.OVERVIEW,
          icon: Home,
          variant: "outline",
        },
      ]}
      technicalDetails={{
        message: errorMessage,
        digest: error.digest,
      }}
    />
  );
}
