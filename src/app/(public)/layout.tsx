import React from "react";

import PageLayout from "@/components/public/layout/page-layout";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
