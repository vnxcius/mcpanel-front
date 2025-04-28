"use client";

import { useEffect, useState, useTransition } from "react";
import ButtonGroup from "./button-group";
import TokenInput from "./token-input";
import { verifyToken } from "@/lib/utils";

interface ServerInfo {
  host: string;
  retrieved_at: number;
  version: {
    name_clean: string;
  };
  players: {
    online: number;
    max: number;
    list: [
      {
        name_raw: string;
      },
    ];
  };
  mods: [
    {
      name: string;
      version: string;
    },
  ];
}

export default function TokenDependentUI() {
  const [isValidToken, setIsValidToken] = useState<boolean>();
  const [data, setData] = useState<ServerInfo | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchServerInfo = async () => {
    startTransition(async () => {
      const response = await fetch(
        "https://api.mcstatus.io/v2/status/java/mmfc.vncius.dev",
      );
      const data = (await response.json()) as ServerInfo;
      setData(data);
    });
  };

  useEffect(() => {
    async function validateToken() {
      const validToken = await verifyToken();
      setIsValidToken(validToken);
    }
    validateToken();
  }, []);

  if (isValidToken === undefined) {
    return (
      <div className="my-10 flex items-center justify-center">
        <div className="size-7 animate-spin rounded-full border-5 border-green-400 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {isValidToken ? <ButtonGroup /> : <TokenInput />}

      {(data || isPending) && (
        <div className="border-2 border-white bg-neutral-900 p-4 text-neutral-500">
          {isPending ? (
            <p className="animate-pulse text-amber-500">
              Obtendo informações...
            </p>
          ) : (
            <>
              <div className="flex justify-between">
                <p>
                  IP: <span className="text-neutral-300">{data?.host}</span>
                </p>
                <p className="text-neutral-600">
                  <span>
                    {new Date(data?.retrieved_at || 0)
                      .toLocaleTimeString("pt-BR")
                      .slice(0, -3)}
                  </span>
                </p>
              </div>
              <p>
                Versão:{" "}
                <span className="text-blue-500">
                  {data?.version.name_clean}
                </span>
              </p>
              <p>
                Online:{" "}
                <span className="text-green-500">{data?.players.online}</span>
                <span className="text-neutral-300"> / {data?.players.max}</span>
              </p>

              <p className="mt-3.5">Players:</p>
              <ul>
                {data?.players.list.map((player) => (
                  <li key={player.name_raw} className="text-neutral-300">
                    {player.name_raw}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      {isValidToken && (
        <button
          onClick={fetchServerInfo}
          disabled={isPending}
          className="after:bg-button-shadow relative mx-auto block w-fit cursor-pointer border-2 border-black bg-neutral-300 px-4 pt-1 pb-2 text-center text-sm text-neutral-800 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-neutral-300 before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full hover:translate-y-px hover:bg-neutral-300/90 hover:after:h-[3px] disabled:bg-neutral-500 disabled:before:bg-neutral-300/50"
        >
          {isPending ? "Carregando" : "Obter"} informações do servidor
        </button>
      )}
    </div>
  );
}
