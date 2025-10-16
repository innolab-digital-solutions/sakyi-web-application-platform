import { Home } from "lucide-react";

import { ErrorPage } from "@/components/shared/error-page";

export default function PublicNotFound() {
  return (
    <ErrorPage
      code="404 Not Found"
      imageSrc="/images/404.png"
      imageAlt="Page not found"
      title="Page Not Found"
      description="The page you are looking for could not be found. It may have been removed, renamed, or is temporarily unavailable."
      actions={[
        {
          label: "Go Home",
          href: "/",
          icon: Home,
          variant: "default",
        },
      ]}
    />
  );
}
