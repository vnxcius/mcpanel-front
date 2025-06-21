"use client";

import { useTransition } from "react";
import { PlayIcon } from "@phosphor-icons/react";
import { useToast } from "@/contexts/ToastContext";
import useSound from "use-sound";
import { useServerStatus } from "@/providers/StatusProvider";
import { useSession } from "@/contexts/SessionContext";

interface StartButtonProps {
  onStartInitiated: () => void;
}

export default function ButtonStart({ onStartInitiated }: StartButtonProps) {
  const { setToastState } = useToast();
  const { status } = useServerStatus();
  const [isPending, startTransition] = useTransition();
  const { session } = useSession();
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });

  const handleStart = () => {
    click();

    startTransition(async () => {
      onStartInitiated();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v2/signed/server/start`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.id}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          const data = await res.json();
          return setToastState({ type: "error", message: data.message });
        }

        return setToastState({
          type: "info",
          message: "Iniciando o servidor...",
        });
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
      aria-disabled={isPending || status !== "offline"}
      disabled={isPending || status !== "offline"}
      onClick={handleStart}
      className="bg-accent disabled:bg-accent/50 after:bg-accent hover:bg-accent/90 text-accent-foreground before:bg-accent disabled:before:bg-accent/50 relative w-fit cursor-pointer px-3 pt-2 pb-3 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:brightness-50 hover:translate-y-px hover:after:h-[3px] disabled:translate-y-px disabled:text-neutral-400"
    >
      <PlayIcon size={18} weight="fill" />
    </button>
  );
}
