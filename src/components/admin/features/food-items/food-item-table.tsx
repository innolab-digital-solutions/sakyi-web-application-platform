"use client";

import DataTable from "@/components/shared/table/data-table";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { FoodItem } from "@/types/admin/food-item";

import { foodItemsTableColumns } from "./food-item-table-columns";

export default function FoodItemTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } = useTable<FoodItem>({
    endpoint: ENDPOINTS.ADMIN.FOOD_ITEMS.INDEX,
    queryKey: ["admin-food-items"],
    defaultSort: { field: "id", direction: "desc" },
  });

  return (
    <DataTable
      columns={foodItemsTableColumns}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
      ui={{
        emptyMessage: "No food items found. Create your first food item to get started.",
        showColumnVisibility: false,
      }}
    />
  );
}
