"use client";

import { Scale } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { FormDialog } from "@/components/shared/forms/form-dialog";
import { InputField } from "@/components/shared/forms/input-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { CreateUnitSchema } from "@/lib/validations/admin/unit-schema";
import { UnitFormProperties } from "@/types/admin/unit";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function UnitForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
}: UnitFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  const form = useForm(
    {
      name: defaultValues?.name ?? "",
      abbreviation: defaultValues?.abbreviation ?? "",
    },
    {
      validate: CreateUnitSchema,
      tanstack: {
        invalidateQueries: ["admin-units"],
        mutationOptions: {
          onSuccess: (response) => {
            handleDialogOpenChange(false);

            if (!isEdit) {
              const url = buildDefaultListUrl(pathname, searchParameters);
              router.replace(url, { scroll: false });
            }

            toast.success(response.message);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  useEffect(() => {
    if (isEdit && defaultValues) {
      form.setData({
        name: defaultValues.name ?? "",
        abbreviation: defaultValues.abbreviation ?? "",
      });
    } else {
      form.setData({
        name: "",
        abbreviation: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.id, defaultValues?.name, defaultValues?.abbreviation, isEdit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.UNITS.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.UNITS.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={isEdit ? "Edit Unit Details" : "Create a New Unit"}
      description={
        isEdit
          ? "Edit the name or abbreviation of this unit. Changes will update how measurements are displayed throughout the system."
          : "Create a unit with a name and abbreviation to standardize measurements across your application."
      }
      icon={<Scale className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Unit"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Unit..."}
    >
      <InputField
        id="name"
        name="name"
        type="text"
        value={String(form.data.name ?? "")}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        label="Name"
        placeholder="e.g., Kilogram, Gram, Liter"
        required
        disabled={form.processing}
      />

      <InputField
        id="abbreviation"
        name="abbreviation"
        type="text"
        value={String(form.data.abbreviation ?? "")}
        onChange={(event) => form.setData("abbreviation", event.target.value)}
        error={form.errors.abbreviation as string}
        label="Abbreviation"
        placeholder="e.g., kg, g, L"
        required
        disabled={form.processing}
      />
    </FormDialog>
  );
}
