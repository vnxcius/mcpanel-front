"use client";

import { useServerStatus } from "@/contexts/ServerStatusContext";
import { cn } from "@/lib/utils";
import { CaretDownIcon } from "@phosphor-icons/react";
import { Space_Mono } from "next/font/google";
import { useLayoutEffect, useRef, useState } from "react";
import AlertBox from "./alert-box";
import ButtonGroup from "./button-group";
import useSound from "use-sound";

const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] });

export default function LatestLog() {
  const [search, setSearch] = useState("");
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });
  const logRef = useRef<HTMLDivElement>(null);
  const { logLines } = useServerStatus();

  const normalize = (txt: string) => txt.toLowerCase().replace(/\s+/g, "");
  const filtered = search
    ? logLines.filter((line) => normalize(line).includes(normalize(search)))
    : logLines;

  useLayoutEffect(() => {
    logRef.current!.scrollTop = logRef.current!.scrollHeight; // auto‑scroll
  }, [filtered]);

  const colorLine = (line: string) => {
    if (/\b(error|severe)\b/i.test(line)) {
      return "text-red-500";
    }
    if (/\bwarn(ing)?\b/i.test(line)) {
      return "text-yellow-500";
    }
    return "text-neutral-300";
  };

  return (
    <>
      <div className="flex items-end justify-between gap-3">
        <input
          type="text"
          placeholder="Pesquisar logs..."
          className="mt-1 w-full max-w-sm rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ButtonGroup />
      </div>

      <div
        ref={logRef}
        className={cn(
          spaceMono.className,
          "[&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full",
          "mt-4 max-h-[300px] min-h-[250px] w-full overflow-y-scroll rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-wrap break-words text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none md:max-h-full",
        )}
      >
        {filtered.map((line, i) => (
          <p key={i} className={colorLine(line)}>
            {line}
          </p>
        ))}
      </div>
      <div className="mt-2 flex items-start justify-between">
        <AlertBox />
        <button
          title="Scrollar para o final"
          className="bg-accent after:bg-accent hover:bg-accent/90 text-accent-foreground before:bg-accent relative mx-2 ml-auto block w-fit cursor-pointer gap-1.5 p-3 pt-2 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:brightness-50 hover:translate-y-px hover:after:h-[3px]"
          onClick={() => {
            click();
            logRef.current!.scrollTop = logRef.current!.scrollHeight;
          }}
        >
          <CaretDownIcon size={18} weight="bold" className="min-w-4" />
        </button>
      </div>
    </>
  );
}
