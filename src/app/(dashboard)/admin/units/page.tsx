import { Scale } from "lucide-react";
import type { Metadata } from "next";

import UnitForm from "@/components/admin/features/units/unit-form";
import UnitTable from "@/components/admin/features/units/unit-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Units | SaKyi Health & Wellness",
  description:
    "Manage and standardize measurement units such as grams, kilograms, and liters for consistent nutrition tracking.",
};

export default function UnitsListPage() {
  return (
    <ResourceListPage
      icon={Scale}
      title="Units"
      description="Manage and standardize measurement units such as grams, kilograms, and liters. Units are used throughout the dashboard to ensure consistency in meals, nutrition tracking, and workout planning."
      createTrigger={<UnitForm mode="create" trigger={<CreateButton label="Add Unit" />} />}
      table={<UnitTable />}
    />
  );
}
