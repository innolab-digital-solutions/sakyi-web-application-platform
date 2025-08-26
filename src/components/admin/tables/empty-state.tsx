import { TableCell, TableRow } from "@/components/ui/table";
import { FileX, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          {/* Empty State Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>

          {/* Empty State Content */}
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mb-6 text-center">
              {description}
            </p>

            {/* Empty State Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {actionLabel && (actionHref || onAction) && (
                <>
                  {actionHref ? (
                    <Button asChild className="flex items-center gap-2">
                      <Link href={actionHref}>
                        <Plus className="w-4 h-4" />
                        {actionLabel}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={onAction}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {actionLabel}
                    </Button>
                  )}
                </>
              )}

              {/* Search Tip */}
              {showSearchTip && (
                <div className="flex items-center gap-2 text-sm text-gray-500 text-center">
                  <Search className="w-4 h-4" />
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
