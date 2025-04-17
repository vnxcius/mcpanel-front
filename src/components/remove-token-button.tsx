"use client";

import { removeToken } from "@/app/actions";
import { cn } from "@/lib/utils";
import { Trash } from "@phosphor-icons/react";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], display: "swap", weight: "400" });

export default function RemoveTokenButton() {
  return (
    <button
      className={cn(
        geist.className,
        "mx-auto mt-20 flex w-fit cursor-pointer items-center gap-1 text-sm",
        "text-red-400 hover:underline underline-offset-2",
      )
      }
      onClick={() =>
        confirm(
          "Você perderá acesso ao servidor e será necessário inserir o token novamente. Confirmar?",
        ) && removeToken()
      }
    >
      <Trash size={16} weight="fill" />
      Deletar token
    </button>
  );
}
