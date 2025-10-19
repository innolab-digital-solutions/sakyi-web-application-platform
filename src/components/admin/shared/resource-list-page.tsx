import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

import PageHeader from "@/components/admin/shared/page-header";

interface ResourceListPageProperties {
  icon: LucideIcon;
  title: string;
  description: string;
  createTrigger?: ReactNode;
  table: ReactNode;
}

export default function ResourceListPage({
  icon,
  title,
  description,
  createTrigger,
  table,
}: ResourceListPageProperties) {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader icon={icon} title={title} description={description} actions={createTrigger} />
      {table}
    </div>
  );
}
