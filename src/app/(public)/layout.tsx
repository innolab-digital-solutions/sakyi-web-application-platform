import React from "react";

import PageLayout from "@/components/public/layout/page-layout";
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout>
      {children}
      <Toaster position="top-right" richColors />
    </PageLayout>
  );
}
