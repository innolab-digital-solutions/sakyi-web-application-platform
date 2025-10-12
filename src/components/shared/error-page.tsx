import { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ErrorPageAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  variant?: "default" | "outline";
}

interface ErrorPageProperties {
  /**
   * Error code to display in badge (e.g., "403", "404", "500")
   */
  code: string;
  /**
   * Path to error illustration image
   */
  imageSrc: string;
  /**
   * Alt text for the image
   */
  imageAlt: string;
  /**
   * Main error title
   */
  title: string;
  /**
   * Primary description of the error
   */
  description: string;
  /**
   * Optional secondary message or suggestion
   */
  suggestion?: string;
  /**
   * Actions to display (buttons)
   */
  actions: ErrorPageAction[];
  /**
   * Optional technical details (shown only in development)
   */
  technicalDetails?: {
    message?: string;
    digest?: string;
  };
}

/**
 * Shared error page component for 403, 404, 500, and other error states
 * Provides consistent UI across all error scenarios
 */
export function ErrorPage({
  code,
  imageSrc,
  imageAlt,
  title,
  description,
  suggestion,
  actions,
  technicalDetails,
}: ErrorPageProperties) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        {/* Hero Image */}
        <div className="mb-12 flex justify-center">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={400}
            height={300}
            priority
            className="h-auto w-full max-w-md"
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Error Badge & Title */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="bg-accent/10 text-accent border-none px-2 py-1.5 font-semibold"
              >
                {code}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-4xl">{title}</h1>
            <p className="text-md text-muted-foreground mx-auto max-w-2xl font-semibold">
              {description}
            </p>
            {suggestion && (
              <p className="text-muted-foreground mx-auto max-w-2xl text-sm">{suggestion}</p>
            )}
          </div>

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === "development" && technicalDetails?.message && (
            <div className="bg-muted/50 mx-auto max-w-lg rounded-lg border p-4 text-left">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Technical Details
              </p>
              <p className="text-foreground font-mono text-xs break-words">
                {technicalDetails.message}
              </p>
              {technicalDetails.digest && (
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  Digest: {technicalDetails.digest}
                </p>
              )}
            </div>
          )}

          {/* Error ID (Production Only) */}
          {process.env.NODE_ENV === "production" && technicalDetails?.digest && (
            <p className="text-muted-foreground font-mono text-sm">
              Error ID: {technicalDetails.digest}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {actions.map((action, index) => {
              const Icon = action.icon;
              const buttonContent = (
                <>
                  {action.variant === "default" && (
                    <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/10 to-white/5 transition-transform duration-700 ease-out group-hover:translate-x-[100%]" />
                  )}
                  <Icon className={action.variant === "default" ? "size-4" : "mr-2 size-4"} />
                  <span className="relative">{action.label}</span>
                </>
              );

              const buttonClassName =
                action.variant === "default"
                  ? "from-primary to-accent hover:from-primary/90 hover:to-accent/90 group relative flex h-10 min-w-[140px] items-center justify-center gap-2 overflow-hidden bg-gradient-to-r text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  : "";

              if (action.href) {
                return (
                  <Button
                    key={index}
                    asChild
                    variant={action.variant || "default"}
                    className={buttonClassName || "min-w-[140px]"}
                  >
                    <Link href={action.href}>{buttonContent}</Link>
                  </Button>
                );
              }

              return (
                <Button
                  key={index}
                  onClick={action.onClick}
                  variant={action.variant || "default"}
                  className={buttonClassName || "min-w-[140px]"}
                >
                  {buttonContent}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
