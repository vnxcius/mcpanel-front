"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useToast } from "./ToastContext";
import { Mod } from "@/components/modlist";

export type ServerStatus =
  | "starting"
  | "online"
  | "offline"
  | "restarting"
  | "stopping"
  | "error"
  | undefined;

interface ServerStatusContextType {
  serverStatus: ServerStatus;
  modlist: Mod[];
  logLines: string[];
}

const ServerStatusContext = createContext<ServerStatusContextType>({
  serverStatus: undefined,
  modlist: [],
  logLines: [],
});

export const useServerStatus = () => useContext(ServerStatusContext);

export function ServerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serverStatus, setServerStatus] = useState<ServerStatus>(undefined);
  const [modlist, setModlist] = useState<Mod[]>([]);
  const [logLines, setLogLines] = useState<string[]>([]);

  const webSocketRef = useRef<WebSocket | null>(null);
  const { setToastState } = useToast();

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!serverUrl) return console.error("NEXT_PUBLIC_API_URL not found.");

    webSocketRef.current = new WebSocket(serverUrl + "/api/v2/ws");

    webSocketRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "status_update":
          setServerStatus(msg.payload.status);
          break;
        case "modlist_update":
          setModlist(msg.payload.mods);
          break;
        case "log_snapshot": // first 200 lines on connect
          setLogLines(msg.payload.lines);
          break;
        case "log_append": // one new line
          setLogLines((prev) => {
            const next = [...prev, ...msg.payload.lines];
            return next.length > 200 ? next.slice(-200) : next;
          });
          break;
      }
    };

    webSocketRef.current.onerror = (error) => {
      console.error("WebSocket failed:", error);
      webSocketRef.current?.close();
      setServerStatus("error");
      setToastState({
        type: "error",
        message:
          "Conexão com API foi perdida. Atualize a página ou tente novamente.",
      });
    };

    webSocketRef.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    return () => {
      console.log("Closing WebSocket connection.");
      webSocketRef.current?.close();
    };
  }, []);

  return (
    <ServerStatusContext.Provider value={{ serverStatus, modlist, logLines }}>
      {children}
    </ServerStatusContext.Provider>
  );
}
