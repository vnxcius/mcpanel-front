"use client";

import { cn, verifyToken } from "@/lib/utils";
import { SignOut } from "@phosphor-icons/react";
import { Geist } from "next/font/google";
import { useEffect, useState } from "react";

const geist = Geist({ subsets: ["latin"], display: "swap", weight: "400" });

export default function RemoveTokenButton() {
  const [isValidToken, setIsValidToken] = useState<boolean>();
  const handleRemoveToken = () => {
    if (window.confirm("Tem certeza que deseja deletar o token?")) {
      localStorage.removeItem("sss-token");
      window.location.reload();
    }
  };
  async function validateToken() {
    const validToken = await verifyToken();
    setIsValidToken(validToken);
  }

  useEffect(() => {
    validateToken();
  }, []);
  return (
    isValidToken && (
      <button
        className={cn(
          geist.className,
          "flex w-fit cursor-pointer items-center gap-1 text-sm",
          "text-rose-500 underline-offset-2 hover:underline",
        )}
        onClick={handleRemoveToken}
      >
        <SignOut size={20} weight="fill" />
        Sair
      </button>
    )
  );
}
