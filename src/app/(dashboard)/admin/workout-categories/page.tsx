import { Dumbbell } from "lucide-react";
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
      icon={Dumbbell}
      title="Workout Categories"
      description="Create parent and child categories to keep your workout library tidy and easy to browse."
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
