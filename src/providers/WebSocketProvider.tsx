"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import { ServerStatus, useServerStatus } from "./StatusProvider";
import { Mod } from "@/components/modlist";
import { ModChangelog } from "./ModChangelogProvider";

type WSMsg =
  | { type: "status_update"; payload: { status: ServerStatus } }
  | { type: "modlist_update"; payload: { mods: Mod[] } }
  | { type: "log_snapshot"; payload: { lines: string[] } }
  | { type: "log_append"; payload: { lines: string[] } }
  | {
      type: "modlist_changelog_update";
      payload: [ModChangelog];
    };

interface WSContext {
  addListener(cb: (m: WSMsg) => void): () => void;
  send(data: unknown): void;
}

const WebSocketContext = createContext<WSContext>({
  addListener: () => () => {},
  send: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { setToastState } = useToast();
  const { setStatus } = useServerStatus();
  const listeners = useRef(new Set<(m: WSMsg) => void>());
  const wsRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retrying = useRef(false);

  const broadcast = (m: WSMsg) => listeners.current.forEach((l) => l(m));

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) return;

    const connect = () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      wsRef.current = new WebSocket(url + "/api/v2/ws");

      const handleToastReset = () => {
        setToastState({ type: undefined, message: "" });
      };

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established.");
        if (retrying.current === true) {
          retrying.current = false;
          setToastState({
            type: "success",
            message: "Conexão reestabelecida.",
          });

          setTimeout(handleToastReset, 5000);
        }
      };

      wsRef.current.onmessage = (e) => broadcast(JSON.parse(e.data));

      wsRef.current.onerror = () => {
        setStatus("error");
        setToastState({
          type: "error",
          message: "Conexão com API foi perdida. Tentando reconectar...",
        });
        wsRef.current?.close();
      };

      const scheduleReconnect = () => {
        if (!retryTimeoutRef.current) {
          retryTimeoutRef.current = setTimeout(connect, 5000);
        }
      };

      wsRef.current.onclose = (e) => {
        retrying.current = true;
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
      clearTimeout(retryTimeoutRef.current as NodeJS.Timeout);
      wsRef.current?.close();
    };
  }, []);

  const addListener = (cb: (m: WSMsg) => void) => {
    listeners.current.add(cb);
    return () => listeners.current.delete(cb);
  };

  const send = (d: unknown) => wsRef.current?.send(JSON.stringify(d));

  return (
    <WebSocketContext.Provider value={{ addListener, send }}>
      {children}
    </WebSocketContext.Provider>
  );
}
