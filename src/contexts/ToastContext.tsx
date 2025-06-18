"use client";

import { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info" | undefined;
export interface ToastState {
  type: ToastType;
  message: string;
}

const initialState: ToastState = {
  type: undefined,
  message: "",
};

const ToastContext = createContext<{
  toastState: ToastState;
  setToastState: (toastState: ToastState) => void;
}>({
  toastState: initialState,
  setToastState: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toastState, setToastState] = useState<ToastState>(initialState);
  return (
    <ToastContext.Provider value={{ toastState, setToastState }}>
      {children}
    </ToastContext.Provider>
  );
}
