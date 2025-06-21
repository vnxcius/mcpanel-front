"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Mod } from "@/components/modlist";

const ModlistContext = createContext<Mod[]>([]);
export const useModlist = () => useContext(ModlistContext);

export function ModlistProvider({ children }: { children: React.ReactNode }) {
  const [mods, setMods] = useState<Mod[]>([]);
  const { addListener } = useWebSocket();

  useEffect(
    () =>
      addListener(
        (m) => m.type === "modlist_update" && setMods(m.payload.mods),
      ),
    [addListener],
  );

  return (
    <ModlistContext.Provider value={mods}>{children}</ModlistContext.Provider>
  );
}
