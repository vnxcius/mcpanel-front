"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";
import { Mod } from "@/components/modlist";

export interface ModChangelog {
  name: string;
  time: Date;
  type: string;
}

type ModlistData = {
  mods: Mod[];
  changelog: ModChangelog[];
};

const ModlistContext = createContext<ModlistData>({
  mods: [],
  changelog: [],
});

export const useModlist = () => useContext(ModlistContext);

export function ModlistProvider({ children }: { children: React.ReactNode }) {
  const [mods, setMods] = useState<Mod[]>([]);
  const [changelog, setChangelog] = useState<ModChangelog[]>([]);
  const { addListener } = useWebSocket();

  function parseModName(name: string): Mod {
    return {
      name,
      size: 0,
      modTime: Date.now() / 1000,
    };
  }

  useEffect(() => {
    return addListener((m) => {
      if (m.type === "modlist") {
        setMods(m.payload.mods);
        return;
      }

      if (m.type === "modlist_changelog") {
        setChangelog(m.payload);
        return;
      }

      if (m.type === "mod_added") {
        const entries = Array.isArray(m.payload) ? m.payload : [m.payload];
        setMods((prev) => [
          ...(prev ?? []),
          ...entries.map((entry) => parseModName(entry.name)),
        ]);
        return;
      }

      if (m.type === "mod_deleted") {
        setMods((prev) => prev.filter((mod) => mod.name !== m.payload.name));
        return;
      }

      if (m.type === "mod_updated") {
        const [from, to] = m.payload.name.split(" → ");
        if (!from || !to) return;
        setMods((prev) =>
          prev.filter((mod) => mod.name !== from).concat(parseModName(to)),
        );
      }
    });
  }, [addListener]);

  return (
    <ModlistContext.Provider value={{ mods, changelog }}>
      {children}
    </ModlistContext.Provider>
  );
}
