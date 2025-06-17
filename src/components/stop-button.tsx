"use client";

import { useTransition } from "react";
import { SquareIcon } from "@phosphor-icons/react";
import { useToast } from "@/contexts/ToastContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";
import { stopServer } from "@/app/actions";
import useSound from "use-sound";

interface StopButtonProps {
  onStopInitiated: () => void;
}

export default function StopButton({ onStopInitiated }: StopButtonProps) {
  const { setToastState } = useToast();
  const { serverStatus } = useServerStatus();
  const [isPending, startTransition] = useTransition();
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });

  const handleStop = () => {
    click();
    startTransition(async () => {
      const response = await stopServer();
      if (response.type !== "success") {
        setToastState({
          type: response.type,
          message: response.message || "Erro desconhecido",
        });
        return;
      }
      onStopInitiated();
      setToastState(response);
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
      <SquareIcon
        size={14}
        weight="fill"
        className={isPending ? "animate-pulse" : ""}
      />
      Desligar servidor
    </button>
  );
}
