import { Plus, Scale } from "lucide-react";
import type { Metadata } from "next";

import UnitForm from "@/components/admin/features/units/unit-form";
import UnitTable from "@/components/admin/features/units/unit-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Units | SaKyi Health & Wellness",
  description:
    "Manage and standardize measurement units such as grams, kilograms, and liters for consistent nutrition tracking.",
};

export default function UnitsListPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={Scale}
        title="Units"
        description="Manage and standardize measurement units such as grams, kilograms, and liters. Units are used throughout the dashboard to ensure consistency in meals, nutrition tracking, and workout planning."
        actions={
          <UnitForm
            mode="create"
            trigger={
              <Button variant="default" className="flex cursor-pointer items-center font-semibold">
                <Plus className="h-4 w-4" />
                <span>Add Unit</span>
              </Button>
            }
          />
        }
      />

      <UnitTable />
    </div>
  );
}
