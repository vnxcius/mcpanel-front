"use client";

import RestartButton from "@/components/restart-button";
import StartButton from "@/components/start-button";
import StopButton from "@/components/stop-button";
import { useServerStatus } from "@/contexts/ServerStatusContext";
import RemoveTokenButton from "./remove-token-button";
import AlertBox from "./alert-box";

export default function ButtonGroup() {
  const { serverStatus } = useServerStatus();
  return (
    <>
      <div className="my-4 flex flex-col gap-y-3.5">
        {(serverStatus === "offline" || serverStatus === "starting") && <StartButton />}
        {(serverStatus === "online" || serverStatus === "restarting") && (
          <div className="flex justify-between gap-x-3.5">
            <RestartButton />
            <StopButton />
          </div>
        )}
      </div>
      <AlertBox />
      <RemoveTokenButton />
    </>
  );
}
