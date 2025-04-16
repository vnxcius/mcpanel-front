"use client";

import { restartServer } from "@/app/actions";
import { useTransition } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { useServerAction } from "@/contexts/ServerActionContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";

export default function RestartButton() {
  const { setState } = useServerAction();
  const { setStatus } = useServerStatus();
  const [isPending, startTransition] = useTransition();

  const handleRestart = () => {
    setStatus("restarting");
    startTransition(async () => {
      const state = await restartServer();
      setState(state);
      setStatus(state.success ? "online" : "offline");
    });
  };

  return (
    <button
      type="submit"
      aria-disabled={isPending}
      disabled={isPending}
      onClick={handleRestart}
      className="relative flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-amber-400 pt-2 pb-3 text-neutral-800 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-amber-400 after:brightness-50 hover:translate-y-px hover:bg-amber-500/90 hover:after:h-[3px] disabled:bg-amber-400/50"
    >
      <ArrowsClockwise
        size={14}
        weight="fill"
        className={isPending ? "animate-spin" : ""}
      />
      {isPending ? "Reiniciando..." : "Reiniciar servidor"}
    </button>
  );
}
