import { FolderKanban, Plus } from "lucide-react";
import React from "react";

import WorkoutCategoryForm from "@/components/admin/features/workout-categories/workout-category-form";
import WorkoutCategoryTable from "@/components/admin/features/workout-categories/workout-category-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function WorkoutCategoriesListPage() {
  return (
    <>
      <PageHeader
        icon={FolderKanban}
        title="Workout Categories"
        description="Manage and structure your workout categories. Organize parent and child categories to streamline how workouts are grouped, making it easier to find and maintain your workout library."
        actions={
          <>
            <WorkoutCategoryForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex cursor-pointer items-center font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Workout Category</span>
                </Button>
              }
            />
          </>
        }
      />

      <WorkoutCategoryTable />
    </>
  );
}
