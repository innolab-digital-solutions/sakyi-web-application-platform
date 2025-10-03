import { FolderTree, Plus } from "lucide-react";
import React from "react";

import WorkoutCategoryForm from "@/components/admin/workout-categories/workout-category-form";
import WorkoutCategoryTable from "@/components/admin/workout-categories/workout-category-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function WorkoutCategoriesListPage() {
  return (
    <>
      <PageHeader
        icon={FolderTree}
        title="Workout Categories"
        description="Manage and structure your workout categories. Organize parent and child categories to streamline how workouts are grouped, making it easier to find and maintain your workout library."
        actions={
          <>
            <WorkoutCategoryForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex h-10 w-full cursor-pointer items-center gap-2 text-sm font-medium sm:w-auto"
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
