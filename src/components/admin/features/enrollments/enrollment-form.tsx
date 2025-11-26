"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { ComboBoxField } from "@/components/shared/forms/combo-box-field";
import DatepickerField from "@/components/shared/forms/datepicker-field";
import { InputField } from "@/components/shared/forms/input-field";
import { TextareaField } from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateEnrollmentSchema } from "@/lib/validations/admin/enrollment-schema";
import { Enrollment, EnrollmentApiResponse } from "@/types/admin/enrollment";

const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
  if (event.key === "Enter" && event.target instanceof HTMLElement) {
    const isTextarea = event.target.tagName === "TEXTAREA";
    const targetElement = event.target as HTMLElement;
    const isSubmitButton =
      (targetElement instanceof HTMLButtonElement && targetElement.type === "submit") ||
      targetElement.closest('button[type="submit"]') !== null;

    if (!isTextarea && !isSubmitButton) {
      event.preventDefault();
    }
  }
};

export default function EnrollmentForm({ enrollment }: { enrollment?: Enrollment }) {
  const router = useRouter();
  const isEdit = Boolean(enrollment?.id);

  // Fetch lookup data
  const { data: users } = useRequest({
    url: ENDPOINTS.LOOKUP.ENROLLMENT_USERS,
    queryKey: ["lookup-enrollment-users"],
    staleTime: 1000 * 60 * 5,
  });
  const { data: teams } = useRequest({
    url: ENDPOINTS.LOOKUP.TEAMS,
    queryKey: ["lookup-teams"],
    staleTime: 1000 * 60 * 5,
  });
  const { data: programs } = useRequest({
    url: ENDPOINTS.LOOKUP.PROGRAMS,
    queryKey: ["lookup-programs"],
    staleTime: 1000 * 60 * 5,
  });
  const { data: submissions } = useRequest({
    url: ENDPOINTS.LOOKUP.SUBMISSIONS,
    queryKey: ["lookup-submissions"],
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm(
    {
      user_id: 0,
      team_id: 0,
      program_id: 0,
      onboarding_submission_id: 0,
      status: "pending",
      duration_value: 1,
      duration_unit: "days",
      started_at: "",
      ended_at: "",
      notes: "",
    },
    {
      validate: CreateEnrollmentSchema,
      tanstack: {
        invalidateQueries: [
          "admin-enrollments",
          "lookup-enrollment-users",
          "lookup-teams",
          "lookup-programs",
          "lookup-submissions",
        ],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<EnrollmentApiResponse>(
              ["admin-enrollments"],
              (previous) => {
                const base: EnrollmentApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as Enrollment[],
                        message: previous?.message ?? "",
                      } as EnrollmentApiResponse);

                const updatedFromServer = (response as EnrollmentApiResponse)?.data;
                const baseData = (base?.data as Enrollment[]) ?? [];

                if (isEdit && enrollment) {
                  const existing = baseData.find((r) => r.id === enrollment.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          user_id: form.data.user_id,
                          team_id: form.data.team_id,
                          program_id: form.data.program_id,
                          onboarding_submission_id: form.data.onboarding_submission_id,
                          status: form.data.status,
                          duration_value: form.data.duration_value,
                          duration_unit: form.data.duration_unit,
                          started_at: form.data.started_at,
                          ended_at: form.data.ended_at,
                          notes: form.data.notes,
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === enrollment.id ? next : r)),
                  } as EnrollmentApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [...baseData, updatedFromServer],
                  } as EnrollmentApiResponse;
                }

                return base as EnrollmentApiResponse;
              },
              { all: true },
            );

            toast.success(response.message);
            router.push(PATHS.ADMIN.ENROLLMENTS.LIST);
          },
          onError: (error) => toast.error(error.message),
        },
      },
    },
  );

  useEffect(() => {
    if (isEdit && enrollment) {
      form.setData({
        user_id: enrollment.user?.id ?? 0,
        team_id: enrollment.team?.id ?? 0,
        program_id: enrollment.program?.id ?? 0,
        onboarding_submission_id: enrollment.submission?.id ?? 0,
        status: enrollment.status ?? "pending",
        duration_value: enrollment.duration_value ?? 1,
        duration_unit: enrollment.duration_unit ?? "days",
        started_at: enrollment.started_at ?? "",
        ended_at: enrollment.ended_at ?? "",
        notes: enrollment.notes ?? "",
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enrollment?.id,
    enrollment?.user?.id,
    enrollment?.team?.id,
    enrollment?.program?.id,
    enrollment?.submission?.id,
    enrollment?.status,
    enrollment?.duration_value,
    enrollment?.duration_unit,
    enrollment?.started_at,
    enrollment?.ended_at,
    enrollment?.notes,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit && enrollment?.id) form.put(ENDPOINTS.ADMIN.ENROLLMENTS.UPDATE(enrollment.id));
    else form.post(ENDPOINTS.ADMIN.ENROLLMENTS.STORE);
  };

  return (
    <div className="mx-auto w-full">
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="space-y-5">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">General Information</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ComboBoxField
                id="user_id"
                name="user_id"
                label="User"
                placeholder="Select a user..."
                searchPlaceholder="Search users..."
                emptyMessage="No users found."
                options={(Array.isArray(users?.data) ? users.data : []).map((u) => ({
                  value: String(u.id),
                  label: u.name,
                }))}
                value={form.data.user_id ? String(form.data.user_id) : ""}
                onChange={(value: string) => form.setData("user_id", Number(value))}
                error={form.errors.user_id as string}
                required
                disabled={form.processing || !users?.data}
                allowClear
              />

              {/* Team */}
              <ComboBoxField
                id="team_id"
                name="team_id"
                label="Team"
                placeholder="Select a team..."
                searchPlaceholder="Search teams..."
                emptyMessage="No teams found."
                options={(Array.isArray(teams?.data) ? teams.data : []).map((t) => ({
                  value: String(t.id),
                  label: t.name,
                }))}
                value={String(form.data.team_id ?? "")}
                onChange={(value: string) => form.setData("team_id", Number(value))}
                error={form.errors.team_id as string}
                required
                disabled={form.processing}
                allowClear
              />

              {/* Program */}
              <ComboBoxField
                id="program_id"
                name="program_id"
                label="Program"
                placeholder="Select a program..."
                searchPlaceholder="Search programs..."
                emptyMessage="No programs found."
                options={(Array.isArray(programs?.data) ? programs.data : []).map((p) => ({
                  value: String(p.id),
                  label: p.title,
                }))}
                value={String(form.data.program_id ?? "")}
                onChange={(value: string) => form.setData("program_id", Number(value))}
                error={form.errors.program_id as string}
                required
                disabled={form.processing}
                allowClear
              />

              {/* Submission */}
              <ComboBoxField
                id="onboarding_submission_id"
                name="onboarding_submission_id"
                label="Submission"
                placeholder="Select a submission..."
                searchPlaceholder="Search submissions..."
                emptyMessage="No submissions found."
                options={(Array.isArray(submissions?.data) ? submissions.data : []).map((s) => ({
                  value: String(s.id),
                  label: s.id,
                }))}
                value={String(form.data.onboarding_submission_id ?? "")}
                onChange={(value: string) =>
                  form.setData("onboarding_submission_id", Number(value))
                }
                error={form.errors.onboarding_submission_id as string}
                required
                disabled={form.processing}
                allowClear
              />
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Enrollment Details</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Duration */}
              <InputField
                id="duration_value"
                name="duration_value"
                type="number"
                value={String(form.data.duration_value ?? "")}
                onChange={(event) => form.setData("duration_value", Number(event.target.value))}
                error={form.errors.duration_value as string}
                label="Duration"
                placeholder="Duration value"
                required
                disabled={form.processing}
              />

              <ComboBoxField
                id="duration_unit"
                name="duration_unit"
                label="Duration Unit"
                placeholder="Select duration unit..."
                options={[
                  { value: "days", label: "Days" },
                  { value: "weeks", label: "Weeks" },
                  { value: "months", label: "Months" },
                ]}
                value={form.data.duration_unit ?? "days"}
                onChange={(value: string) =>
                  form.setData("duration_unit", value as "days" | "weeks" | "months")
                }
                error={form.errors.duration_unit as string}
                required
                disabled={form.processing}
              />

              <ComboBoxField
                id="status"
                name="status"
                label="Status"
                placeholder="Select status..."
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "active", label: "Active" },
                  { value: "paused", label: "Paused" },
                  { value: "completed", label: "Completed" },
                  { value: "canceled", label: "Canceled" },
                ]}
                value={form.data.status ?? "pending"}
                onChange={(value: string) =>
                  form.setData(
                    "status",
                    value as "pending" | "active" | "paused" | "completed" | "canceled",
                  )
                }
                error={form.errors.status as string}
                required
                disabled={form.processing}
                allowClear
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="text-lg font-semibold text-gray-800">Time Peroid</div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Start Date */}
              <DatepickerField
                id="started_at"
                label="Started At"
                placeholder="Select start date..."
                value={form.data.started_at}
                onChange={(value) => form.setData("started_at", value)}
                error={form.errors.started_at as string}
                required
              />

              {/* End Date */}
              <DatepickerField
                id="ended_at"
                label="Ended At"
                placeholder="Select end date..."
                value={form.data.ended_at}
                onChange={(value) => form.setData("ended_at", value)}
                error={form.errors.ended_at as string}
                minDate={form.data.started_at ? new Date(form.data.started_at) : undefined} // start date as min
              />
            </div>
          </div>

          {/* Notes */}
          <TextareaField
            id="notes"
            name="notes"
            className="min-h-[96px]"
            value={String(form.data.notes ?? "")}
            onChange={(event) => form.setData("notes", event.target.value)}
            error={form.errors.notes as string}
            label="Notes"
            placeholder="Optional notes about this enrollment"
            disabled={form.processing}
          />
        </div>

        {/* Actions Section */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(PATHS.ADMIN.ENROLLMENTS.LIST)}
            disabled={form.processing}
            className="flex cursor-pointer items-center gap-2 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={form.processing || (isEdit && !form.isDirty)}
            className="flex cursor-pointer items-center gap-2 font-semibold"
          >
            {form.processing
              ? isEdit
                ? "Saving Changes..."
                : "Creating Enrollment..."
              : isEdit
                ? "Save Changes"
                : "Create Enrollment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
