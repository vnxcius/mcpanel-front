"use client";

import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useServerAction } from "@/contexts/ServerActionContext";
import AlertBox from "./alert-box";
import { useRouter } from "next/navigation";

const initialState = {
  error: false,
  warning: false,
  message: "",
};

export default function TokenInput() {
  const { actionState, setActionState } = useServerAction();
  const [isPending, startTransition] = useTransition();
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleVerifyToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (token.length <= 0) {
      return setActionState({
        warning: true,
        message: "Preencha o token corretamente",
      });
    }

    startTransition(async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL + "/v1/verify-token",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          },
        );

        if (!res.ok) {
          const data = await res.json();
          return setActionState({ error: true, message: data.message });
        }

        setActionState({
          success: true,
          message: "Token verificado. Redirecionando...",
        });

        setTimeout(() => {
          router.refresh();
          setActionState(initialState);
        }, 1000);
      } catch (error) {
        if (error instanceof Error) {
          return setActionState({ error: true, message: error.message });
        }

        return setActionState({
          error: true,
          message: "Erro ao verificar token",
        });
      }
    });
  };

  useEffect(() => {
    if (actionState.error || actionState.warning) {
      setActionState(initialState);
    }
  }, [token]);
  return (
    <form onSubmit={handleVerifyToken} className="my-4">
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
            actionState.error && "border-red-500",
            actionState.warning && "border-yellow-500",
          )}
          autoComplete="off"
          placeholder="Insira o token aqui"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoFocus
        />
        <AlertBox />
      </div>
      <button
        type="submit"
        aria-disabled={isPending}
        disabled={isPending}
        className="after:bg-button-shadow relative w-full cursor-pointer border-2 border-black bg-neutral-300 px-6 pt-2 pb-3 text-center text-neutral-800 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-neutral-300 before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full hover:translate-y-px hover:bg-neutral-300/90 hover:after:h-[3px] disabled:bg-neutral-500 disabled:before:bg-neutral-300/50"
      >
        {isPending ? "Verificando..." : "Verificar token"}
      </button>
    </form>
  );
}
