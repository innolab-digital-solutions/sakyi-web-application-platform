import { FolderTree, Plus } from "lucide-react";
import React from "react";

import UnitForm from "@/components/admin/features/units/unit-form";
import UnitTable from "@/components/admin/features/units/unit-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function UnitsListPage() {
  return (
    <>
      <PageHeader
        icon={FolderTree}
        title="Units of Measurement"
        description="Manage standard units like grams, kilograms, and liters used across meals, nutrition, and workouts."
        actions={
          <>
            <UnitForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex cursor-pointer items-center font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Unit</span>
                </Button>
              }
            />
          </>
        }
      />

      <UnitTable />
    </>
  );
}
