import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface PaymentMethod {
  id: number;
  name: string;
  qr_code: string;
  logo: string;
  status: "active" | "inactive" | "archived";
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface PaymentMethodsResponse {
  status: string;
  message: string;
  data: PaymentMethod[];
  meta: {
    pagination: Pagination;
  };
}

export type PaymentMethodApiResponse = ApiResponse<PaymentMethod[]> | undefined;

export type PaymentMethodFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<PaymentMethod>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
