import { Home } from "lucide-react";

import { ErrorPage } from "@/components/shared/error-page";
import { PATHS } from "@/config/paths";

export default function NotFound() {
  return (
    <ErrorPage
      code="404 Not Found"
      imageSrc="/images/404.png"
      imageAlt="Page not found"
      title="Page Not Found"
      description="The page you are looking for could not be found. It may have been removed, renamed, or is temporarily unavailable."
      actions={[
        {
          label: "Go to Home",
          href: PATHS.PUBLIC.HOME,
          icon: Home,
          variant: "default",
        },
      ]}
    />
  );
}
