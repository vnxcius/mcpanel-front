"use client";

import { createContext, useContext, useState } from "react";

export interface ServerActionState {
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  message: string;
}

const initialState: ServerActionState = {
  success: false,
  error: false,
  warning: false,
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
