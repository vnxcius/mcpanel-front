"use client";

import RestartButton from "@/components/restart-button";
import StartButton from "@/components/start-button";
import StopButton from "@/components/stop-button";
import { useServerStatus } from "@/contexts/ServerStatusContext";
import RemoveTokenButton from "./remove-token-button";
import AlertBox from "./alert-box";
import { useEffect, useState } from "react";
import { useServerAction } from "@/contexts/ServerActionContext";

export default function ButtonGroup() {
  const { serverStatus } = useServerStatus();

  const { setActionState } = useServerAction();
  const [isAwaitingStartResult, setIsAwaitingStartResult] = useState(false);
  const [isAwaitingStopResult, setIsAwaitingStopResult] = useState(false);
  const [isAwaitingRestartResult, setIsAwaitingRestartResult] = useState(false);

  const handleStartInitiated = () => setIsAwaitingStartResult(true);
  const handleStopInitiated = () => setIsAwaitingStopResult(true);
  const handleRestartInitiated = () => setIsAwaitingRestartResult(true);

  useEffect(() => {
    // Handle Start result
    if (isAwaitingStartResult && serverStatus === "online") {
      setActionState({
        success: true,
        message: "Servidor iniciado com sucesso!",
      });
      setIsAwaitingStartResult(false);
    }

    // Handle Stop result
    if (isAwaitingStopResult && serverStatus === "offline") {
      setActionState({
        success: true,
        message: "Servidor parado com sucesso!",
      });
      setIsAwaitingStopResult(false);
    } else if (isAwaitingStopResult && serverStatus === "online") {
      // e.g., stop failed?
      setActionState({ error: true, message: "Falha ao parar o servidor." });
      setIsAwaitingStopResult(false);
    }

    // Handle Restart result (more complex, depends on final state - likely 'online')
    if (isAwaitingRestartResult && serverStatus === "online") {
      setActionState({
        success: true,
        message: "Servidor reiniciado com sucesso!",
      });
      setIsAwaitingRestartResult(false);
    }
  }, [
    serverStatus,
    isAwaitingStartResult,
    isAwaitingStopResult,
    isAwaitingRestartResult,
    setActionState,
  ]);
  return (
    <>
      <div className="my-4 flex flex-col gap-y-3.5">
        {(serverStatus === "offline" || serverStatus === "starting") && (
          <StartButton onStartInitiated={handleStartInitiated} />
        )}
        {serverStatus !== "offline" && serverStatus !== "starting" && (
          <div className="flex justify-between gap-x-3.5">
            <RestartButton onRestartInitiated={handleRestartInitiated} />
            <StopButton onStopInitiated={handleStopInitiated} />
          </div>
        )}
      </div>
      <AlertBox />
      <RemoveTokenButton />
    </>
  );
}
