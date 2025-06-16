"use client";

import { cn } from "@/lib/utils";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";
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
      <div className="flex h-32 items-center justify-center">
        <div className="size-7 animate-pulse rounded-full bg-blue-500"></div>
      </div>
    );
  return (
    <>
      {(data || isPending) && (
        <>
          <div className="mt-3.5 mb-7 flex justify-between">
            <div>
              <p className="text-neutral-500 underline">{data?.host}</p>
              <p className="text-neutral-600">
                {data.version?.name_clean ?? "Desconhecido"}
              </p>
            </div>
            <p className="text-blue-600">
              <span>
                {new Date(data?.retrieved_at || 0).toLocaleTimeString("pt-BR")}
              </span>
            </p>
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
              <ArrowClockwiseIcon size={24} />
            </button>
          </div>
        </>
      )}
    </>
  );
}
