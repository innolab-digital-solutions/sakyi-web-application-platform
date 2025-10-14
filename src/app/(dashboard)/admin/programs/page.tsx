import { ClipboardList, Plus } from "lucide-react";
import React from "react";

import ProgramTable from "@/components/admin/features/programs/program-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function WorkoutCategoriesListPage() {
  return (
    <>
      <PageHeader
        icon={ClipboardList}
        title="Program Management"
        description="Manage all your organization’s health, wellness, coaching, and guardianship programs here. Organize, update, and present services to better serve your clients’ needs."
        actions={
          <>
            <Button variant="default" className="flex cursor-pointer items-center font-semibold">
              <Plus className="h-4 w-4" />
              <span>Add Program</span>
            </Button>
          </>
        }
      />

      <ProgramTable />
    </>
  );
}
