"use client";

import { cn } from "@/lib/utils";
import { columns } from "@/app/home/columns";
import { DataTable } from "@/app/home/data-table";
import ButtonChangelog from "./button-changelog";
import ButtonUploadMods from "./button-upload-mods";

export interface Mod {
  name: string;
  size: number;
  modTime: number;
}
export interface ModlistJSON {
  mods: Mod[];
}

export default function Modlist() {
  return (
    <>
      <h2 className="text-accent text-xl">Modlist</h2>
      <hr className="-mt-1 border-neutral-800" />
      <div className="grid grid-cols-2 place-items-stretch gap-2">
        <ButtonUploadMods />
        <ButtonChangelog />
      </div>

      <div
        className={cn(
          "max-h-96 min-h-48 overflow-y-auto rounded-md border border-neutral-800 bg-[#111111] md:h-full md:max-h-full",
          "[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0",
        )}
      >
        <DataTable columns={columns} />
      </div>
    </>
  );
}
