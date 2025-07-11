"use client";

import { useServerStatus } from "@/providers/StatusProvider";
import { cn } from "@/lib/utils";

export default function ServerStatus() {
  const { status } = useServerStatus();

  return (
    <div className="flex flex-col">
      <p className="text-neutral-500">Status do servidor:</p>
      <p
        className={cn(
          "relative w-fit after:absolute after:top-2 after:right-0 after:bottom-0 after:size-2 after:translate-x-3.5 after:rounded-full",
          status === undefined && "text-neutral-500",
          status === "starting" &&
            "text-blue-500 after:animate-pulse after:bg-blue-500",
          status === "online" &&
            "text-green-500 after:animate-pulse after:bg-green-500",
          status === "restarting" &&
            "text-amber-400 after:animate-pulse after:bg-amber-400",
          (status === "offline" ||
            status === "stopping" ||
            status === "error") &&
            "text-red-500 after:bg-red-500",
        )}
      >
        {status === undefined && "Carregando..."}
        {status === "starting" && "Iniciando"}
        {status === "online" && "Online"}
        {status === "offline" && "Offline"}
        {status === "restarting" && "Reiniciando"}
        {status === "stopping" && "Parando"}
        {status === "error" && "Erro"}
      </p>
    </div>
  );
}
