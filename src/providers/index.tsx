"use client";

import { WebSocketProvider } from "./WebSocketProvider";
import { StatusProvider } from "./StatusProvider";
import { ModlistProvider } from "./ModlistProvider";
import { LogProvider } from "./LogProvider";
import { ModChangelogProvider } from "./ModChangelogProvider";

export function ServerProviders({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketProvider>
      <StatusProvider>
        <ModlistProvider>
          <ModChangelogProvider>
            <LogProvider>{children}</LogProvider>
          </ModChangelogProvider>
        </ModlistProvider>
      </StatusProvider>
    </WebSocketProvider>
  );
}
