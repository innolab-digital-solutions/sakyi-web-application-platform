import { FolderKanban } from "lucide-react";
import type { Metadata } from "next";

import WorkoutCategoryForm from "@/components/admin/features/workout-categories/workout-category-form";
import WorkoutCategoryTable from "@/components/admin/features/workout-categories/workout-category-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Workout Categories | SaKyi Health & Wellness",
  description:
    "Manage and structure workout categories to organize exercises and training programs efficiently.",
};

export default function WorkoutCategoriesListPage() {
  return (
    <ResourceListPage
      icon={FolderKanban}
      title="Workout Categories"
      description="Manage and structure your workout categories. Organize parent and child categories to streamline how workouts are grouped, making it easier to find and maintain your workout library."
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
