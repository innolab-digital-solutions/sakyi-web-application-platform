import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PaginationProperties {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProperties) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let index = 1; index <= totalPages; index++) {
        pages.push(index);
      }
    } else {
      if (currentPage <= 3) {
        for (let index = 1; index <= 4; index++) {
          pages.push(index);
        }
        pages.push("...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...");
        for (let index = totalPages - 3; index <= totalPages; index++) {
          pages.push(index);
        }
      } else {
        pages.push(1, "...");
        for (let index = currentPage - 1; index <= currentPage + 1; index++) {
          pages.push(index);
        }
        pages.push("...", totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderTrigger = (page: number, label: React.ReactNode, disabled: boolean, variant: "prev" | "next" | "page") => {
    if (!onPageChange) {
      const href =
        variant === "prev"
          ? currentPage > 1
            ? `/blog?page=${currentPage - 1}`
            : "#"
          : variant === "next"
            ? currentPage < totalPages
              ? `/blog?page=${currentPage + 1}`
              : "#"
            : `/blog?page=${page}`;

      return (
        <Link
          href={href}
          className={`flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${
            variant === "page"
              ? currentPage === page
                ? "bg-gradient-to-r from-[#35bec5] to-[#0c96c4] text-white shadow-lg"
                : "bg-white text-slate-700 hover:bg-slate-50 hover:text-[#35bec5]"
              : disabled
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-white text-slate-700 hover:bg-slate-50 hover:text-[#35bec5]"
          } ${variant === "page" ? "h-10 w-10" : "px-4 py-2 gap-2"}`}
          style={{ fontFamily: "Inter, sans-serif" }}
          aria-disabled={disabled}
        >
          {label}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handlePageChange(page)}
        disabled={disabled}
        className={`flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${
          variant === "page"
            ? currentPage === page
              ? "bg-gradient-to-r from-[#35bec5] to-[#0c96c4] text-white shadow-lg"
              : "bg-white text-slate-700 hover:bg-slate-50 hover:text-[#35bec5]"
            : disabled
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-white text-slate-700 hover:bg-slate-50 hover:text-[#35bec5]"
        } ${variant === "page" ? "h-10 w-10" : "px-4 py-2 gap-2"}`}
        style={{ fontFamily: "Inter, sans-serif" }}
        aria-label={variant === "page" ? `Go to page ${page}` : undefined}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="mt-16 flex items-center justify-center">
      <nav className="flex items-center space-x-2">
        {/* Previous Button */}
        {renderTrigger(
          currentPage - 1,
          <>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </>,
          currentPage <= 1,
          "prev",
        )}

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-slate-500">...</span>
              ) : (
                renderTrigger(page as number, page, false, "page")
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        {renderTrigger(
          currentPage + 1,
          <>
            Next
            <ChevronRight className="h-4 w-4" />
          </>,
          currentPage >= totalPages,
          "next",
        )}
      </nav>
    </div>
  );
}