"use client";

import { createContext, useContext, useState } from "react";

export type ServerStatus = "starting" | "online" | "offline" | "restarting";

interface ServerStatusContextType {
  serverStatus: ServerStatus;
  setServerStatus: (serverStatus: ServerStatus) => void;
}

const ServerStatusContext = createContext<ServerStatusContextType>({
  serverStatus: "offline",
  setServerStatus: () => {},
});

export const useServerStatus = () => useContext(ServerStatusContext);

export function ServerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serverStatus, setServerStatus] = useState<ServerStatus>("offline");

  return (
    <ServerStatusContext.Provider value={{ serverStatus, setServerStatus }}>
      {children}
    </ServerStatusContext.Provider>
  );
}
