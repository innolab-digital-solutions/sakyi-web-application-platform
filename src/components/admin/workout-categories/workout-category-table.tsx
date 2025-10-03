"use client";

import React from "react";

import DataTable from "@/components/shared/table/data-table";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { WorkoutCategory } from "@/types/admin/workout-category";

import { workoutCategoryTableColumns } from "./workout-category-table-columns";

export default function WorkoutCategoryTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } =
    useTable<WorkoutCategory>({
      endpoint: ENDPOINTS.ADMIN.WORKOUT_CATEGORIES.INDEX,
      queryKey: ["admin-workout-categories"],
      defaultSort: { field: "id", direction: "desc" },
    });

  return (
    <DataTable
      columns={workoutCategoryTableColumns}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
      ui={{
        emptyMessage:
          "No workout categories found. Create your first workout category to get started.",
        showColumnVisibility: false,
      }}
    />
  );
}
