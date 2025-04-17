"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

export type ServerStatus =
  | "starting"
  | "online"
  | "offline"
  | "restarting"
  | "stopping";

interface ServerStatusContextType {
  serverStatus: ServerStatus;
  // setServerStatus: (serverStatus: ServerStatus) => void;
}

const ServerStatusContext = createContext<ServerStatusContextType>({
  serverStatus: "offline",
  // setServerStatus: () => {},
});

export const useServerStatus = () => useContext(ServerStatusContext);

export function ServerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [serverStatus, setServerStatus] = useState<ServerStatus>("offline");
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    console.log("Setting up event source...");
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) return console.error("NEXT_PUBLIC_SERVER_URL not found.");

    eventSourceRef.current = new EventSource(serverUrl + "/v1/sse");

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
      eventSourceRef.current?.close(); // Close on error to prevent flood
      setServerStatus("offline");
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
