import { ApiResponse } from "@/types/shared/api";

export interface Invoice {
  id: number;
  invoice_number: string;
  reference: string;
  amount: number;
  currency: string;
  status: "draft" | "issued" | "paid" | "void";
  issued_at: string | null;
  paid_at: string | null;
  due_at: string | null;
  notes?: string;
  enrollment?: {
    id: number;
    code: string;
    program: {
      id: number;
      code: string;
      title: string;
    };

    client: {
      id: number;
      name: string;
      picture: string | null;
    };
  };
  payment_method?: {
    id: number;
    name: string;
  };
  actions: {
    edit: {
      allowed: boolean;
      reasons: string[];
    };
    delete: {
      allowed: boolean;
      reasons: string[];
    };
  };
}

export type InvoiceApiResponse = ApiResponse<Invoice[]> | undefined;
