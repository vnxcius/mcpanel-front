"use client";

import { SpinnerGapIcon } from "@phosphor-icons/react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Noto_Sans_Mono } from "next/font/google";
import { Session } from "@prisma/client";

const notoSansMono = Noto_Sans_Mono({ weight: "400", subsets: ["latin"] });

interface LogLinesProps {
  logs: string[] | undefined;
  filtered: string[];
  colorLine: (line: string) => string;
  isLoading: boolean;
  session: Session;
}

const LatestLogsLines = forwardRef<HTMLDivElement, LogLinesProps>(
  ({ logs, filtered, colorLine, isLoading, session }, ref) => {
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
      <div className="relative flex max-h-[300px] min-h-[250px] w-full flex-col gap-2 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-300 md:max-h-full md:min-w-96">
        <div
          ref={ref}
          tabIndex={-1}
          className={cn(
            notoSansMono.className,
            "[&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full",
            "overflow-y-auto outline-none",
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
        <form
          className={cn(
            notoSansMono.className,
            "flex items-center text-xs text-green-600",
          )}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            const command = data.get("command")?.toString() ?? "";

            try {
              const res = await fetch(
                process.env.NEXT_PUBLIC_API_URL + "/api/v2/signed/server/cmd",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${session.id}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    command: command,
                  }),
                },
              );

              if (res.ok) form.reset();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <label htmlFor="command">Servidor&gt;</label>
          <input
            type="text"
            name="command"
            id="command"
            autoFocus
            spellCheck="false"
            className="w-full px-2 outline-none"
          />
        </form>
      </div>
    );
  },
);

LatestLogsLines.displayName = "LatestLogLines";
export default LatestLogsLines;
