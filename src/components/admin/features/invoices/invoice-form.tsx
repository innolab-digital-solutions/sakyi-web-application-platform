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
import { CreateInvoiceSchema, UpdateInvoiceSchema } from "@/lib/validations/admin/invoice-schema";
import { Invoice, InvoiceApiResponse } from "@/types/admin/invoice";

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

export default function InvoiceForm({ invoice }: { invoice?: Invoice }) {
  const router = useRouter();
  const isEdit = Boolean(invoice?.id);

  // Fetch lookup data
  const { data: users } = useRequest({
    url: ENDPOINTS.LOOKUP.INVOICE_USERS,
    queryKey: ["lookup-invoice-users"],
    staleTime: 1000 * 60 * 5,
  });

  const { data: enrollments } = useRequest({
    url: ENDPOINTS.LOOKUP.ENROLLMENTS,
    queryKey: ["lookup-enrollments"],
    staleTime: 1000 * 60 * 5,
  });

  const { data: paymentMethods } = useRequest({
    url: ENDPOINTS.LOOKUP.PAYMENT_METHODS,
    queryKey: ["lookup-payment-methods"],
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm(
    {
      enrollment_id: 0,
      user_id: 0,
      payment_method_id: 0,
      invoice_number: "",
      reference: "",
      amount: 0,
      currency: "MMK",
      status: "pending",
      issued_date: "",
      paid_date: "",
      notes: "",
    },
    {
      validate: isEdit ? UpdateInvoiceSchema : CreateInvoiceSchema,
      tanstack: {
        invalidateQueries: [
          "admin-invoices",
          "lookup-users",
          "lookup-enrollments",
          "lookup-payment-methods",
        ],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<InvoiceApiResponse>(
              ["admin-invoices"],
              (previous) => {
                const base: InvoiceApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as Invoice[],
                        message: previous?.message ?? "",
                      } as InvoiceApiResponse);

                const updatedFromServer = (response as InvoiceApiResponse)?.data;
                const baseData = (base?.data as Invoice[]) ?? [];

                if (isEdit && invoice) {
                  const existing = baseData.find((r) => r.id === invoice.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          enrollment_id: form.data.enrollment_id,
                          user_id: form.data.user_id,
                          payment_method_id: form.data.payment_method_id,
                          invoice_number: form.data.invoice_number,
                          reference: form.data.reference,
                          amount: form.data.amount,
                          currency: form.data.currency,
                          status: form.data.status,
                          issued_date: form.data.issued_date,
                          paid_date: form.data.paid_date,
                          notes: form.data.notes,
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === invoice.id ? next : r)),
                  } as InvoiceApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [...baseData, updatedFromServer],
                  } as InvoiceApiResponse;
                }

                return base as InvoiceApiResponse;
              },
              { all: true },
            );

            toast.success(response.message);
            router.push(PATHS.ADMIN.INVOICES.LIST);
          },
          onError: (error) => toast.error(error.message),
        },
      },
    },
  );

  useEffect(() => {
    if (isEdit && invoice) {
      form.setData({
        enrollment_id: invoice.enrollment?.id ?? 0,
        user_id: invoice.user?.id ?? 0,
        payment_method_id: invoice.payment_method?.id ?? 0,
        invoice_number: invoice.invoice_number ?? "",
        reference: invoice.reference ?? "",
        amount: invoice.amount ?? 0,
        currency: invoice.currency ?? "MMK",
        status: invoice.status ?? "pending",
        issued_date: invoice.issued_date ?? "",
        paid_date: invoice.paid_date ?? "",
        notes: invoice.notes ?? "",
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    invoice?.id,
    invoice?.enrollment?.id,
    invoice?.user?.id,
    invoice?.payment_method?.id,
    invoice?.invoice_number,
    invoice?.reference,
    invoice?.amount,
    invoice?.currency,
    invoice?.status,
    invoice?.issued_date,
    invoice?.paid_date,
    invoice?.notes,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit && invoice?.id) form.put(ENDPOINTS.ADMIN.INVOICES.UPDATE(invoice.id));
    else form.post(ENDPOINTS.ADMIN.INVOICES.STORE);
  };

  return (
    <div className="mx-auto w-full">
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm"
      >
        {/* Section 1: Invoice Information */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-800">Invoice Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ComboBoxField
              id="user_id"
              name="user_id"
              label="User"
              placeholder="Select a user..."
              options={(Array.isArray(users?.data) ? users.data : [])
                .filter((u) => u.id != undefined)
                .map((u) => ({ value: String(u.id), label: u.name ?? "Unknown" }))}
              value={form.data.user_id ? String(form.data.user_id) : undefined} // <-- use undefined for empty
              onChange={(value: string) => form.setData("user_id", Number(value))}
              error={form.errors.user_id as string}
              required
              disabled={form.processing || !users?.data}
              allowClear
            />

            <ComboBoxField
              id="enrollment_id"
              name="enrollment_id"
              label="Enrollment"
              placeholder="Select an enrollment..."
              options={(Array.isArray(enrollments?.data) ? enrollments.data : [])
                .filter((enrollment) => enrollment.id != undefined)
                .map((enrollment) => ({
                  value: String(enrollment.id),
                  label: enrollment.unique_id,
                }))}
              value={String(form.data.enrollment_id ?? "")}
              onChange={(value: string) => form.setData("enrollment_id", Number(value))}
              error={form.errors.enrollment_id as string}
              required
              disabled={form.processing || !enrollments?.data}
              allowClear
            />
            <ComboBoxField
              id="payment_method_id"
              name="payment_method_id"
              label="Payment Method"
              placeholder="Select payment method..."
              options={(Array.isArray(paymentMethods?.data) ? paymentMethods.data : [])
                .filter((p) => p.id != undefined)
                .map((p) => ({ value: String(p.id), label: p.name ?? "Unknown" }))}
              value={String(form.data.payment_method_id ?? "")}
              onChange={(value: string) => form.setData("payment_method_id", Number(value))}
              error={form.errors.payment_method_id as string}
              required
              disabled={form.processing || !paymentMethods?.data}
              allowClear
            />

            {form.data.invoice_number && (
              <InputField
                id="invoice_number"
                name="invoice_number"
                type="text"
                value={form.data.invoice_number ?? ""}
                label="Invoice Number"
                disabled
              />
            )}
          </div>
        </div>

        {/* Section 2: Financial Details */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-800">Financial Details</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              id="amount"
              name="amount"
              type="number"
              value={String(form.data.amount ?? "")}
              onChange={(event) => form.setData("amount", Number(event.target.value))}
              error={form.errors.amount as string}
              label="Amount"
              placeholder="Enter invoice amount"
              required
              disabled={form.processing}
            />
            <InputField
              id="currency"
              name="currency"
              type="text"
              value={String(form.data.currency ?? "MMK")}
              onChange={(event) => form.setData("currency", event.target.value)}
              error={form.errors.currency as string}
              label="Currency"
              placeholder="Currency code (e.g., MMK, THB, USD)"
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
                { value: "paid", label: "Paid" },
                { value: "refunded", label: "Refunded" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              value={form.data.status ?? "pending"}
              onChange={(value: string) =>
                form.setData("status", value as "pending" | "paid" | "refunded" | "cancelled")
              }
              error={form.errors.status as string}
              required
              disabled={form.processing}
              allowClear
            />
          </div>
        </div>

        {/* Section 3: Dates */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-800">Dates</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DatepickerField
              id="issued_date"
              label="Issued Date"
              placeholder="Select issued date..."
              value={form.data.issued_date}
              onChange={(value) => form.setData("issued_date", value)}
              error={form.errors.issued_date as string}
              required
            />
            <DatepickerField
              id="paid_date"
              label="Paid Date"
              placeholder="Select paid date..."
              value={form.data.paid_date ?? undefined}
              onChange={(value) => form.setData("paid_date", value)}
              error={form.errors.paid_date as string}
            />
          </div>
        </div>

        {/* Section 4: References & Notes */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-gray-800">References & Notes</h3>
          <div className="space-y-5">
            <InputField
              id="reference"
              name="reference"
              type="text"
              value={form.data.reference ?? ""}
              onChange={(event) => form.setData("reference", event.target.value)}
              error={form.errors.reference as string}
              label="Reference"
              placeholder="Optional reference"
              disabled={form.processing}
            />

            <TextareaField
              id="notes"
              name="notes"
              className="min-h-[96px]"
              value={form.data.notes ?? ""}
              onChange={(event) => form.setData("notes", event.target.value)}
              error={form.errors.notes as string}
              label="Notes"
              placeholder="Optional notes about this invoice"
              disabled={form.processing}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(PATHS.ADMIN.INVOICES.LIST)}
            disabled={form.processing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={form.processing || (isEdit && !form.isDirty)}
          >
            {form.processing
              ? isEdit
                ? "Saving Changes..."
                : "Creating Invoice..."
              : isEdit
                ? "Save Changes"
                : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
