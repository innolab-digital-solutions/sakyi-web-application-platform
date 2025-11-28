import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface Invoice {
  id: number;
  invoice_number: string;
  reference: string;
  amount: number;
  currency: string;
  status: "refunded" | "pending" | "paid" | "cancelled";
  issued_date?: string; // YYYY-MM-DD
  paid_date?: string; // YYYY-MM-DD
  notes?: string;

  // Nested relations (optional, only when loaded)
  enrollment?: {
    id: number;
    unique_id: string;
  };

  user?: {
    id: number;
    name: string;
    picture: string | null;
  };

  payment_method?: {
    id: number;
    name: string;
  };

  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

/**
 * API response containing multiple invoices with pagination
 */
export interface InvoicesResponse {
  status: string;
  message: string;
  data: Invoice[];
  meta: {
    pagination: Pagination;
  };
}

/**
 * Type for API response
 */
export type InvoiceApiResponse = ApiResponse<Invoice[]> | undefined;

/**
 * Form properties for creating or editing an invoice
 */
export type InvoiceFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Invoice>;
  open?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;

  enrollment_id?: number;
  user_id?: number;
  payment_method_id?: number;
  amount?: number;
  currency?: string;
  issue_date?: string; // YYYY-MM-DD
  due_date?: string; // YYYY-MM-DD
  status?: "draft" | "sent" | "paid" | "overdue";
};
