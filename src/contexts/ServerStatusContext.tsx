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
}

const ServerStatusContext = createContext<ServerStatusContextType>({
  serverStatus: undefined,
  modlist: [],
});

export const useServerStatus = () => useContext(ServerStatusContext);

export function ServerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serverStatus, setServerStatus] = useState<ServerStatus>(undefined);
  const [modlist, setModlist] = useState<Mod[]>([]);

  const webSocketRef = useRef<WebSocket | null>(null);
  const { setToastState } = useToast();

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!serverUrl) return console.error("NEXT_PUBLIC_API_URL not found.");

    webSocketRef.current = new WebSocket(serverUrl + "/api/v2/ws");

    webSocketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "status_update") {
          console.log("Received status update:", data.payload.status);
          setServerStatus(data.payload.status);
        }

        if (data.type === "modlist_update") {
          console.log("Received modlist update:", data.payload.mods);
          setModlist(data.payload.mods);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    webSocketRef.current.onerror = (error) => {
      console.error("WebSocket failed:", error);
      webSocketRef.current?.close();
      setServerStatus("error");
      setToastState({
        type: "error",
        message:
          "Conexão com API foi encerrada. Atualize a página ou tente novamente.",
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
    <ServerStatusContext.Provider value={{ serverStatus, modlist }}>
      {children}
    </ServerStatusContext.Provider>
  );
}
