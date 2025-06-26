"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";

export interface ModChangelog {
  name: string;
  time: Date;
  type: string;
}

const ModChangelogContext = createContext<ModChangelog[]>([]);
export const useModChangelog = () => useContext(ModChangelogContext);

export function ModChangelogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [changes, setChanges] = useState<ModChangelog[]>([]);
  const { addListener } = useWebSocket();

  useEffect(
    () =>
      addListener(
        (m) => m.type === "modlist_changelog_update" && setChanges(m.payload),
      ),
    [addListener],
  );

  return (
    <ModChangelogContext.Provider value={changes}>
      {children}
    </ModChangelogContext.Provider>
  );
}
