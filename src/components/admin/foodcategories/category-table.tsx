"use client";

import DataTable from "@/components/shared/table/data-table";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { FoodCategory } from "@/types/admin/food-category";

import { foodCategoriesTableColumns } from "./category-table-columns";

export default function CategoryTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } =
    useTable<FoodCategory>({
      endpoint: ENDPOINTS.ADMIN.FOOD_CATEGORIES.INDEX,
      queryKey: ["admin-food-categories"],
      defaultSort: { field: "id", direction: "desc" },
    });

  return (
    <DataTable
      columns={foodCategoriesTableColumns}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
      ui={{
        emptyMessage: "No category found. Create your first food category to get started.",
        showColumnVisibility: false,
      }}
    />
  );
}
