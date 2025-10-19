import { ClipboardList } from "lucide-react";
import type { Metadata } from "next";

import ProgramTable from "@/components/admin/features/programs/program-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Program Management | SaKyi Health & Wellness",
  description:
    "Manage wellness programs including fitness routines, nutrition plans, and health challenges.",
};

export default function ProgramsListPage() {
  return (
    <ResourceListPage
      icon={ClipboardList}
      title="Program Management"
      description="Manage all your organization’s health, wellness, coaching, and guardianship programs here. Organize, update, and present services to better serve your clients’ needs."
      table={<ProgramTable />}
    />
  );
}
