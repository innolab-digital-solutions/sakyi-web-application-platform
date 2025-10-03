import { ClipboardCheck } from "lucide-react";
import React from "react";

import WorkoutCategoryTable from "@/components/admin/workout-categories/workout-category-table";
import PageHeader from "@/components/shared/page-header";

export default function RolesListPage() {
  return (
    <>
      <PageHeader
        icon={ClipboardCheck}
        title="Workout Categories"
        description="Manage workout categories to organize and categorize workout items."
        actions={<></>}
      />

      <WorkoutCategoryTable />
    </>
  );
}
