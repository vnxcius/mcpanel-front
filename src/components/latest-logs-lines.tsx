"use client";

import { SpinnerGapIcon } from "@phosphor-icons/react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] });

interface LogLinesProps {
  logs: string[] | undefined;
  filtered: string[];
  colorLine: (line: string) => string;
  isLoading: boolean;
}

const LatestLogsLines = forwardRef<HTMLDivElement, LogLinesProps>(
  ({ logs, filtered, colorLine, isLoading }, ref) => {
    if (!logs || isLoading) {
      return (
        <div className="flex h-56 items-center justify-center">
          <SpinnerGapIcon
            size={32}
            weight="bold"
            className="text-accent animate-spin"
          />
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(
          spaceMono.className,
          "[&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full",
          "max-h-[300px] min-h-[250px] w-full overflow-y-scroll rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none md:max-h-full md:min-w-96",
        )}
      >
        {filtered.length ? (
          filtered.map((line, i) => (
            <p key={i} className={cn("w-max text-xs", colorLine(line))}>
              {line}
            </p>
          ))
        ) : (
          <div className="my-2 text-sm text-neutral-500">
            Nenhuma mensagem foi encontrada.
          </div>
        )}
      </div>
    );
  },
);

LatestLogsLines.displayName = "LatestLogLines";
export default LatestLogsLines;
