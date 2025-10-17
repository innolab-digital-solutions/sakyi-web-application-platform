import { Spinner } from "@/components/ui/spinner";

export default function LoadingScreen({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="relative">
        <div className="from-primary/10 via-accent/10 absolute -inset-16 animate-pulse rounded-full bg-gradient-to-tr to-blue-300/10 blur-xl" />
        <div className="relative z-10 flex h-52 w-80 flex-col items-center justify-center rounded-2xl border border-white/40 bg-white/80 px-8 py-7 text-center shadow-xl backdrop-blur-xl">
          <div className="relative mb-4">
            <div className="from-primary/20 via-accent/20 absolute inset-0 rounded-full bg-gradient-to-tr to-blue-300/20 blur-lg" />
            <div className="relative rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
              <Spinner className="text-primary size-6" />
            </div>
          </div>

          <h2 className="text-base font-semibold tracking-tight text-gray-800">{title}</h2>
          <p className="mt-1.5 max-w-xs text-xs text-gray-500">{description}</p>

          <div className="mt-5 h-1 w-40">
            <div className="h-full w-full overflow-hidden rounded-full bg-gray-200">
              <div className="from-primary via-accent h-full w-1/3 animate-[shimmer_1.2s_ease_infinite] rounded-full bg-gradient-to-r to-blue-400" />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%);
          }
          50% {
            transform: translateX(50%);
          }
          100% {
            transform: translateX(150%);
          }
        }
      `}</style>
    </div>
  );
}
