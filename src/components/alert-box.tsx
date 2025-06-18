"use client";

import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

export default function AlertBox() {
  const { toastState, setToastState } = useToast();

  if (!toastState.message) return null;
  return (
    <div
      className={cn(
        "relative flex w-1/2 max-w-lg items-center space-x-2 border-2 border-black",
        "after:bottom-0 after:left-0 after:h-1 after:w-full",
        "px-3 pt-1.5 pb-2.5 text-sm after:absolute",
        toastState.type === "error" &&
          "bg-rose-600 text-neutral-100 before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-rose-500 before:brightness-125 after:bg-rose-500 after:brightness-50",
        toastState.type === "warning" &&
          "bg-yellow-600 text-neutral-800 before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-yellow-600 before:brightness-125 after:bg-yellow-600 after:brightness-50",
        toastState.type === "success" &&
          "bg-green-500 text-neutral-800 before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-green-500 before:brightness-125 after:bg-green-800",
        toastState.type === "info" &&
          "bg-sky-500 text-neutral-800 before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-sky-500 before:brightness-125 after:bg-sky-800",
      )}
    >
      {toastState.type === "error" && (
        <XCircleIcon size={16} weight="bold" className="min-w-4" />
      )}
      {toastState.type === "warning" && (
        <WarningIcon size={16} weight="bold" className="min-w-4" />
      )}
      {toastState.type === "success" && (
        <CheckCircleIcon size={16} weight="bold" className="min-w-4" />
      )}
      {toastState.type === "info" && (
        <InfoIcon size={16} weight="bold" className="min-w-4" />
      )}
      <p>{toastState.message}</p>

      <button
        className="ml-auto cursor-pointer"
        onClick={() => setToastState({ ...toastState, message: "" })}
      >
        {<XIcon size={16} weight="bold" />}
      </button>
    </div>
  );
}
