"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";

const clamp = (l: string[]) => (l.length > 350 ? l.slice(-350) : l);

const LogContext = createContext<string[]>([]);
export const useLogLines = () => useContext(LogContext);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logLines, setLogLines] = useState<string[]>([]);
  const { addListener } = useWebSocket();

  useEffect(
    () =>
      addListener((m) => {
        if (m.type === "log_snapshot") setLogLines(clamp(m.payload.lines));
        if (m.type === "log_append")
          setLogLines((prev) => clamp([...prev, ...m.payload.lines]));
      }),
    [addListener],
  );

  return <LogContext.Provider value={logLines}>{children}</LogContext.Provider>;
}
