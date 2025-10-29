"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";

import SortableHeader from "@/components/shared/table/sortable-header";
import { OnboardingForm } from "@/types/admin/onboarding-form";

export const onboardingFormsTableColumns: ColumnDef<OnboardingForm>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column}>Program</SortableHeader>,
    cell: () => {
      return <div> Hellow Wolrld</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: () => {
      return;
    },
  },
];
