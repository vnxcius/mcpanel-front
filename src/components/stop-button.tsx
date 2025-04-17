"use client";

import { useTransition } from "react";
import { Square } from "@phosphor-icons/react";
import { useServerAction } from "@/contexts/ServerActionContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";

interface StopButtonProps {
  onStopInitiated: () => void;
}

export default function StopButton({ onStopInitiated }: StopButtonProps) {
  const { setActionState } = useServerAction();
  const { serverStatus } = useServerStatus();
  const [isPending, startTransition] = useTransition();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleStop = () => {
    startTransition(async () => {
      const token = localStorage.getItem("sss-token");

      if (!token) {
        setActionState({
          error: true,
          message: "Authentication token not found or invalid.",
        });
        return;
      }

      try {
        const res = await fetch(serverUrl + "/api/v1/stop", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const data = await res.json();
          return setActionState({ error: true, message: data.message });
        }

        setActionState({ warning: true, message: "Desligando o servidor..." });
        onStopInitiated();
      } catch (error) {
        if (error instanceof Error) {
          return setActionState({ error: true, message: error.message });
        }

        console.log(error);
        setActionState({ error: true, message: "Erro desconhecido" });
      }
    });
  };

  return (
    <button
      type="submit"
      aria-disabled={
        isPending ||
        serverStatus === "stopping" ||
        serverStatus === "restarting"
      }
      disabled={
        isPending ||
        serverStatus === "stopping" ||
        serverStatus === "restarting"
      }
      onClick={handleStop}
      className="relative flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-red-600 pt-2 pb-3 text-neutral-100 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-red-600 before:brightness-150 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500 after:brightness-50 hover:translate-y-px hover:bg-red-500/90 hover:after:h-[3px] disabled:bg-red-500/50 disabled:text-neutral-400 disabled:before:bg-red-600/50"
    >
      <Square
        size={14}
        weight="fill"
        className={isPending ? "animate-pulse" : ""}
      />
      Desligar servidor
    </button>
  );
}
