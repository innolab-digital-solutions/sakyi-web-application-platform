import type { Metadata } from "next";

import WorkoutCategoryForm from "@/components/admin/features/workout-categories/workout-category-form";
import WorkoutCategoryTable from "@/components/admin/features/workout-categories/workout-category-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Workout Categories — SaKyi Health & Wellness",
  description:
    "Organize workouts into clear categories to simplify discovery, planning, and reporting.",
};

export default function WorkoutCategoriesListPage() {
  return (
    <ResourceListPage
      title="Workout Categories"
      description="Organize workouts into clear, hierarchical categories to simplify exercise planning, program creation, and workout management. Create parent categories and subcategories for better organization."
      createTrigger={
        <WorkoutCategoryForm
          mode="create"
          trigger={<CreateButton label="Add Workout Category" />}
        />
      }
      table={<WorkoutCategoryTable />}
    />
  );
}
