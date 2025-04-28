"use client";

import { useServerStatus } from "@/contexts/ServerStatusContext";
import { cn } from "@/lib/utils";
import RemoveTokenButton from "./remove-token-button";

export default function ServerStatus() {
  const { serverStatus } = useServerStatus();

  return (
    <div className={cn("mt-10 flex w-full items-end justify-between")}>
      <div className="flex flex-col">
        <p className="text-neutral-500">Status do servidor:</p>
        <p
          className={cn(
            "relative w-fit after:absolute after:top-2 after:right-0 after:bottom-0 after:size-2 after:translate-x-3.5 after:rounded-full",
            serverStatus === undefined && "text-neutral-500",
            serverStatus === "starting" &&
              "text-blue-500 after:animate-pulse after:bg-blue-500",
            serverStatus === "online" &&
              "text-green-500 after:animate-pulse after:bg-green-500",
            (serverStatus === "offline" || serverStatus === "stopping") &&
              "text-red-500 after:bg-red-500",
            serverStatus === "restarting" &&
              "text-amber-400 after:animate-pulse after:bg-amber-400",
          )}
        >
          {serverStatus === undefined && "Carregando..."}
          {serverStatus === "starting" && "Iniciando"}
          {serverStatus === "online" && "Online"}
          {serverStatus === "offline" && "Offline"}
          {serverStatus === "restarting" && "Reiniciando"}
          {serverStatus === "stopping" && "Parando"}
        </p>
      </div>
      <RemoveTokenButton />
    </div>
  );
}
