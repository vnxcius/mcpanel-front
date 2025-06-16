"use client";

import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import { SignOutIcon } from "@phosphor-icons/react";

const geist = Geist({ subsets: ["latin"], display: "swap", weight: "400" });

export default function LogoutButton() {
  return (
    <button
      onClick={() => (window.location.href = "/api/auth/sign-out")}
      className={cn(
        geist.className,
        "flex w-fit cursor-pointer items-center gap-1 text-sm hover:underline",
        "text-rose-500 underline-offset-2",
      )}
    >
      <SignOutIcon size={20} weight="fill" />
      Deslogar
    </button>
  );
}
