import { Plus, Scale } from "lucide-react";
import React from "react";

import UnitForm from "@/components/admin/features/units/unit-form";
import UnitTable from "@/components/admin/features/units/unit-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function UnitsListPage() {
  return (
    <>
      <PageHeader
        icon={Scale}
        title="Units"
        description="Manage and standardize measurement units such as grams, kilograms, and liters. Units are used throughout the dashboard to ensure consistency in meals, nutrition tracking, and workout planning."
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
