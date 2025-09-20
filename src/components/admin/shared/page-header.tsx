import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ icon: Icon, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground mb-1 flex items-center gap-2 text-lg font-bold">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">{description}</p>
        </div>

        {actions && (
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
