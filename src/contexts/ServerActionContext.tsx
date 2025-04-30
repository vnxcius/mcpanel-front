"use client";

import { createContext, useContext, useState } from "react";

type ServerActionType = "success" | "error" | "warning" | undefined;
export interface ServerActionState {
  type: ServerActionType;
  message: string;
}

const initialState: ServerActionState = {
  type: undefined,
  message: "",
};

const ServerActionContext = createContext<{
  actionState: ServerActionState;
  setActionState: (actionState: ServerActionState) => void;
}>({
  actionState: initialState,
  setActionState: () => {},
});

export const useServerAction = () => useContext(ServerActionContext);

export function ServerActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [actionState, setActionState] =
    useState<ServerActionState>(initialState);
  return (
    <ServerActionContext.Provider value={{ actionState, setActionState }}>
      {children}
    </ServerActionContext.Provider>
  );
}
