import { Button } from "@/components/ui/button";

export function Pagination() {
  return (
    <div>
      {" "}
      <div className="border-border flex items-center justify-end space-x-2 border-t px-4 py-6">
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
