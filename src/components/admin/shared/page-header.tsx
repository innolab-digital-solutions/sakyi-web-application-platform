import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProperties {
  icon?: LucideIcon;
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function PageHeader({
  icon: Icon,
  title,
  description,
  actions,
}: PageHeaderProperties) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <div className="mt-1">{Icon && <Icon className="h-5 w-5" />}</div>
          <div className="flex flex-col">
            <h1 className="text-foreground text-md flex items-center font-bold">{title}</h1>
            <p className="text-muted-foreground text-sm font-medium">{description}</p>
          </div>
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
