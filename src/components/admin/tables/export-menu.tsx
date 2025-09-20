import { ChevronDown, FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ExportOption {
  label: string;
  format: string;
  onClick?: () => void;
}

interface ExportMenuProps {
  options?: ExportOption[];
  onExport?: (format: string) => void;
}

const defaultOptions: ExportOption[] = [
  { label: "PDF Format", format: "pdf" },
  { label: "CSV Format", format: "csv" },
  { label: "XLSX Format", format: "xlsx" },
];

export function ExportMenu({ options = defaultOptions, onExport }: ExportMenuProps) {
  const handleExport = (option: ExportOption) => {
    if (option.onClick) {
      option.onClick();
    } else if (onExport) {
      onExport(option.format);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hover:!text-foreground ml-auto w-full font-medium hover:!bg-gray-200 sm:w-auto"
        >
          <FileDown className="mr-0 h-4 w-4 sm:mr-1.5" />
          <span>Export As</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuItem key={option.format} onClick={() => handleExport(option)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
