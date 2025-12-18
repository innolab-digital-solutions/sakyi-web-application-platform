"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import MemberCard from "@/components/shared/member-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateTeamSchema, EditTeamSchema } from "@/lib/validations/admin/team-schema";
import { Team, TeamApiResponse, TeamFormProperties } from "@/types/admin/team";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function TeamForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: TeamFormProperties) {
  const isEdit = mode === "edit";

  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const dialogOpen = isControlled ? open : uncontrolledOpen;

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  // Fetch members for combo box
  const { data: membersResponse } = useRequest({
    url: ENDPOINTS.LOOKUP.TEAM_MEMBERS,
    queryKey: ["team-members-lookup"],
    staleTime: 1000 * 60 * 5,
  });

  const membersData =
    (membersResponse?.data as
      | { id: number; name: string; phone: string; email: string; role: string; picture: string }[]
      | undefined) ?? [];
  const membersOptions = membersData.map((m) => {
    const initials = m.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return {
      value: m.id.toString(),
      label: (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={m.picture} alt={m.name} />
            <AvatarFallback className="bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{m.name}</span>
            {m.role && <span className="text-muted-foreground truncate text-xs">{m.role}</span>}
          </div>
        </div>
      ),
      name: m.name,
      picture: m.picture,
      role: m.role,
    };
  });

  const form = useForm(
    {
      name: "",
      description: "",
      member_ids: [],
    },
    {
      validate: isEdit ? EditTeamSchema : CreateTeamSchema,
      tanstack: {
        invalidateQueries: ["admin-teams", "team-members-lookup"],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<TeamApiResponse>(
              ["admin-teams"],
              (previous) => {
                const base: TeamApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as Team[],
                        message: previous?.message ?? "",
                      } as TeamApiResponse);

                const updatedFromServer = (response as TeamApiResponse)?.data;
                const baseData = (base?.data as Team[]) ?? [];

                if (isEdit && defaultValues) {
                  const existing = baseData.find((t) => t.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          name: String(form.data.name ?? ""),
                          description: String(form.data.description ?? ""),
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((t) => (t.id === defaultValues.id ? next : t)),
                  } as TeamApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [...baseData, updatedFromServer],
                  } as TeamApiResponse;
                }

                return base as TeamApiResponse;
              },
              { all: true },
            );

            if (!isEdit) {
              const url = buildDefaultListUrl(pathname, searchParameters);
              router.replace(url, { scroll: false });
            }

            handleDialogOpenChange(false);
            toast.success(response.message);
          },

          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  // --- Members logic like AddChoiceInline ---
  const [addedMembers, setAddedMembers] = useState<
    { id: number; name: string; role: string | null; picture: string | null }[]
  >(
    defaultValues?.members?.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      picture: u.picture,
    })) ?? [],
  );
  const [comboValue, setComboValue] = useState<string | undefined>();

  const handleAddMember = (member: {
    id: number;
    name: string;
    picture?: string | undefined;
    role: string | null;
  }) => {
    if (!addedMembers.some((m) => m.id === member.id)) {
      const next = [
        ...addedMembers,
        {
          id: member.id,
          name: member.name,
          role: member.role,
          picture: member.picture ?? (undefined as unknown as string | null),
        },
      ];
      setAddedMembers(next);
      form.setData(
        "member_ids",
        next.map((m) => m.id.toString()),
      );
    }
    setComboValue(undefined);
  };

  const handleRemoveMember = (id: number) => {
    const next = addedMembers.filter((m) => m.id !== id);
    setAddedMembers(next);
    form.setData(
      "member_ids",
      next.map((m) => m.id.toString()),
    );
  };

  useEffect(() => {
    if (dialogOpen) {
      if (isEdit && defaultValues) {
        const newData = {
          name: defaultValues.name,
          description: defaultValues.description,
          member_ids: defaultValues?.members?.map((u) => u.id.toString()) ?? [],
        };
        form.setDataAndDefaults(newData);

        setAddedMembers(
          defaultValues.members?.map((u) => ({
            id: Number(u.id),
            name: u.name,
            role: u.role,
            picture: u.picture,
          })) ?? [],
        );
      } else {
        form.setDataAndDefaults({ name: "", description: "", member_ids: [] });
        setAddedMembers([]);
      }

      setComboValue(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, defaultValues, isEdit]);

  const buildFormData = (payload: typeof form.data) => {
    const fd = new FormData();
    fd.append("name", String(payload.name ?? ""));
    fd.append("description", String(payload.description ?? ""));
    for (const id of payload.member_ids ?? []) {
      fd.append("member_ids[]", id.toString());
    }
    return fd;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.setData(
      "member_ids",
      addedMembers.map((m) => m.id.toString()),
    );

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.TEAMS.UPDATE(defaultValues.id), { transform: buildFormData });
    } else {
      form.post(ENDPOINTS.ADMIN.TEAMS.STORE, { transform: buildFormData });
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      title={title ?? (isEdit ? "Edit Team" : "Create New Team")}
      description={
        description ??
        (isEdit
          ? "Update this team’s name or members so responsibilities stay clear."
          : "Set up a new team by giving it a clear name and selecting the members who will belong to it.")
      }
      isEdit={isEdit}
      processing={form.processing}
      submitLabel={isEdit ? "Save Changes" : "Create Team"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Team..."}
      disabled={false}
      onSubmit={handleSubmit}
    >
      <InputField
        id="name"
        name="name"
        type="text"
        label="Team Name"
        placeholder="e.g., Marketing Team"
        value={form.data.name ?? ""}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        disabled={form.processing}
        required
      />

      <TextareaField
        id="description"
        name="description"
        label="Description"
        className="min-h-[96px]"
        placeholder="Short description about the team..."
        value={form.data.description ?? ""}
        onChange={(event) => form.setData("description", event.target.value)}
        error={form.errors.description as string}
        disabled={form.processing}
      />

      <ComboBoxField
        id="member_ids"
        name="member_ids"
        label="Members"
        placeholder="Choose team members"
        options={membersOptions}
        value={comboValue}
        selectedValues={addedMembers.map((m) => m.id.toString())}
        required
        error={form.errors.member_ids as string}
        onChange={(value) => {
          setComboValue(value);

          const selected = membersOptions.find((o) => o.value === value);
          if (selected) {
            handleAddMember({
              id: Number(selected.value),
              name: selected.name,
              picture: selected.picture,
              role: selected.role,
            });
          }
        }}
      />

      <div className="mt-2 grid grid-cols-1 gap-4 rounded-md md:grid-cols-2">
        {addedMembers.map((m) => (
          <MemberCard
            key={m.id}
            id={m.id}
            name={m.name}
            role={m.role ?? undefined}
            picture={m.picture ?? undefined}
            onRemove={handleRemoveMember}
          />
        ))}
      </div>
    </FormDialog>
  );
}
