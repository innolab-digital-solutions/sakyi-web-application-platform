import { UserCog } from "lucide-react";
import React from "react";

import StaffAccountTable from "@/components/admin/staff-accounts/staff-account-table";
import PageHeader from "@/components/shared/page-header";

export default function StaffAccountsListPage() {
  return (
    <>
      <PageHeader
        icon={UserCog}
        title="Staff Accounts"
        description="View, manage, and control access for all staff members. Create new accounts, update roles and permissions, and ensure your team has the appropriate access to administrative features."
      />

      <StaffAccountTable />
    </>
  );
}
