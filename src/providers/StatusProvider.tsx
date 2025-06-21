"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";

export type ServerStatus =
  | "starting"
  | "online"
  | "offline"
  | "restarting"
  | "stopping"
  | "error"
  | undefined;

const StatusContext = createContext<{
  status: ServerStatus | undefined;
  setStatus: (status: ServerStatus) => void;
}>({
  status: undefined,
  setStatus: () => {},
});
export const useServerStatus = () => useContext(StatusContext);

export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ServerStatus>(undefined);
  const { addListener } = useWebSocket();

  useEffect(
    () =>
      addListener(
        (m) => m.type === "status_update" && setStatus(m.payload.status),
      ),
    [addListener],
  );

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
}
