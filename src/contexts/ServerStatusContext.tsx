"use client";

import { createContext, useContext, useState } from "react";

export type ServerStatus = "starting" | "online" | "offline" | "restarting";

interface ServerStatusContextType {
  status: ServerStatus;
  setStatus: (status: ServerStatus) => void;
}

const ServerStatusContext = createContext<ServerStatusContextType>({
  status: "offline",
  setStatus: () => {},
});

export const useServerStatus = () => useContext(ServerStatusContext);

export function ServerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<ServerStatus>("offline");

  return (
    <ServerStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </ServerStatusContext.Provider>
  );
}
