"use client";

import { cn } from "@/lib/utils";
import {
  ArrowClockwiseIcon,
  ClockIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { useEffect, useState, useTransition } from "react";

interface ServerInfo {
  host: string;
  retrieved_at: number;
  version?: {
    name_clean: string;
  };
  players?: {
    online: number;
    max: number;
    list: [
      {
        name_raw: string;
      },
    ];
  };
  mods?: [
    {
      name: string;
      version: string;
    },
  ];
}

export default function ServerInfo() {
  const [data, setData] = useState<ServerInfo | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchServerInfo = async () => {
    startTransition(async () => {
      const response = await fetch(
        "https://api.mcstatus.io/v2/status/java/ronaldo.vncius.dev",
      );
      const data = (await response.json()) as ServerInfo;
      setData(data);
    });
  };

  useEffect(() => {
    fetchServerInfo();
  }, []);

  if (!data)
    return (
      <div className="py-5">
        <SpinnerGapIcon
          size={32}
          weight="bold"
          className="text-accent mx-auto animate-spin"
        />
      </div>
    );
  return (
    <>
      {(data || isPending) && (
        <>
          <div className="mt-1 flex items-start justify-between">
            <div>
              <p className="text-neutral-500 underline">{data?.host}</p>
              <p className="text-neutral-600">
                {data.version?.name_clean ?? "Desconhecido"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <ClockIcon size={16} weight="bold" />
              <p>
                {new Date(data?.retrieved_at || 0).toLocaleTimeString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-neutral-500">
              Online:{" "}
              <span className="text-green-500">{data.players?.online}</span>
              <span className="text-neutral-400"> / {data.players?.max}</span>
            </p>

            <button
              type="button"
              onClick={fetchServerInfo}
              disabled={isPending}
              aria-disabled={isPending}
              title="Atualizar informações"
              className={cn(
                isPending && "animate-spin",
                "cursor-pointer text-neutral-500",
              )}
            >
              <ArrowClockwiseIcon size={18} weight="bold" />
            </button>
          </div>
        </>
      )}
    </>
  );
}
