import { Button } from "@/components/ui/button";

export function Pagination() {
  return (
    <div>
      {" "}
      <div className="flex items-center justify-end space-x-2 px-4 py-6 border-t border-border">
        <div className="text-muted-foreground flex-1 text-sm"></div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
