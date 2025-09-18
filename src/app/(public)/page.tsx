import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return <>
    <div className="min-h-screen flex items-center justify-center">
      <Button asChild>
        <Link href="/admin/overview">
          Go To Admin
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  </>;
}
