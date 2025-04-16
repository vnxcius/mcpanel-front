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
  const { state, setState } = useServerAction();
  const [isPending, startTransition] = useTransition();
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleVerifyToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (token.length <= 0) {
      return setState({
        warning: true,
        message: "Preencha o token corretamente",
      });
    }

    startTransition(async () => {
      const res = await fetch("http://localhost:4000/v1/verify-token", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setState({ error: true, message: data.message });
      }

      setState({
        success: true,
        message: "Token verificado. Redirecionando...",
      });

      setTimeout(() => {
        router.refresh();
        setState(initialState);
      }, 1000);
    });
  };

  useEffect(() => {
    if (state.error || state.warning) {
      setState(initialState);
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
      <button
        type="submit"
        aria-disabled={isPending}
        disabled={isPending}
        className="after:bg-button-shadow relative w-full cursor-pointer border-2 border-black bg-neutral-300 px-6 pt-2 pb-3 text-center text-neutral-800 transition-colors after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full hover:translate-y-px hover:bg-neutral-300/90 hover:after:h-[3px]"
      >
        {isPending ? "Verificando..." : "Verificar token"}
      </button>
    </form>
  );
}
