import { ApiResponse } from "@/types/shared/api";
export interface PaymentMethod {
  id: number;
  name: string;
  logo: string;
  status: "active" | "inactive";
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
