"use client";

import { useTransition } from "react";
import { SquareIcon } from "@phosphor-icons/react";
import { useToast } from "@/contexts/ToastContext";
import useSound from "use-sound";
import { useServerStatus } from "@/providers/StatusProvider";
import { useSession } from "@/contexts/SessionContext";

interface StopButtonProps {
  onStopInitiated: () => void;
}

export default function ButtonStop({ onStopInitiated }: StopButtonProps) {
  const { setToastState } = useToast();
  const { status } = useServerStatus();
  const [isPending, startTransition] = useTransition();
  const { session } = useSession();
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });

  const handleStop = () => {
    click();

    startTransition(async () => {
      onStopInitiated();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v2/signed/server/stop`,
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
          message: "Desligando o servidor...",
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
      aria-disabled={isPending || status === "offline"}
      disabled={isPending || status !== "online"}
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
