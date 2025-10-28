import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Pagination({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
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

  return (
    <div className="mt-16 flex items-center justify-center">
      <nav className="flex items-center space-x-2">
        {/* Previous Button */}
        <Link
          href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : "#"}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
            currentPage > 1
              ? "bg-white text-slate-700 hover:bg-slate-50 hover:text-[#35bec5]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-slate-500">...</span>
              ) : (
                <Link
                  href={`/blog?page=${page}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-[#35bec5] to-[#0c96c4] text-white shadow-lg"
                      : "bg-white text-slate-700 hover:bg-slate-50 hover:text-[#35bec5]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {page}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Link
          href={currentPage < totalPages ? `/blog?page=${currentPage + 1}` : "#"}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
            currentPage < totalPages
              ? "bg-white text-slate-700 hover:bg-slate-50 hover:text-[#35bec5]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </nav>
    </div>
  );
}