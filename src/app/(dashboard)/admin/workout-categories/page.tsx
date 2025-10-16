import { FolderKanban, Plus } from "lucide-react";
import type { Metadata } from "next";

import WorkoutCategoryForm from "@/components/admin/features/workout-categories/workout-category-form";
import WorkoutCategoryTable from "@/components/admin/features/workout-categories/workout-category-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Workout Categories | SaKyi Health & Wellness",
  description:
    "Manage and structure workout categories to organize exercises and training programs efficiently.",
};

export default function WorkoutCategoriesListPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={FolderKanban}
        title="Workout Categories"
        description="Manage and structure your workout categories. Organize parent and child categories to streamline how workouts are grouped, making it easier to find and maintain your workout library."
        actions={
          <WorkoutCategoryForm
            mode="create"
            trigger={
              <Button variant="default" className="flex cursor-pointer items-center font-semibold">
                <Plus className="h-4 w-4" />
                <span>Add Workout Category</span>
              </Button>
            }
          />
        }
      />

      <WorkoutCategoryTable />
    </div>
  );
}
