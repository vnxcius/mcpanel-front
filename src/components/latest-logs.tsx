"use client";

import { cn } from "@/lib/utils";
import { CaretDownIcon, FunnelIcon } from "@phosphor-icons/react";
import { Geist } from "next/font/google";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import AlertBox from "./alert-box";
import ButtonGroup from "./button-group";
import useSound from "use-sound";
import LatestLogsLines from "./latest-logs-lines";
import { useLogLines } from "@/providers/LogProvider";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export default function LatestLog() {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<
    "error" | "warn" | "info" | null
  >(null);
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });
  const logRef = useRef<HTMLDivElement>(null);
  const logLines = useLogLines();

  const normalize = (txt: string) => txt.toLowerCase().replace(/\s+/g, "");
  const filtered = useMemo(() => {
    let result = logLines;
    if (filterLevel === "error")
      result = result.filter((line) => /\b(error|severe)\b/i.test(line));
    if (filterLevel === "warn")
      result = result.filter((line) => /\bwarn(ing)?\b/i.test(line));
    if (filterLevel === "info")
      result = result.filter(
        (line) => !/\b(error|severe|warn(ing)?)\b/i.test(line),
      );
    if (search)
      result = result.filter((line) =>
        normalize(line).includes(normalize(search)),
      );
    return result;
  }, [logLines, search, filterLevel]);

  useLayoutEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
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
      <div className="flex justify-between gap-3 max-sm:flex-col-reverse md:items-end">
        <div className="flex w-full max-w-fit items-stretch gap-2">
          <input
            name="search"
            id="search"
            type="text"
            placeholder="Pesquisar logs..."
            className="w-full max-w-xs rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />

          {/* --- Filters -------------------------------------------------- */}
          <div className="group flex items-center space-x-1.5 text-neutral-500">
            <FunnelIcon
              size={20}
              weight="bold"
              onClick={() => {
                setFilterLevel(null);
                click();
              }}
              className={cn(
                "size-5 h-5 min-w-8 cursor-pointer border-r border-neutral-700 px-1",
                filterLevel === "error" && "text-red-500",
                filterLevel === "warn" && "text-yellow-500",
                filterLevel === "info" && "text-emerald-300",
              )}
            />
            <button
              onClick={() => {
                if (filterLevel === "error") return setFilterLevel(null);
                setFilterLevel("error");
                click();
              }}
              className={cn(
                "hover:text-neutral-400",
                filterLevel === "error" && "text-red-500",
              )}
            >
              <p className={`text-sm font-medium ${geist.className}`}>Error</p>
            </button>
            <button
              onClick={() => {
                if (filterLevel === "warn") return setFilterLevel(null);
                setFilterLevel("warn");
                click();
              }}
              className={cn(
                "hover:text-neutral-400",
                filterLevel === "warn" && "text-yellow-500",
              )}
            >
              <p className={`text-sm font-medium ${geist.className}`}>Warn</p>
            </button>
            <button
              onClick={() => {
                if (filterLevel === "info") return setFilterLevel(null);
                setFilterLevel("info");
                click();
              }}
              className={cn(
                "hover:text-neutral-400",
                filterLevel === "info" && "text-emerald-300",
              )}
            >
              <p className={`text-sm font-medium ${geist.className}`}>Info</p>
            </button>
          </div>
        </div>

        <ButtonGroup />
      </div>

      {/* --- Logs --------------------------------------------------------- */}
      <LatestLogsLines
        ref={logRef}
        logs={filtered}
        colorLine={colorLine}
        filtered={filtered}
        isLoading={logLines.length <= 0}
      />

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
