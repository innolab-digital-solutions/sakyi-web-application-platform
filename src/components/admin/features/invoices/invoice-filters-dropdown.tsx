"use client";

import { ChevronDown, Filter, Loader2, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DatepickerField from "@/components/shared/forms/datepicker-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import type { PaymentMethod } from "@/types/admin/payment-method";

interface InvoiceFiltersDropdownProperties {
  isLoading?: boolean;
}

export default function InvoiceFiltersDropdown({
  isLoading = false,
}: InvoiceFiltersDropdownProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  // Fetch Payment Methods
  const { data: paymentMethodsData, isFetching: loadingPaymentMethods } = useRequest<{
    status: string;
    message: string;
    data: PaymentMethod[];
  }>({
    url: ENDPOINTS.LOOKUP.PAYMENT_METHODS,
    queryKey: ["lookup-payment-methods"],
    staleTime: 1000 * 60 * 5,
  });

  const paymentMethods: PaymentMethod[] = Array.isArray(paymentMethodsData?.data)
    ? paymentMethodsData.data
    : [];

  const replaceParameters = (next: URLSearchParams) => {
    next.set("page", "1");
    const query = next.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  };

  const setParameter = (key: string, value: string | undefined) => {
    if (isLoading) return;
    const next = new URLSearchParams(searchParameters.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    replaceParameters(next);
  };

  const clearFilters = () => {
    if (isLoading) return;
    const next = new URLSearchParams(searchParameters.toString());
    for (const key of ["payment_method", "status", "issued_date", "paid_date"]) {
      next.delete(key);
    }
    replaceParameters(next);
  };

  const currentPaymentMethod = searchParameters.get("payment_method");
  const currentStatus = searchParameters.get("status");
  const currentIssuedDate = searchParameters.get("issued_date");
  const currentPaidDate = searchParameters.get("paid_date");

  const activeFiltersCount = [
    currentPaymentMethod,
    currentStatus,
    currentIssuedDate,
    currentPaidDate,
  ].filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="ml-auto hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative ml-auto hidden h-10 font-medium lg:flex"
            disabled={isLoading}
          >
            <Filter className="mr-1 h-4 w-4" />
            <span className="hidden sm:block">Filters</span>

            {hasActiveFilters && (
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold"
              >
                {activeFiltersCount}
              </Badge>
            )}

            {isLoading ? (
              <Loader2 className="ml-1 h-4 w-4 animate-spin" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>Filter Invoices</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* PAYMENT METHOD */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Payment Method
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentPaymentMethod ?? undefined}
              onValueChange={(value) =>
                setParameter("payment_method", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingPaymentMethods}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue
                  placeholder={loadingPaymentMethods ? "Loading..." : "All Payment Methods"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Payment Methods</SelectItem>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.id} value={pm.name}>
                    {pm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* STATUS */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Status
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentStatus ?? undefined}
              onValueChange={(value) =>
                setParameter("status", value === "__all__" ? undefined : value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ISSUED DATE */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Issued Date
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <DatepickerField
              id="issued_date"
              placeholder="Start date"
              value={currentIssuedDate ?? undefined}
              onChange={(value: string | Date | undefined) =>
                setParameter(
                  "issued_date",
                  value
                    ? value instanceof Date
                      ? value.toISOString().split("T")[0]
                      : value
                    : undefined,
                )
              }
              disabled={isLoading}
            />
          </div>

          {/* PAID DATE */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Paid Date
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <DatepickerField
              id="paid_date"
              placeholder="Paid date"
              value={currentPaidDate ?? undefined}
              onChange={(value: string | Date | undefined) =>
                setParameter(
                  "paid_date",
                  value
                    ? value instanceof Date
                      ? value.toISOString().split("T")[0]
                      : value
                    : undefined,
                )
              }
              disabled={isLoading}
            />
          </div>

          <DropdownMenuSeparator />

          {/* RESET */}
          <DropdownMenuItem
            onClick={clearFilters}
            onSelect={(event) => event.preventDefault()}
            disabled={isLoading}
            className="hover:!bg-destructive/10 hover:!text-destructive group text-destructive flex cursor-pointer items-center rounded-md px-2 py-2 font-semibold transition-colors duration-150"
          >
            <RotateCcw className="text-destructive group-hover:!text-destructive mr-2 h-4 w-4 transition-colors duration-150" />
            Reset Filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
