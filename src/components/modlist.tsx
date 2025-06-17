"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { matchSorter } from "match-sorter";
import { InfoIcon } from "@phosphor-icons/react";
import { useToast } from "@/contexts/ToastContext";
import UploadMods from "./upload-mods";
import useSound from "use-sound";

export interface Mod {
  name: string;
}
export interface ModlistJSON {
  mods: Mod[];
}

export default function Modlist() {
  const [mods, setMods] = useState<Mod[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [targetMod, setTargetMod] = useState<Mod | null>(null);
  const [isPending, startTransition] = useTransition();
    const [successful_hit] = useSound("/sounds/successful_hit.ogg", {
      volume: 0.1,
    });
  const { setToastState } = useToast();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL not found.");

  /** Normalise: lower‑case & strip space, underscore, hyphen */
  const normalize = (txt: string) => txt.toLowerCase().replace(/[\s_-]+/g, "");

  const updateModlist = async () => {
    fetch(`${apiUrl}/api/v2/modlist`)
      .then((r) => r.json())
      .then((d: ModlistJSON) => setMods(d.mods));
  };

  useEffect(() => {
    updateModlist();
  }, []);

  const filtered = useMemo(
    () =>
      search
        ? matchSorter(mods, normalize(search), {
            keys: [(m) => normalize(m.name)],
            threshold: matchSorter.rankings.CONTAINS,
          })
        : mods,
    [mods, search],
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

  const deleteModRequest = async (apiUrl: string, name: string) =>
    fetch(`${apiUrl}/api/v2/modlist/${encodeURIComponent(name)}`, {
      method: "DELETE",
    });

  const removeMod = (name: string) => (mods: Mod[]) =>
    mods.filter((m) => m.name !== name);

  const confirmDelete = () => {
    if (!targetMod) return;

    const { name } = targetMod;

    startTransition(() => handleDelete(name));
  };

  const handleUpload = (newMods: Mod[]) => {
    setMods((prev) => [
      ...prev,
      ...newMods.filter((m) => !prev.some((p) => p.name === m.name)),
    ]);
  };

  const handleDelete = async (name: string) => {
    try {
      const res = await deleteModRequest(apiUrl, name);

      if (!res.ok) {
        setToastState({
          type: "error",
          message: `Erro ao remover o mod ${name}: ${res.statusText}`,
        });
        return;
      }

      setSearch("");
      setModalOpen(false);
      setTargetMod(null);
      setMods(removeMod(name));
      successful_hit();
      setToastState({ type: "success", message: "Mod removido com sucesso!" });
    } catch (err) {
      setModalOpen(false);
      setTargetMod(null);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setToastState({ type: "error", message });
    }
  };

  return (
    <div className="my-10 w-full">
      <div className="flex items-end gap-3">
        <h2 className="text-2xl leading-none text-lime-500">Modlist</h2>
        <p className="text-sm text-neutral-500">{mods.length} mods</p>
      </div>
      <hr className="mt-2.5 border-neutral-800" />

      <UploadMods apiUrl={apiUrl} onUpload={handleUpload} />
      <input
        type="text"
        placeholder="Search mods..."
        className="mt-4 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-green-500 focus:outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mt-2.5 flex items-center gap-1 text-blue-600">
        <InfoIcon size={16} />
        <p className="text-sm">Clique em um mod para removê-lo</p>
      </div>
      <ul className="[&::-webkit-scrollbar-thumb]:bg-accent text-accent my-4 max-h-96 list-inside list-decimal overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800">
        {filtered.length ? (
          filtered.map((m) => (
            <li key={m.name}>
              <button
                className="my-1.5 cursor-pointer text-gray-300 duration-200 hover:text-red-500 hover:underline"
                onClick={() => handleDeleteClick(m)}
              >
                {highlight(m.name)}
              </button>
            </li>
          ))
        ) : (
          <li className="my-2 text-sm text-neutral-500">
            Nenhum mod encontrado.
          </li>
        )}
      </ul>

      <hr className="mt-2.5 border-neutral-800" />

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
            className="w-full max-w-sm border-2 border-neutral-300 bg-neutral-950 p-6 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-red-500">
              Deseja deletar o mod?
            </h3>
            <p className="mt-5 mb-14 text-neutral-300">{targetMod.name}</p>

            {isPending ? (
              <button
                disabled
                className="relative flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-red-600 pt-2 pb-3 text-neutral-100 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-red-600 before:brightness-150 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500 after:brightness-50 hover:translate-y-px hover:bg-red-500/90 hover:after:h-[3px] disabled:bg-red-500/50 disabled:text-neutral-400 disabled:before:bg-red-600/50"
              >
                Deleting…
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  className="relative flex w-full flex-1 cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-red-600 pt-2 pb-3 text-neutral-100 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-red-600 before:brightness-150 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500 after:brightness-50 hover:translate-y-px hover:bg-red-500/90 hover:after:h-[3px] disabled:bg-red-500/50 disabled:text-neutral-400 disabled:before:bg-red-600/50"
                  onClick={confirmDelete}
                >
                  Sim, deletar
                </button>
                <button
                  className="after:bg-button-shadow relative ml-auto block w-fit flex-1 cursor-pointer border-2 border-black bg-neutral-300 px-2 pt-2 pb-3 text-center text-neutral-800 transition-colors before:absolute before:top-0 before:left-0 before:h-0.5 before:w-full before:bg-neutral-300 before:brightness-125 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full hover:translate-y-px hover:bg-neutral-300/90 hover:after:h-[3px] disabled:bg-neutral-500 disabled:before:bg-neutral-300/50"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
