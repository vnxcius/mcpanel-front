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
      onStopInitiated();
      try {
        const response = await stopServer();
        if (response.type !== "success") {
          setToastState({
            type: response.type,
            message: response.message || "Erro desconhecido",
          });
          return;
        }
        setToastState({ type: response.type, message: response.message });
      } catch (error) {
        if (error instanceof Error) {
          return setToastState({ type: "error", message: error.message });
        }

        console.error(error);
        setToastState({ type: "error", message: "Erro desconhecido" });
      }
    });
  };

  return (
    <button
      type="submit"
      aria-disabled={isPending || serverStatus === "offline"}
      disabled={isPending || serverStatus !== "online"}
      onClick={handleStop}
      className="relative w-fit cursor-pointer bg-red-600 px-3 pt-2 pb-3 text-neutral-100 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-red-600 before:brightness-150 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500 after:brightness-50 hover:translate-y-px hover:bg-red-500/90 hover:after:h-[3px] disabled:translate-y-px disabled:bg-red-500/50 disabled:text-neutral-400 disabled:before:bg-red-600/50"
    >
      <SquareIcon
        size={18}
        weight="fill"
        className={isPending ? "animate-pulse" : ""}
      />
    </button>
  );
}
