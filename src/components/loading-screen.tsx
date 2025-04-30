import { cn } from "@/lib/utils";

export default function LoadingScreen({ fadeOut }: { fadeOut: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-900",
        fadeOut && "opacity-0 transition-opacity duration-500 ease-in-out",
      )}
    >
      <div className="loader" />
    </div>
  );
}
