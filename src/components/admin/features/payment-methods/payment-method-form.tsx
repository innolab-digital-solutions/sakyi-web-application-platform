"use client";

import { CreditCard } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import FileUploadField from "@/components/shared/forms/file-upload-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import {
  CreatePaymentMethodSchema,
  UpdatePaymentMethodSchema,
} from "@/lib/validations/admin/payment-method-schema";
import {
  PaymentMethod,
  PaymentMethodApiResponse,
  PaymentMethodFormProperties,
} from "@/types/admin/payment-method";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function PaymentMethodForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
}: PaymentMethodFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const form = useForm(
    {
      name: "",
      qr_code: undefined as unknown as File | string,
      logo: undefined as unknown as File | string,
      status: "active",
    },
    {
      validate: isEdit ? UpdatePaymentMethodSchema : CreatePaymentMethodSchema,
      tanstack: {
        invalidateQueries: ["admin-payment-methods"],
        mutationOptions: {
          onSuccess: (response) => {
            // Optimistic/UI-first cache update
            form.queryCache.setQueryData<PaymentMethodApiResponse>(
              ["admin-payment-methods"],
              (previous) => {
                const base: PaymentMethodApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as PaymentMethod[],
                        message: previous?.message ?? "",
                      } as PaymentMethodApiResponse);

                const updatedFromServer = (response as PaymentMethodApiResponse)?.data;
                const baseData = (base?.data as PaymentMethod[]) ?? [];

                if (isEdit && defaultValues?.id) {
                  const existing = baseData.find((r) => r.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          name: String(form.data.name ?? ""),
                          qr_code:
                            typeof form.data.qr_code === "string"
                              ? form.data.qr_code
                              : existing.qr_code,
                          logo: typeof form.data.logo === "string" ? form.data.logo : existing.logo,
                          status: String(form.data.status ?? "active"),
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === defaultValues.id ? next : r)),
                  } as PaymentMethodApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [updatedFromServer, ...baseData],
                  } as PaymentMethodApiResponse;
                }

                return base as PaymentMethodApiResponse;
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

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  useEffect(() => {
    if (isEdit && defaultValues) {
      const newData = {
        name: defaultValues.name ?? "",
        qr_code: defaultValues.qr_code ?? undefined,
        logo: defaultValues.logo ?? undefined,
        status: (defaultValues.status ?? "active") as "active" | "inactive" | "archived",
      };

      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        name: "",
        qr_code: undefined as File | string | undefined,
        logo: undefined as File | string | undefined,
        status: "active" as "active" | "inactive" | "archived",
      };

      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues?.id,
    defaultValues?.name,
    defaultValues?.qr_code,
    defaultValues?.logo,
    defaultValues?.status,
    isEdit,
  ]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", String(form.data.name ?? ""));
    fd.append("status", String(form.data.status ?? "active"));

    if (form.data.qr_code instanceof File) {
      fd.append("qr_code", form.data.qr_code);
    }

    if (form.data.logo instanceof File) {
      fd.append("logo", form.data.logo);
    }

    return fd;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.PAYMENT_METHODS.UPDATE(defaultValues.id), {
        transform: buildFormData,
      });
    } else {
      form.post(ENDPOINTS.ADMIN.PAYMENT_METHODS.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={isEdit ? "Edit Payment Method" : "Create Payment Method"}
      description={
        isEdit
          ? "Update the payment method details such as name, logo, QR code, or status."
          : "Add a payment method with a name, logo, and QR code to make it available for transactions."
      }
      icon={<CreditCard className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Payment Method"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Payment Method..."}
      disabled={isEdit && !form.isDirty}
    >
      {/* Name Field */}
      <InputField
        id="name"
        name="name"
        type="text"
        value={String(form.data.name ?? "")}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        label="Name"
        placeholder="e.g., KBZPay, WavePay, AYA Bank"
        required
        disabled={form.processing}
      />

      {/* Logo Upload Field */}
      <FileUploadField
        id="logo"
        label="Logo"
        value={form.data.logo}
        onChange={(file) => form.setData("logo", file as File | undefined)}
        maxSize={2 * 1024 * 1024}
        accept="image/jpg,image/jpeg,image/png,image/webp"
        required={!isEdit}
        error={form.errors.logo as string}
      />

      {/* QR code Upload Field */}
      <FileUploadField
        id="qr_code"
        label="QR Code"
        value={form.data.qr_code}
        onChange={(file) => form.setData("qr_code", file as File | undefined)}
        maxSize={2 * 1024 * 1024}
        accept="image/jpg,image/jpeg,image/png,image/webp"
        required={!isEdit}
        error={form.errors.qr_code as string}
      />

      {/* Status Select */}
      <SelectField
        id="status"
        name="status"
        label="Status"
        value={String(form.data.status ?? "active")}
        onChange={(value) => form.setData("status", value as "active" | "inactive" | "archived")}
        error={form.errors.status as string}
        options={[
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Archived", value: "archived" },
        ]}
        disabled={form.processing}
      />
    </FormDialog>
  );
}
