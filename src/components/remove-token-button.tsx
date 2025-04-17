"use client";

import { cn } from "@/lib/utils";
import { Trash } from "@phosphor-icons/react";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], display: "swap", weight: "400" });

export default function RemoveTokenButton() {
  const handleRemoveToken = () => {
    if (window.confirm("Tem certeza que deseja deletar o token?")) {
      localStorage.removeItem("sss-token");
      window.location.reload();
    }
  };
  return (
    <button
      className={cn(
        geist.className,
        "mx-auto mt-20 flex w-fit cursor-pointer items-center gap-1 text-sm",
        "text-red-400 underline-offset-2 hover:underline",
      )}
      onClick={handleRemoveToken}
    >
      <Trash size={16} weight="fill" />
      Deletar token
    </button>
  );
}
