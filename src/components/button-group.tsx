"use client";

import RestartButton from "@/components/restart-button";
import StartButton from "@/components/start-button";
import StopButton from "@/components/stop-button";
import { useServerStatus } from "@/contexts/ServerStatusContext";
import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import LoadingScreen from "./loading-screen";

export default function ButtonGroup() {
  const { serverStatus } = useServerStatus();

  const { setToastState } = useToast();
  const [isAwaitingStartResult, setIsAwaitingStartResult] = useState(false);
  const [isAwaitingStopResult, setIsAwaitingStopResult] = useState(false);
  const [isAwaitingRestartResult, setIsAwaitingRestartResult] = useState(false);

  const handleStartInitiated = () => setIsAwaitingStartResult(true);
  const handleStopInitiated = () => setIsAwaitingStopResult(true);
  const handleRestartInitiated = () => setIsAwaitingRestartResult(true);

  useEffect(() => {
    // Handle Start result
    if (isAwaitingStartResult && serverStatus === "online") {
      setToastState({
        type: "success",
        message: "Servidor iniciado com sucesso!",
      });
      setIsAwaitingStartResult(false);
    } else if (isAwaitingStartResult && serverStatus === "offline") {
      // e.g., start failed?
      setToastState({ type: "error", message: "Falha ao iniciar o servidor" });
      setIsAwaitingStartResult(false);
    }

    // Handle Stop result
    if (isAwaitingStopResult && serverStatus === "offline") {
      setToastState({
        type: "success",
        message: "Servidor parado com sucesso!",
      });
      setIsAwaitingStopResult(false);
    } else if (isAwaitingStopResult && serverStatus === "online") {
      // e.g., stop failed?
      setToastState({ type: "error", message: "Falha ao parar o servidor" });
      setIsAwaitingStopResult(false);
    }

    // Handle Restart result (more complex, depends on final state - likely 'online')
    if (isAwaitingRestartResult && serverStatus === "online") {
      setToastState({
        type: "success",
        message: "Servidor reiniciado com sucesso!",
      });
      setIsAwaitingRestartResult(false);
    } else if (isAwaitingRestartResult && serverStatus === "offline") {
      // e.g., restart failed?
      setToastState({
        type: "error",
        message: "Falha ao reiniciar o servidor",
      });
      setIsAwaitingRestartResult(false);
    }
  }, [
    serverStatus,
    isAwaitingStartResult,
    isAwaitingStopResult,
    isAwaitingRestartResult,
    setToastState,
  ]);
  return (
    <div>
      <LoadingScreen fadeOut={serverStatus !== undefined} />
      <div className="flex gap-1.5">
        <StartButton onStartInitiated={handleStartInitiated} />
        <RestartButton onRestartInitiated={handleRestartInitiated} />
        <StopButton onStopInitiated={handleStopInitiated} />
      </div>
    </div>
  );
}
