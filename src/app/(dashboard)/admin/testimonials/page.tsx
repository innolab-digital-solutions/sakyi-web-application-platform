import { ClipboardList } from "lucide-react";
import type { Metadata } from "next";

import TestimonialForm from "@/components/admin/features/testimonials/testimonial-form";
import TestimonialTable from "@/components/admin/features/testimonials/testimonial-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Testimonials — SaKyi Health & Wellness",
  description:
    "Manage client testimonials for SaKyi Health & Wellness—view, add, and update feedback to showcase real user experiences.",
};

export default function TestimonialListPage() {
  return (
    <ResourceListPage
      icon={ClipboardList}
      title="Testimonials"
      description="Manage and organize user testimonials—add, edit, and maintain client feedback to highlight experiences and improve services."
      createTrigger={
        <TestimonialForm mode="create" trigger={<CreateButton label="Add Testimonial" />} />
      }
      table={<TestimonialTable />}
    />
  );
}
