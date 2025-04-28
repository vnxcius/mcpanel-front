"use client";

import { useTransition } from "react";
import { Play } from "@phosphor-icons/react";
import { useServerAction } from "@/contexts/ServerActionContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";

interface StartButtonProps {
  onStartInitiated: () => void;
}

export default function StartButton({ onStartInitiated }: StartButtonProps) {
  const { setActionState } = useServerAction();
  const { serverStatus } = useServerStatus();
  const [isPending, startTransition] = useTransition();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const handleStart = () => {
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
        const res = await fetch(serverUrl + "/api/v1/start", {
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

        setActionState({ warning: true, message: "Ligando o servidor..." });
        onStartInitiated();
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
      aria-disabled={isPending || serverStatus !== "offline"}
      disabled={isPending || serverStatus !== "offline"}
      onClick={handleStart}
      className="bg-accent disabled:bg-accent/50 after:bg-accent hover:bg-accent/90 text-accent-foreground before:bg-accent disabled:before:bg-accent/50 relative flex w-fit cursor-pointer items-center justify-center gap-1.5 border-2 border-black pt-2 pb-3 px-10 mx-auto transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:brightness-50 hover:translate-y-px hover:after:h-[3px] disabled:text-neutral-400"
    >
      <Play size={14} weight="fill" />
      Ligar servidor
    </button>
  );
}
