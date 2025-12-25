import type { Metadata } from "next";

import UnitForm from "@/components/admin/features/units/unit-form";
import UnitTable from "@/components/admin/features/units/unit-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Units — SaKyi Health & Wellness",
  description:
    "Standardize measurement units used across nutrition, workouts, and programs for consistent data entry.",
};

export default function UnitsListPage() {
  return (
    <ResourceListPage
      title="Measurement Units"
      description="Manage measurement units used across nutrition tracking, workout plans, and program data. Standardize units like kilograms, grams, liters, and more to ensure consistent data entry and reporting."
      createTrigger={<UnitForm mode="create" trigger={<CreateButton label="Add Unit" />} />}
      table={<UnitTable />}
    />
  );
}
