import { ApiResponse } from "@/types/shared/api";

export interface User {
  id: number;
  status: "active" | "suspended";
  created_at: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    picture: string;
    dob: string;
    gender: "male" | "female" | "other" | null;
    address: string;
    role: {
      id: number;
      name: string;
    };
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

export type UserApiResponse = ApiResponse<User[]> | undefined;

export type UserFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<User>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
