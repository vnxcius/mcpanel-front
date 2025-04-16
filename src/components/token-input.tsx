"use client";

import { storeToken } from "@/app/actions";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { useServerAction } from "@/contexts/ServerActionContext";
import AlertBox from "./alert-box";

const initialState = {
  error: false,
  warning: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="after:bg-button-shadow relative w-full cursor-pointer border-2 border-black bg-neutral-300 px-6 pt-2 pb-3 text-center text-neutral-800 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full hover:translate-y-px hover:bg-neutral-300/90 hover:after:h-[3px]"
    >
      {pending ? "Verificando..." : "Verificar token"}
    </button>
  );
}

export default function TokenInput() {
  const { state, setState } = useServerAction();
  const [_, formAction] = useActionState(
    async (prevState: { message: string }, formData: FormData) => {
      const state = await storeToken(prevState, formData);
      setState(state);
      return state;
    },
    initialState,
  );
  const [token, setToken] = useState("");

  useEffect(() => {
    if (state.error || state.warning) {
      setState(initialState);
    }
  }, [token]);
  return (
    <form action={formAction} className="my-4">
      <div className="my-14 space-y-2">
        <label className="block text-sm text-neutral-300">
          Token de acesso
        </label>

        <input
          type="text"
          name="token"
          id="token"
          className={cn(
            "w-full border-2 border-neutral-700 bg-black p-3",
            "text-neutral-50 placeholder:text-neutral-500 focus:outline-none",
            state.error && "border-red-500",
            state.warning && "border-yellow-500",
          )}
          autoComplete="off"
          placeholder="Insira o token aqui"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoFocus
        />
        <AlertBox />
      </div>
      <SubmitButton />
    </form>
  );
}
