import { FileX, Plus, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  showSearchTip?: boolean;
  colSpan?: number;
}

export function EmptyState({
  title = "No data found",
  description = "There are no items to display at the moment.",
  icon: Icon = FileX,
  actionLabel,
  actionHref,
  onAction,
  showSearchTip = false,
  colSpan = 9,
}: EmptyStateProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-full">
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          {/* Empty State Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>

          {/* Empty State Content */}
          <div className="mx-auto max-w-md">
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mb-6 text-center text-sm text-gray-500">{description}</p>

            {/* Empty State Actions */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {actionLabel && (actionHref || onAction) && (
                <>
                  {actionHref ? (
                    <Button asChild className="flex items-center gap-2">
                      <Link href={actionHref}>
                        <Plus className="h-4 w-4" />
                        {actionLabel}
                      </Link>
                    </Button>
                  ) : (
                    <Button onClick={onAction} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {actionLabel}
                    </Button>
                  )}
                </>
              )}

              {/* Search Tip */}
              {showSearchTip && (
                <div className="flex items-center gap-2 text-center text-sm text-gray-500">
                  <Search className="h-4 w-4" />
                  <span>Try adjusting your search or filters</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
