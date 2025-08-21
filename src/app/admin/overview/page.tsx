export default function Admin() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-gray-200 aspect-video rounded-sm" />
        <div className="bg-gray-200 aspect-video rounded-sm" />
        <div className="bg-gray-200 aspect-video rounded-sm" />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="bg-gray-200 aspect-video rounded-sm" />
        <div className="bg-gray-200 aspect-video rounded-sm" />
      </div>
    </div>
  );
}
