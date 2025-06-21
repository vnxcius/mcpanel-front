import {
  CopyIcon,
  DownloadIcon,
  SpinnerGapIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react";
import { Mod } from "./modlist";
import { JSX } from "react";

export default function ModListItems({
  modlist,
  filtered,
  highlight,
  handleDeleteClick,
}: {
  modlist: Mod[] | undefined;
  filtered: Mod[];
  highlight: (name: string) => JSX.Element | string;
  handleDeleteClick: (mod: Mod) => void;
}) {
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
            className="group flex w-56 items-start truncate text-sm text-gray-300"
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

          <div className="flex items-center gap-2">
            <button
              className="w-fit min-w-4 flex-1 cursor-pointer text-blue-500"
              title="Download"
            >
              <DownloadIcon size={18} weight="bold" />
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
