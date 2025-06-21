"use client";

import { useMemo, useState, useTransition } from "react";
import { matchSorter } from "match-sorter";
import { useToast } from "@/contexts/ToastContext";
import UploadMods from "./upload-mods";
import useSound from "use-sound";
import { cn } from "@/lib/utils";
import ModListItems from "./modlist-items";
import { useModlist } from "@/providers/ModlistProvider";
import { useSession } from "@/contexts/SessionContext";

export interface Mod {
  name: string;
}
export interface ModlistJSON {
  mods: Mod[];
}

export default function Modlist() {
  const modlist = useModlist();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [targetMod, setTargetMod] = useState<Mod | null>(null);
  const { session } = useSession();

  const [isPending, startTransition] = useTransition();
  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });
  const [successful_hit] = useSound("/sounds/successful_hit.ogg", {
    volume: 0.1,
  });
  const [noteblock_bass] = useSound("/sounds/noteblock_bass.mp3", {
    volume: 0.1,
  });
  const { setToastState } = useToast();

  /** Normalise: lower‑case & strip space, underscore, hyphen */
  const normalize = (txt: string) => txt.toLowerCase().replace(/[\s_-]+/g, "");

  const filtered = useMemo(
    () =>
      search
        ? matchSorter(modlist, normalize(search), {
            keys: [(m) => normalize(m.name)],
            threshold: matchSorter.rankings.CONTAINS,
          })
        : modlist,
    [modlist, search],
  );

  const highlight = (name: string) => {
    if (!search) return name;

    const normName = normalize(name);
    const normSearch = normalize(search);
    const idx = normName.indexOf(normSearch);
    if (idx === -1) return name; // no match after normalisation

    // Map back to original string indices
    let realStart = 0,
      realEnd = 0,
      count = 0;
    for (let i = 0; i < name.length && count < idx + normSearch.length; i++) {
      if (!/[\s_-]/.test(name[i])) {
        if (count === idx) realStart = i;
        count++;
        realEnd = i + 1; // slice end is exclusive
      }
    }

    return (
      <>
        {name.slice(0, realStart)}
        <mark className="bg-accent px-0.5 text-white">
          {name.slice(realStart, realEnd)}
        </mark>
        {name.slice(realEnd)}
      </>
    );
  };

  const handleDeleteClick = (mod: Mod) => {
    setTargetMod(mod);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (!targetMod) return;

    const { name } = targetMod;

    startTransition(() => handleDelete(name));
  };

  const handleDelete = async (name: string) => {
    setToastState({ type: "info", message: "Removendo mod..." });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/signed/mod/delete/${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.id}`,
          },
        },
      );
      if (!res.ok) {
        const data = await res.json();
        setToastState({ type: "error", message: data.error });
        return;
      }

      successful_hit();
      setSearch("");
      setModalOpen(false);
      setTargetMod(null);
      setToastState({ type: "success", message: "Mod removido com sucesso!" });
    } catch (err) {
      noteblock_bass();
      setModalOpen(false);
      setTargetMod(null);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setToastState({ type: "error", message });
    }
  };

  return (
    <>
      <h2 className="text-accent text-xl">Modlist</h2>
      <hr className="-mt-1 border-neutral-800" />
      <UploadMods />
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Pesquisar mods..."
        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-green-500 focus:outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoComplete="off"
      />

      <div
        className={cn(
          "max-h-96 min-h-48 overflow-y-auto rounded-md border border-neutral-800 bg-[#111111] px-3 py-1.5 md:h-full md:max-h-full",
          "[&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-900/30",
        )}
      >
        <p className="mx-auto mb-1.5 w-fit text-sm text-neutral-500">
          {modlist.length} mods
        </p>
        <ul className={cn("flex flex-col items-start gap-1")}>
          <ModListItems
            modlist={modlist}
            filtered={filtered}
            highlight={highlight}
            handleDeleteClick={handleDeleteClick}
          />
        </ul>

        {/* --- Modal ---------------------------------------------------- */}
        {modalOpen && targetMod && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={(e) => {
              // block backdrop click while pending
              if (!isPending) setModalOpen(false);
              e.stopPropagation();
            }}
          >
            <div
              className="w-full max-w-sm rounded-md border border-neutral-800 bg-neutral-950 p-6 text-center shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg text-red-500">Deletar o mod:</h3>
              <p className="mt-5 mb-14 text-neutral-300">{targetMod.name}</p>

              {isPending ? (
                <button
                  disabled
                  className="relative flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-red-600 pt-2 pb-3 text-neutral-100 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-red-600 before:brightness-150 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500 after:brightness-50 hover:translate-y-px hover:bg-red-500/90 hover:after:h-[3px] disabled:bg-red-500/50 disabled:text-neutral-400 disabled:before:bg-red-600/50"
                >
                  Deletando…
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    className="relative flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 bg-red-600 pt-2 pb-3 text-neutral-100 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-red-500/80 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500 after:brightness-50 hover:translate-y-px hover:bg-red-500/90 hover:after:h-[3px] disabled:bg-red-500/50 disabled:text-neutral-400 disabled:before:bg-red-600/50"
                    onClick={confirmDelete}
                  >
                    Sim
                  </button>
                  <button
                    className="after:bg-button-shadow relative ml-auto block w-fit flex-1 cursor-pointer bg-neutral-300 px-2 pt-2 pb-3 text-center text-neutral-800 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-neutral-300 before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full hover:translate-y-px hover:bg-neutral-300/90 hover:after:h-[3px] disabled:bg-neutral-500 disabled:before:bg-neutral-300/50"
                    onClick={() => {
                      click();
                      setModalOpen(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
