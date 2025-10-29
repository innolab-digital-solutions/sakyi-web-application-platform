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
          name: (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="bg-muted/60 h-4 w-32 animate-pulse rounded" />
                <Skeleton className="bg-muted/60 h-5 w-20 animate-pulse rounded-full" />
              </div>
              <Skeleton className="bg-muted/40 h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="bg-muted/60 h-8 w-16 animate-pulse rounded" />
              <Skeleton className="bg-muted/60 h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No onboarding forms found. Create your first onboarding form to get started."
    />
  );
}
