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

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  let retrying = false;

  const clamp350 = (lines: string[]) =>
    lines.length > 350 ? lines.slice(-350) : lines;

  const mergeNewLines = (prev: string[], incoming: string[]) =>
    clamp350([...prev, ...incoming]);

  const handleWebSocketMessage = ({ data }: { data: string }) => {
    try {
      const msg = JSON.parse(data);

      switch (msg.type) {
        case "status_update":
          setServerStatus(msg.payload.status);
          break;
        case "modlist_update":
          setModlist(msg.payload.mods);
          break;

        case "log_snapshot":
          setLogLines(clamp350(msg.payload.lines));
          break;

        case "log_append":
          setLogLines((prev) => mergeNewLines(prev, msg.payload.lines));
          break;
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!serverUrl) {
      console.error("NEXT_PUBLIC_API_URL not found.");
      return;
    }

    const connect = () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      const ws = new WebSocket(serverUrl + "/api/v2/ws");
      webSocketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established.");
        if (retrying) {
          retrying = false;
          setToastState({
            type: "success",
            message: "Conexão reestabelecida.",
          });
        }
      };

      ws.onmessage = handleWebSocketMessage;

      const scheduleReconnect = () => {
        if (!retryTimeoutRef.current) {
          retryTimeoutRef.current = setTimeout(connect, 5000);
        }
      };

      ws.onerror = (e) => {
        setServerStatus("error");
        setToastState({
          type: "error",
          message: "Conexão com API foi perdida. Tentando reconectar...",
        });
        ws.close();
      };

      ws.onclose = (e) => {
        retrying = true;
        console.warn("WebSocket closed. Reconnecting in 5s...", e.reason);
        setToastState({
          type: "error",
          message: "Conexão com API foi perdida. Tentando reconectar...",
        });
        scheduleReconnect();
      };
    };

    connect();

    return () => {
      console.log("Cleaning up WebSocket and timeout.");
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      webSocketRef.current?.close();
    };
  }, []);

  return (
    <ServerStatusContext.Provider value={{ serverStatus, modlist, logLines }}>
      {children}
    </ServerStatusContext.Provider>
  );
}
