import { Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/shared/cn";

interface CreateButtonProperties extends Omit<React.ComponentProps<"button">, "children"> {
  label: string;
}

export default function CreateButton({ label, className, ...properties }: CreateButtonProperties) {
  return (
    <Button
      variant="default"
      className={cn("flex items-center gap-2 font-semibold", className)}
      {...properties}
    >
      <Plus className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}
