"use client";

import { useServerAction } from "@/contexts/ServerActionContext";
import { cn } from "@/lib/utils";
import { CheckCircle, Warning, X, XCircle } from "@phosphor-icons/react";

export default function AlertBox() {
  const { actionState, setActionState } = useServerAction();

  if (!actionState.message) return null;
  return (
    <div
      className={cn(
        "relative mb-4 flex items-center space-x-2 border-2 border-black",
        "after:bottom-0 after:left-0 after:h-1 after:w-full",
        "px-3 pt-1.5 pb-2.5 text-sm after:absolute",
        actionState.error &&
          "bg-red-500 text-neutral-100 after:bg-red-500 after:brightness-50",
        actionState.warning &&
          "bg-orange-400 text-neutral-100 after:bg-orange-400 after:brightness-50",
        actionState.success &&
          "bg-green-500 text-neutral-800 after:bg-green-800",
      )}
    >
      {actionState.error && <XCircle size={16} weight="bold" />}
      {actionState.warning && <Warning size={16} weight="bold" />}
      {actionState.success && <CheckCircle size={16} weight="bold" />}
      <p>{actionState.message}</p>

      <button
        className="ml-auto cursor-pointer"
        onClick={() => setActionState({ ...actionState, message: "" })}
      >
        {<X size={16} weight="bold" />}
      </button>
    </div>
  );
}
