"use client";

import { useServerStatus } from "@/contexts/ServerStatusContext";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, CaretDownIcon } from "@phosphor-icons/react";
import { Space_Mono } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AlertBox from "./alert-box";

const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] });

export default function LatestLog() {
  const [search, setSearch] = useState("");
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
    <div className="">
      <h2 className="text-2xl text-yellow-400">Latest Logs</h2>
      <hr className="mt-2.5 border-neutral-800" />

      <input
        type="text"
        placeholder="Procurar nos logs..."
        className="mt-4 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div
        ref={logRef}
        className={cn(
          spaceMono.className,
          "[&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full",
          "mt-4 h-full max-h-[550px] w-full overflow-y-scroll rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-wrap break-words text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none",
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
          className="bg-accent after:bg-accent hover:bg-accent/90 text-accent-foreground before:bg-accent relative mx-2 ml-auto block w-fit cursor-pointer gap-1.5 border-2 border-black p-3 pt-2 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:brightness-50 hover:translate-y-px hover:after:h-[3px]"
          onClick={() =>
            (logRef.current!.scrollTop = logRef.current!.scrollHeight)
          }
        >
          <CaretDownIcon size={18} weight="bold" className="min-w-4" />
        </button>
      </div>
    </div>
  );
}
