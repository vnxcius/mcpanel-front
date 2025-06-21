"use client";

import ButtonRestart from "@/components/button-restart";
import ButtonStart from "@/components/button-start";
import ButtonStop from "@/components/button-stop";
import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useServerStatus } from "@/providers/StatusProvider";

export default function ButtonGroup() {
  const status = useServerStatus();

  const { setToastState } = useToast();
  const [isAwaitingStartResult, setIsAwaitingStartResult] = useState(false);
  const [isAwaitingStopResult, setIsAwaitingStopResult] = useState(false);
  const [isAwaitingRestartResult, setIsAwaitingRestartResult] = useState(false);

  const handleStartInitiated = () => setIsAwaitingStartResult(true);
  const handleStopInitiated = () => setIsAwaitingStopResult(true);
  const handleRestartInitiated = () => setIsAwaitingRestartResult(true);

  useEffect(() => {
    // Handle Start result
    if (isAwaitingStartResult && status === "online") {
      setToastState({
        type: "success",
        message: "Servidor iniciado com sucesso!",
      });
      setIsAwaitingStartResult(false);
    } else if (isAwaitingStartResult && status === "offline") {
      // e.g., start failed?
      setToastState({ type: "error", message: "Falha ao iniciar o servidor" });
      setIsAwaitingStartResult(false);
    }

    // Handle Stop result
    if (isAwaitingStopResult && status === "offline") {
      setToastState({
        type: "success",
        message: "Servidor parado com sucesso!",
      });
      setIsAwaitingStopResult(false);
    } else if (isAwaitingStopResult && status === "online") {
      // e.g., stop failed?
      setToastState({ type: "error", message: "Falha ao parar o servidor" });
      setIsAwaitingStopResult(false);
    }

    // Handle Restart result (more complex, depends on final state - likely 'online')
    if (isAwaitingRestartResult && status === "online") {
      setToastState({
        type: "success",
        message: "Servidor reiniciado com sucesso!",
      });
      setIsAwaitingRestartResult(false);
    } else if (isAwaitingRestartResult && status === "offline") {
      // e.g., restart failed?
      setToastState({
        type: "error",
        message: "Falha ao reiniciar o servidor",
      });
      setIsAwaitingRestartResult(false);
    }
  }, [
    status,
    isAwaitingStartResult,
    isAwaitingStopResult,
    isAwaitingRestartResult,
    setToastState,
  ]);
  return (
    <div className="z-20 flex gap-1.5 max-sm:fixed max-sm:bottom-2 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:bg-neutral-900">
      <ButtonStart onStartInitiated={handleStartInitiated} />
      <ButtonRestart onRestartInitiated={handleRestartInitiated} />
      <ButtonStop onStopInitiated={handleStopInitiated} />
    </div>
  );
}
