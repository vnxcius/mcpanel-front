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
  state: ServerActionState;
  setState: (state: ServerActionState) => void;
}>({
  state: initialState,
  setState: () => {},
});

export const useServerAction = () => useContext(ServerActionContext);

export function ServerActionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ServerActionState>(initialState);

  return (
    <ServerActionContext.Provider value={{ state, setState }}>
      {children}
    </ServerActionContext.Provider>
  );
}
