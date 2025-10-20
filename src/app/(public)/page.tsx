import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "SaKyi Health & Wellness",
  description:
    "Transform your health and wellness journey with SaKyi - your partner in achieving optimal well-being.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button asChild>
        <Link href="/admin/overview">
          Go To Admin
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
