import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        {/* Hero Image */}
        <div className="mb-12 flex justify-center">
          <Image
            src="/images/404.png"
            alt="Page not found"
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
                404 Not Found
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-4xl">
              Page Not Found
            </h1>
            <p className="text-md text-muted-foreground mx-auto max-w-2xl font-semibold">
              The page you are looking for could not be found. It may have been removed, renamed, or
              is temporarily unavailable.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="from-primary to-accent hover:from-primary/90 hover:to-accent/90 group relative flex h-10 min-w-[140px] items-center justify-center gap-2 overflow-hidden bg-gradient-to-r text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Link href={PATHS.ADMIN.OVERVIEW}>
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/10 to-white/5 transition-transform duration-700 ease-out group-hover:translate-x-[100%]" />
                <ArrowLeft />
                <span className="relative">Go Back To Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
