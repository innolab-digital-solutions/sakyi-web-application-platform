import type { Metadata } from "next";

import TeamForm from "@/components/admin/features/teams/team-form";
import TeamTable from "@/components/admin/features/teams/team-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Team — SaKyi Health & Wellness",
  description:
    "Manage teams and their members with ease. Create, update, and delete teams as needed.",
};

export default function TeamListPage() {
  return (
    <ResourceListPage
      title="Team Management"
      description="Define and oversee the internal teams that support your clients. Assign members to each team so responsibilities and ownership stay clear."
      createTrigger={<TeamForm mode="create" trigger={<CreateButton label="Add Team" />} />}
      table={<TeamTable />}
    />
  );
}
