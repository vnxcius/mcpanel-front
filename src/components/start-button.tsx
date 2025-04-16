"use client";

import { startServer } from "@/app/actions";
import { useTransition } from "react";
import { Play } from "@phosphor-icons/react";
import { useServerAction } from "@/contexts/ServerActionContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";

export default function StartButton() {
  const { setStatus } = useServerStatus();
  const { setState } = useServerAction();
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    setStatus("starting");
    startTransition(async () => {
      const state = await startServer();
      setState(state);
      setStatus(state.success ? "online" : "offline");
    });
  };

  return (
    <button
      type="submit"
      aria-disabled={isPending}
      disabled={isPending}
      onClick={handleStart}
      className="bg-accent disabled:bg-accent/50 after:bg-accent hover:bg-accent/90 relative flex w-full cursor-pointer items-center justify-center gap-1.5 border-2 border-black pt-2 pb-3 text-neutral-800 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:brightness-50 hover:translate-y-px hover:after:h-[3px]"
    >
      <Play size={14} weight="fill" />
      {isPending ? "Ligando o servidor..." : "Ligar servidor"}
    </button>
  );
}
