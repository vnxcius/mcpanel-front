"use client";

import { useTransition } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { useServerAction } from "@/contexts/ServerActionContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";

interface RestartButtonProps {
  onRestartInitiated: () => void;
}

export default function RestartButton({
  onRestartInitiated,
}: RestartButtonProps) {
  const { setActionState } = useServerAction();
  const { serverStatus } = useServerStatus();
  const [isPending, startTransition] = useTransition();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleRestart = () => {
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
        const res = await fetch(serverUrl + "/api/v1/restart", {
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

        setActionState({ warning: true, message: "Reiniciando servidor..." });
        onRestartInitiated();
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
      aria-disabled={isPending || serverStatus !== "online"}
      disabled={isPending || serverStatus !== "online"}
      onClick={handleRestart}
      className="relative flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-amber-500 pt-2 pb-3 text-neutral-800 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-amber-500 before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-amber-400 after:brightness-50 hover:translate-y-px hover:bg-amber-500/90 hover:before:bg-amber-500/50 hover:after:h-[3px] disabled:bg-amber-400/50 disabled:before:bg-amber-600/50"
    >
      <ArrowsClockwise
        size={14}
        weight="fill"
        className={isPending ? "animate-spin" : ""}
      />
      Reiniciar servidor
    </button>
  );
}
