"use client";

import { useTransition } from "react";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react";
import { useToast } from "@/contexts/ToastContext";
import { restartServer } from "@/app/actions";
import useSound from "use-sound";
import { useServerStatus } from "@/providers/StatusProvider";

interface RestartButtonProps {
  onRestartInitiated: () => void;
}

export default function ButtonRestart({
  onRestartInitiated,
}: RestartButtonProps) {
  const { setToastState } = useToast();
  const { status } = useServerStatus();
  const [isPending, startTransition] = useTransition();
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });

  const handleRestart = () => {
    click();

    startTransition(async () => {
      onRestartInitiated();
      try {
        const response = await restartServer();
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
      aria-disabled={isPending || status !== "online"}
      disabled={isPending || status !== "online"}
      onClick={handleRestart}
      className="relative w-fit cursor-pointer bg-amber-500 px-3 pt-2 pb-3 text-neutral-800 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-amber-500 before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-amber-400 after:brightness-50 hover:translate-y-px hover:bg-amber-500/90 hover:before:bg-amber-500/50 hover:after:h-[3px] disabled:translate-y-px disabled:bg-amber-400/50 disabled:before:bg-amber-600/50"
    >
      <ArrowsClockwiseIcon
        size={18}
        weight="bold"
        className={isPending || status === "restarting" ? "animate-spin" : ""}
      />
    </button>
  );
}
