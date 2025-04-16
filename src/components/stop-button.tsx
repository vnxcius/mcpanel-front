"use client";

import { stopServer } from "@/app/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Square } from "@phosphor-icons/react";
import { useServerAction } from "@/contexts/ServerActionContext";

const initialState = {
  success: false,
  error: false,
  warning: false,
  message: "",
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending || disabled}
      disabled={pending || disabled}
      className="relative flex w-full cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-red-500 pt-2 pb-3 text-neutral-100 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500 after:brightness-50 hover:translate-y-px hover:bg-red-500/90 hover:after:h-[3px] disabled:bg-red-500/50"
    >
      <Square
        size={14}
        weight="fill"
        className={pending ? "animate-pulse" : ""}
      />
      {pending ? "Desligando..." : "Desligar servidor"}
    </button>
  );
}

export default function StopButton() {
  const { setState } = useServerAction();
  const [_, formAction] = useActionState(async () => {
    const state = await stopServer();
    setState(state);
    return state;
  }, initialState);

  return (
    <form action={formAction} className="flex-1">
      <SubmitButton />
    </form>
  );
}
