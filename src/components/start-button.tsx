"use client";

import { useTransition } from "react";
import { PlayIcon } from "@phosphor-icons/react";
import { useToast } from "@/contexts/ToastContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";
import { startServer } from "@/app/actions";
import useSound from "use-sound";

interface StartButtonProps {
  onStartInitiated: () => void;
}

export default function StartButton({ onStartInitiated }: StartButtonProps) {
  const { setToastState } = useToast();
  const { serverStatus } = useServerStatus();
  const [isPending, startTransition] = useTransition();
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });

  const handleStart = () => {
    click();

    startTransition(async () => {
      onStartInitiated();
      try {
        const response = await startServer();
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
      aria-disabled={isPending || serverStatus !== "offline"}
      disabled={isPending || serverStatus !== "offline"}
      onClick={handleStart}
      className="bg-accent disabled:bg-accent/50 after:bg-accent hover:bg-accent/90 text-accent-foreground before:bg-accent disabled:before:bg-accent/50 relative mx-auto flex w-fit cursor-pointer items-center justify-center gap-1.5 border-2 border-black px-10 pt-2 pb-3 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:brightness-50 hover:translate-y-px hover:after:h-[3px] disabled:text-neutral-400"
    >
      <PlayIcon size={14} weight="fill" />
      Ligar servidor
    </button>
  );
}
