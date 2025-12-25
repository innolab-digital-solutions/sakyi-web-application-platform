import React, { ReactNode } from "react";

import PageHeader from "@/components/admin/shared/page-header";

interface ResourceListPageProperties {
  title: string;
  description: string;
  createTrigger?: ReactNode;
  table: ReactNode;
}

export default function ResourceListPage({
  title,
  description,
  createTrigger,
  table,
}: ResourceListPageProperties) {
  return (
    <div className="flex flex-col gap-2 p-6">
      <PageHeader title={title} description={description} actions={createTrigger} />
      {table}
    </div>
  );
}
