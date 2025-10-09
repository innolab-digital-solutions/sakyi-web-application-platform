import { ClipboardCheck, Plus } from "lucide-react";
import React from "react";

import UnitForm from "@/components/admin/units/unit-form";
import UnitTable from "@/components/admin/units/unit-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function UnitsListPage() {
  return (
    <>
      <PageHeader
        icon={ClipboardCheck}
        title="Units of Measurement"
        description="Manage standard units like grams, kilograms, and liters used across meals, nutrition, and workouts."
        actions={
          <>
            <UnitForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex h-10 w-full cursor-pointer items-center gap-2 text-sm font-medium sm:w-auto"
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
