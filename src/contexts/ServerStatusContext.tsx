"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useServerAction } from "./ServerActionContext";
import useSound from "use-sound";

export type ServerStatus =
  | "starting"
  | "online"
  | "offline"
  | "restarting"
  | "stopping"
  | undefined;

interface ServerStatusContextType {
  serverStatus: ServerStatus;
}

const ServerStatusContext = createContext<ServerStatusContextType>({
  serverStatus: undefined,
});

export const useServerStatus = () => useContext(ServerStatusContext);

export function ServerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serverStatus, setServerStatus] = useState<ServerStatus>(undefined);
  const eventSourceRef = useRef<EventSource | null>(null);
  const { setActionState } = useServerAction();

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) return console.error("NEXT_PUBLIC_SERVER_URL not found.");

    eventSourceRef.current = new EventSource(
      serverUrl + "/v2/server-status-stream",
    );

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.status) {
          const newStatus = data.status as ServerStatus;
          console.log("SSE Received Status:", newStatus);
          setServerStatus(newStatus);
        }
      } catch (error) {
        console.error("Failed to parse SSE message:", event.data, error);
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSourceRef.current?.close();
      setServerStatus("offline");
      setActionState({
        type: "error",
        message:
          "Conexão com API foi encerrada. Atualize a página ou tente novamente.",
      });
    };

    eventSourceRef.current.onopen = () => {
      console.log("EventSource connection established.");
    };

    return () => {
      console.log("Closing EventSource.");
      eventSourceRef.current?.close();
    };
  }, []);

  return (
    <ServerStatusContext.Provider value={{ serverStatus }}>
      {children}
    </ServerStatusContext.Provider>
  );
}
