import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <Button asChild>
          <Link href="/admin/overview">
            Go To Admin
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
