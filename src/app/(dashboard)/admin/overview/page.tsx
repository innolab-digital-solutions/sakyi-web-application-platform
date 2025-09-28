export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
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
