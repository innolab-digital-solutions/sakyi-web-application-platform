import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface StaffAccount {
  id: number;
  avatar: string;
  name: string;
  username: string;
  role: string;
  email: string;
  phone: string | null;
  email_verified_at: string;
  phone_verified_at: string | null;
  status: string;
}

export interface StaffAccountResponse {
  status: string;
  message: string;
  data: StaffAccount[];
  meta: {
    pagination: Pagination;
  };
}

export type StaffAccountApiResponse = ApiResponse<StaffAccountResponse>;
