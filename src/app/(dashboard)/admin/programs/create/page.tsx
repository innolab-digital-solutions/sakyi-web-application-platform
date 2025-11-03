import type { Metadata } from "next";
import React from "react";

import ProgramFormPage from "@/components/admin/features/programs/program-form-page";

export const metadata: Metadata = {
  title: "Create Program",
};

export default function CreateProgramPage() {
  return <ProgramFormPage />;
}
