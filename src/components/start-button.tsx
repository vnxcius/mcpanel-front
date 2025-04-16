"use client";

import { useTransition } from "react";
import { Play } from "@phosphor-icons/react";
import { useServerAction } from "@/contexts/ServerActionContext";
import { useServerStatus } from "@/contexts/ServerStatusContext";
import { ValidToken } from "@/lib/token";

export default function StartButton() {
  const { setServerStatus } = useServerStatus();
  const { setState } = useServerAction();
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    setServerStatus("starting");
    startTransition(async () => {
      const token = await ValidToken();
      try {
        const res = await fetch("http://localhost:4000/api/v1/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          setServerStatus("offline");
          const data = await res.json();
          return setState({ error: true, message: data.message });
        }

        setState({ success: true, message: "Servidor ligado com sucesso" });
        setServerStatus("online");
      } catch (error) {
        if (error instanceof Error) {
          setServerStatus("offline");
          return setState({ error: true, message: error.message });
        }

        console.log(error);
        setState({ error: true, message: "Erro desconhecido" });
        setServerStatus("offline");
      }
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
