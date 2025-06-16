"use client";

import { useEffect, useTransition } from "react";
import { useServerAction } from "@/contexts/ServerActionContext";
import AlertBox from "./alert-box";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSound from "use-sound";

const initialState = {
  type: undefined,
  message: "",
};

export default function TokenInput() {
  const { actionState, setActionState } = useServerAction();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });
  const [bass] = useSound("/sounds/noteblock_bass.mp3", { volume: 0.1 });
  const [successful_hit] = useSound("/sounds/successful_hit.ogg", {
    volume: 0.2,
  });
  const [thorns] = useSound("/sounds/thorns.mp3", { volume: 0.1 });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    click();
    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      console.log("Data not valid:", validation.error);
      return setActionState({
        type: "error",
        message: validation.error.issues[0].message,
      });
    }
    startTransition(async () => {
      try {
        const resp = await fetch("/api/auth/sign-in", {
          method: "POST",
          body: JSON.stringify(data),
        });

        if (!resp.ok) {
          thorns();
          const data = await resp.json();
          return setActionState({
            type: data.type || "error",
            message: data.message || data.error,
          });
        }

        successful_hit();
        setActionState({
          type: "success",
          message: "Senha verificada. Redirecionando...",
        });

        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } catch (error) {
        thorns();
        if (error instanceof Error) {
          return setActionState({ type: "error", message: error.message });
        }

        return setActionState({
          type: "error",
          message: "Erro ao verificar senha",
        });
      }
    });
  };

  const onInvalid = (errors: typeof form.formState.errors) => {
    const firstError = errors.password?.message;
    if (firstError) {
      setActionState({
        type: "warning",
        message: firstError,
      });
      bass();
    }
  };

  useEffect(() => {
    if (actionState.type === "error" || actionState.type === "warning") {
      setActionState(initialState);
    }
  }, [form.watch("password")]);
  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="my-4">
      <div className="mt-14 mb-2 space-y-2">
        <label className="text-md block text-neutral-300">Senha</label>

        <input
          type="text"
          id="password"
          className={cn(
            "w-full border-2 border-neutral-700 bg-black p-3",
            "text-neutral-50 placeholder:text-neutral-500 focus:outline-none",
            actionState.type === "error" && "border-red-500",
            actionState.type === "warning" && "border-yellow-500",
          )}
          autoComplete="off"
          placeholder="Insira a frase-chave aqui"
          {...form.register("password")}
          autoFocus
        />
        <AlertBox />
      </div>
      <button
        type="submit"
        aria-disabled={isPending}
        disabled={isPending}
        className="after:bg-button-shadow relative ml-auto block w-40 cursor-pointer border-2 border-black bg-neutral-300 px-6 pt-2 pb-3 text-center text-neutral-800 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-neutral-300 before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full hover:translate-y-px hover:bg-neutral-300/90 hover:after:h-[3px] disabled:bg-neutral-500 disabled:before:bg-neutral-300/50"
      >
        {isPending ? "Verificando..." : "Verificar"}
      </button>
    </form>
  );
}
