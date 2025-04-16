"use client";

import { useServerStatus } from "@/contexts/ServerStatusContext";
import { cn } from "@/lib/utils";

export default function ServerStatus() {
  const { status } = useServerStatus();
  return (
    <div className={cn("mx-auto my-3 flex w-fit items-center space-x-2")}>
      <p className="text-neutral-400">Status do servidor:</p>
      <p
        className={cn(
          "relative after:absolute after:top-2 after:right-0 after:bottom-0 after:size-2 after:translate-x-3.5 after:rounded-full",
          status === "starting" &&
            "text-blue-500 after:animate-pulse after:bg-blue-500",
          status === "online" &&
            "text-green-500 after:animate-pulse after:bg-green-500",
          status === "offline" && "text-red-500 after:bg-red-500",
          status === "restarting" &&
            "text-amber-400 after:animate-pulse after:bg-amber-400",
        )}
      >
        {status === "starting" && "Iniciando"}
        {status === "online" && "Online"}
        {status === "offline" && "Offline"}
        {status === "restarting" && "Reiniciando"}
      </p>
    </div>
  );
}
