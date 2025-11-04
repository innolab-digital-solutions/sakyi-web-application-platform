import React from "react";

import { onboardingFormsTableColumns } from "@/components/admin/features/onboarding-forms/onboarding-form-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { OnboardingForm } from "@/types/admin/onboarding-form";

export default function OnboardingFormTable() {
  return (
    <ResourceTable<OnboardingForm>
      endpoint={ENDPOINTS.ADMIN.ONBOARDING_FORMS.INDEX}
      queryKey={["admin-onboarding-forms"]}
      columns={onboardingFormsTableColumns}
      skeleton={{
        customSkeletons: {
          title: (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-40 animate-pulse rounded" />
                <Skeleton className="h-5 w-20 animate-pulse rounded-full" />
              </div>
              <Skeleton className="h-3 w-80 animate-pulse rounded" />
            </div>
          ),
          published_at: (
            <div className="flex items-center">
              <Skeleton className="h-6 w-28 animate-pulse rounded-full" />
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-8 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No onboarding forms found. Create your first onboarding form to get started."
    />
  );
}
