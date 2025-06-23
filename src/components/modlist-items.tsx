import {
  CircleNotchIcon,
  CopyIcon,
  DownloadIcon,
  SpinnerGapIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { Mod } from "./modlist";
import { JSX, useState } from "react";
import { Session } from "@prisma/client";
import { useToast } from "@/contexts/ToastContext";

export default function ModListItems({
  sessionId,
  modlist,
  filtered,
  highlight,
  handleDeleteClick,
}: {
  sessionId: Session["id"];
  modlist: Mod[] | undefined;
  filtered: Mod[];
  highlight: (name: string) => JSX.Element | string;
  handleDeleteClick: (mod: Mod) => void;
}) {
  const { setToastState } = useToast();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadClick = async (name: string) => {
    setDownloading(name);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/signed/mod/download/${name}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        },
      );

      if (!res.ok) {
        const data = await res.json();
        setToastState({ type: "error", message: data.error });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name + ".jar";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setToastState({ type: "error", message: "Erro ao baixar o mod." });
    } finally {
      setDownloading(null);
    }
  };

  if (!modlist?.length) {
    return (
      <li className="my-5 w-full">
        <SpinnerGapIcon
          size={32}
          weight="bold"
          className="text-accent mx-auto animate-spin"
        />
      </li>
    );
  }

  if (!filtered.length && modlist.length) {
    return (
      <li className="my-2 text-sm text-neutral-500">Nenhum mod encontrado.</li>
    );
  }

  return (
    <>
      {filtered.map((mod) => (
        <li
          key={mod.name}
          className="relative flex w-full items-center justify-between"
        >
          <button
            title={mod.name}
            onClick={() => navigator.clipboard.writeText(mod.name)}
            className="group flex w-56 items-center truncate text-sm text-gray-300"
          >
            <span className="text-accent mr-1">
              {filtered.indexOf(mod) + 1}.
            </span>
            <span className="truncate group-hover:underline">
              {highlight(mod.name)}
            </span>
            <CopyIcon
              size={18}
              className="ml-1 hidden min-w-[18px] group-hover:inline"
            />
          </button>

          <div
            className="flex items-center gap-2"
            onClick={() => handleDownloadClick(mod.name)}
          >
            <button
              className="w-fit min-w-4 flex-1 cursor-pointer text-blue-500"
              title="Download"
            >
              {downloading === mod.name ? (
                <CircleNotchIcon
                  size={18}
                  weight="bold"
                  className="animate-spin"
                />
              ) : (
                <DownloadIcon size={18} weight="bold" />
              )}
            </button>

            <button
              className="w-fit flex-1 cursor-pointer text-red-500"
              title="Deletar"
              onClick={() => handleDeleteClick(mod)}
            >
              <TrashSimpleIcon size={18} weight="bold" />
            </button>
          </div>
        </li>
      ))}
    </>
  );
}
