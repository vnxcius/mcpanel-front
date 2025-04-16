"use client";

import { useServerAction } from "@/contexts/ServerActionContext";
import { cn } from "@/lib/utils";
import { CheckCircle, Warning, X, XCircle } from "@phosphor-icons/react";

export default function AlertBox() {
  const { state, setState } = useServerAction();

  if (!state.message) return null;
  return (
    <div
      className={cn(
        "relative mb-4 flex items-center space-x-2 border-2 border-black",
        "after:bottom-0 after:left-0 after:h-1 after:w-full",
        "px-3 pt-1.5 pb-2.5 text-sm after:absolute",
        state.error &&
          "bg-red-500 text-neutral-100 after:bg-red-500 after:brightness-50",
        state.warning &&
          "bg-amber-400 text-neutral-800 after:bg-amber-400 after:brightness-50",
        state.success && "bg-green-500 text-neutral-800 after:bg-green-800",
      )}
    >
      {state.error && <XCircle size={16} weight="bold" />}
      {state.warning && <Warning size={16} weight="bold" />}
      {state.success && <CheckCircle size={16} weight="bold" />}
      <p>{state.message}</p>

      <button
        className="ml-auto cursor-pointer"
        onClick={() => setState({ ...state, message: "" })}
      >
        {<X size={16} weight="bold" />}
      </button>
    </div>
  );
}
