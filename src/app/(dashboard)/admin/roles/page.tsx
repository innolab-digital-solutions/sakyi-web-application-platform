/* eslint-disable unicorn/no-null */
"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Columns3,
  Filter,
  MoreHorizontal,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import RoleForm from "@/components/admin/roles/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu as ActionDropdownMenu,
  DropdownMenuContent as ActionDropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger as ActionDropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role, RolesResponse } from "@/types/admin/role";

// Dummy paginated response data for testing
const dummyRolesResponse: RolesResponse = {
  status: "success",
  message: "Roles retrieved successfully",
  data: [
    {
      id: 1,
      name: "Super Administrator",
      description:
        "Full system access with all permissions. Can manage users, roles, and system settings.",
      permissions: [
        {
          users: {
            create: "Create new users",
            read: "View user information",
            update: "Update user details",
            delete: "Delete users",
          },
          roles: {
            create: "Create new roles",
            read: "View role information",
            update: "Update role permissions",
            delete: "Delete roles",
          },
          programs: {
            create: "Create wellness programs",
            read: "View all programs",
            update: "Update program details",
            delete: "Delete programs",
          },
          reports: {
            read: "View all reports",
            export: "Export report data",
          },
        },
      ],
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Program Manager",
      description:
        "Manages wellness programs and client enrollments. Can view reports and manage program content.",
      permissions: [
        {
          programs: {
            create: "Create new programs",
            read: "View all programs",
            update: "Update program details",
            delete: "Delete own programs",
          },
          clients: {
            read: "View client information",
            update: "Update client program status",
          },
          reports: {
            read: "View program reports",
            export: "Export program data",
          },
        },
      ],
      created_at: "2024-01-20T14:15:00Z",
      updated_at: "2024-01-25T09:45:00Z",
    },
    {
      id: 3,
      name: "Health Coach",
      description:
        "Provides direct client support and tracks wellness progress. Limited administrative access.",
      permissions: [
        {
          clients: {
            read: "View assigned clients",
            update: "Update client progress",
          },
          programs: {
            read: "View program details",
          },
          reports: {
            read: "View client progress reports",
          },
        },
      ],
      created_at: "2024-02-01T08:00:00Z",
      updated_at: "2024-02-01T08:00:00Z",
    },
    {
      id: 4,
      name: "Content Creator",
      description: "Creates and manages wellness content, articles, and educational materials.",
      permissions: [
        {
          content: {
            create: "Create new content",
            read: "View all content",
            update: "Update content",
            delete: "Delete own content",
          },
          programs: {
            read: "View program content",
            update: "Update program content",
          },
        },
      ],
      created_at: "2024-02-10T11:20:00Z",
      updated_at: "2024-02-15T16:30:00Z",
    },
    {
      id: 5,
      name: "Viewer",
      description:
        "Read-only access to view system information and reports. No modification permissions.",
      permissions: [
        {
          users: {
            read: "View user information",
          },
          programs: {
            read: "View program details",
          },
          reports: {
            read: "View reports",
          },
        },
      ],
      created_at: "2024-02-20T13:45:00Z",
      updated_at: "2024-02-20T13:45:00Z",
    },
  ],
  meta: {
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 5,
      last_page: 1,
      from: 1,
      to: 5,
      has_more_pages: false,
      path: "/admin/roles",
      next_page_url: null,
      prev_page_url: null,
    },
  },
};

export default function RoleListPage() {
  const [rolesResponse] = useState<RolesResponse>(dummyRolesResponse);
  const roles = rolesResponse.data;

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Define columns
  const columns: ColumnDef<Role>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3"
            >
              ID
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3"
            >
              Role Name
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-foreground font-semibold">{row.getValue("name")}</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const description = row.getValue("description") as string;
          return (
            <div className="text-muted-foreground max-w-[300px] truncate text-sm">
              {description || "No description"}
            </div>
          );
        },
      },
      {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => {
          const permissions = row.getValue("permissions") as Role["permissions"];
          const moduleCount = permissions.length;
          const totalActions = permissions.reduce(
            (total, permission) =>
              total +
              Object.values(permission).reduce(
                (moduleTotal, actions) => moduleTotal + Object.keys(actions).length,
                0,
              ),
            0,
          );

          return (
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="w-fit">
                {moduleCount} modules
              </Badge>
              <span className="text-muted-foreground text-xs">{totalActions} total actions</span>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="h-8 px-2 lg:px-3"
            >
              Created
              {column.getIsSorted() === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue("created_at") as string;
          return (
            <div className="text-sm">{date ? new Date(date).toLocaleDateString() : "N/A"}</div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const role = row.original;

          return (
            <ActionDropdownMenu>
              <ActionDropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </ActionDropdownMenuTrigger>
              <ActionDropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(role.id.toString());
                  }}
                >
                  Copy role ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <RoleForm
                    mode="edit"
                    defaultValues={{
                      id: role.id,
                      name: role.name,
                      description: role.description,
                    }}
                    trigger={<span>Edit role</span>}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Delete role</DropdownMenuItem>
              </ActionDropdownMenuContent>
            </ActionDropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: roles,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Build page items with ellipses for desktop pagination
  const pageItems = useMemo(() => {
    const total = table.getPageCount();
    const current = table.getState().pagination.pageIndex + 1;
    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }
    const items: Array<number | "ellipsis"> = [];
    const showRange = (start: number, end: number) => {
      for (let index = start; index <= end; index += 1) items.push(index);
    };
    items.push(1);
    if (current > 4) items.push("ellipsis");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    showRange(start, end);
    if (current < total - 3) items.push("ellipsis");
    items.push(total);
    return items;
  }, [table]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground mb-1 flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="h-5 w-5" />
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Manage roles and permissions for your application.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
            <RoleForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex w-full cursor-pointer items-center gap-2 text-sm font-medium sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Role</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="border-border w-full rounded-lg border">
        <div className="flex items-center space-x-4 px-4 py-6">
          <Input
            placeholder="Filter roles..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            className="focus-visible:ring-primary/40 max-w-sm transition-colors"
          />

          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:!bg-muted/60 hover:!text-foreground ml-auto font-medium transition-colors"
                >
                  <Columns3 className="mr-0 h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:block">Columns</span>
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hover:!bg-muted/60 hover:!text-foreground ml-auto font-medium transition-colors"
                >
                  <Filter className="mr-0 h-4 w-4 sm:mr-1.5" />
                  <span className="hidden sm:block">Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={table.getIsAllPageRowsSelected()}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                >
                  Select All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={table.getIsSomePageRowsSelected()}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                >
                  Select Some
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-border overflow-hidden border-y">
          <Table>
            <TableHeader className="border-border bg-muted/30 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:!bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-muted-foreground !py-2 text-xs font-medium tracking-wide uppercase"
                      >
                        {header.isPlaceholder
                          ? undefined
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-4 py-2">
          {/* Pagination - Desktop */}
          <div className="hidden items-center justify-between px-4 py-4 sm:flex">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center gap-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        table.previousPage();
                      }}
                      aria-disabled={table.getCanPreviousPage() ? undefined : true}
                      className={
                        table.getCanPreviousPage() ? undefined : "pointer-events-none opacity-50"
                      }
                    />
                  </PaginationItem>
                  {pageItems.map((item, index) => (
                    <PaginationItem key={`${item}-${index}`}>
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={table.getState().pagination.pageIndex + 1 === item}
                          onClick={(event) => {
                            event.preventDefault();
                            table.setPageIndex(item - 1);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        table.nextPage();
                      }}
                      aria-disabled={table.getCanNextPage() ? undefined : true}
                      className={
                        table.getCanNextPage() ? undefined : "pointer-events-none opacity-50"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={String(table.getState().pagination.pageSize)}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={String(pageSize)}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pagination - Mobile */}
          <div className="flex items-center justify-between px-4 py-4 sm:hidden">
            <Pagination>
              <PaginationContent className="w-full justify-between">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      table.previousPage();
                    }}
                    aria-disabled={table.getCanPreviousPage() ? undefined : true}
                    className={
                      table.getCanPreviousPage() ? undefined : "pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      table.nextPage();
                    }}
                    aria-disabled={table.getCanNextPage() ? undefined : true}
                    className={
                      table.getCanNextPage() ? undefined : "pointer-events-none opacity-50"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </>
  );
}
