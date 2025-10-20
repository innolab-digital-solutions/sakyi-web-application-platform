import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview | SaKyi Health & Wellness",
  description: "View your dashboard overview with key metrics and insights.",
};

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-sm bg-gray-200" />
        <div className="aspect-video rounded-sm bg-gray-200" />
        <div className="aspect-video rounded-sm bg-gray-200" />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="aspect-video rounded-sm bg-gray-200" />
        <div className="aspect-video rounded-sm bg-gray-200" />
      </div>
    </div>
  );
}
