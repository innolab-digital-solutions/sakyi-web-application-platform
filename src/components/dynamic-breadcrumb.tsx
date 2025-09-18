"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { Fragment } from "react";

export default function DynamicBreadcrumb() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              {item.href && index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href}
                    className="text-foreground hover:!text-accent"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage
                  className={
                    index === breadcrumbs.length - 1 ? "font-medium" : ""
                  }
                >
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
