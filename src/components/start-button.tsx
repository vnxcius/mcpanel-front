"use client";

import { useTransition } from "react";
import { Play } from "@phosphor-icons/react";
import { useServerAction } from "@/contexts/ServerActionContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";
import { ValidToken } from "@/lib/token";

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
      const token = await ValidToken();

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
      className="bg-accent disabled:bg-accent/50 after:bg-accent hover:bg-accent/90 relative flex w-full cursor-pointer items-center justify-center gap-1.5 border-2 border-black pt-2 pb-3 text-neutral-800 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:brightness-50 hover:translate-y-px hover:after:h-[3px]"
    >
      <Play size={14} weight="fill" />
      Ligar servidor
    </button>
  );
}
