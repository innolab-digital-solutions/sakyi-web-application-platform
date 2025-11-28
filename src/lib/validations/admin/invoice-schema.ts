import { z } from "zod";

/**
 * Backend enum values for invoice status
 */
const InvoiceStatusEnum = z.enum(["pending", "paid", "cancelled", "refunded"]);

export const CreateInvoiceSchema = z.object({
  enrollment_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().int().min(1, "Enrollment selection is required"),
  ),
  user_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().int().min(1, "User selection is required"),
  ),
  payment_method_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().int().min(1, "Payment method selection is required"),
  ),
  invoice_number: z.string().max(255).nullable(),
  reference: z.string().max(255).nullable(),
  amount: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseFloat(value) : value),
    z.number().min(0, "Amount must be greater than or equal to 0"),
  ),
  currency: z.string().max(10, "Currency cannot exceed 10 characters"),
  status: InvoiceStatusEnum.nullable(),
  issued_date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), "Invalid issued date"),
  paid_date: z
    .string()
    .optional()
    .nullable()
    .refine((date) => !date || !Number.isNaN(Date.parse(date)), "Invalid paid date"),
  notes: z.string().optional().nullable(),
});

/**
 * Schema for updating an invoice
 * Same as create, backend fields are identical
 */
export const UpdateInvoiceSchema = CreateInvoiceSchema;

/**
 * Type for form data
 */
export type CreateInvoiceFormData = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceFormData = z.infer<typeof UpdateInvoiceSchema>;
