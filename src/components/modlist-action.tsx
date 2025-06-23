// components/modlist/ModActionButtons.tsx
"use client";

import { useState, useTransition } from "react";
import {
  DownloadIcon,
  TrashSimpleIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react";
import useSound from "use-sound";
import { useSession } from "@/contexts/SessionContext";
import { useToast } from "@/contexts/ToastContext";

export function ModlistAction({ name }: { name: string }) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { session } = useSession();
  const { setToastState } = useToast();

  const [click] = useSound("/sounds/click.mp3", { volume: 0.1 });
  const [successful_hit] = useSound("/sounds/successful_hit.ogg", {
    volume: 0.1,
  });
  const [noteblock_bass] = useSound("/sounds/noteblock_bass.mp3", {
    volume: 0.1,
  });

  const handleDownloadClick = async () => {
    setDownloading(name);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/signed/mod/download/${name}`,
        {
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
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name + ".jar";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setToastState({ type: "error", message: "Erro ao baixar o mod." });
    } finally {
      setDownloading(null);
    }
  };

  const handleDeleteClick = () => {
    setModalOpen(true);
  };

  const confirmDelete = () => {
    startTransition(() => confirmDeleteMod());
  };

  const confirmDeleteMod = async () => {
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
        setModalOpen(false);
        setToastState({ type: "error", message: data.error });
        return;
      }

      setModalOpen(false);
      successful_hit();
      setToastState({ type: "success", message: "Mod removido com sucesso!" });
    } catch (err) {
      noteblock_bass();
      setModalOpen(false);
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setToastState({ type: "error", message });
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleDownloadClick}
          title="Download"
          className="cursor-pointer text-blue-500"
        >
          {downloading === name ? (
            <CircleNotchIcon size={18} weight="bold" className="animate-spin" />
          ) : (
            <DownloadIcon size={18} weight="bold" />
          )}
        </button>
        <button
          onClick={() => handleDeleteClick()}
          title="Deletar"
          className="cursor-pointer text-red-500"
        >
          <TrashSimpleIcon size={18} weight="bold" />
        </button>
      </div>

      {/* --- Modal ---------------------------------------------------- */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 text-base"
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
            <p className="mt-5 mb-14 text-xl break-words whitespace-pre-wrap text-neutral-300">
              {name}
            </p>

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
    </>
  );
}
