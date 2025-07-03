"use client";

import { WebSocketProvider } from "./WebSocketProvider";
import { StatusProvider } from "./StatusProvider";
import { ModlistProvider } from "./ModlistProvider";
import { LogProvider } from "./LogProvider";

export function ServerProviders({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketProvider>
      <StatusProvider>
        <ModlistProvider>
          <LogProvider>{children}</LogProvider>
        </ModlistProvider>
      </StatusProvider>
    </WebSocketProvider>
  );
}
