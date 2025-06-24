"use client";

import { ChangeEvent, DragEvent, useRef, useState, useTransition } from "react";
import {
  DownloadIcon,
  TrashSimpleIcon,
  CircleNotchIcon,
  ArrowsClockwiseIcon,
  UploadIcon,
} from "@phosphor-icons/react";
import useSound from "use-sound";
import { useSession } from "@/contexts/SessionContext";
import { useToast } from "@/contexts/ToastContext";
import { cn } from "@/lib/utils";

export function ModlistAction({ name }: { name: string }) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const handleUpdateClick = () => {
    setModalUpdateOpen(true);
  };

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    addFile(e.target.files![0]);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFile(Array.from(e.dataTransfer.files)[0]);
  };

  const addFile = async (incoming: File) => {
    const formData = new FormData();
    formData.append("file", incoming);

    startTransition(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v2/signed/mod/update/${name}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.id}`,
            },
            body: formData,
          },
        );
        if (!res.ok) {
          const data = await res.json();
          setToastState({ type: "error", message: data.error });
          return;
        }
        setModalUpdateOpen(false);
        successful_hit();
        setToastState({
          type: "success",
          message: "Mod atualizado com sucesso!",
        });
      } catch (err) {
        noteblock_bass();
        setModalUpdateOpen(false);
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setToastState({ type: "error", message });
      }
    });
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleUpdateClick}
          title="Atualizar"
          className="cursor-pointer text-emerald-500"
        >
          <ArrowsClockwiseIcon size={18} weight="bold" />
        </button>
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

      {/* --- Modal -------------------------------------------------------- */}
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

      {/* --- Modal Update ------------------------------------------------- */}
      {modalUpdateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 text-base"
          onClick={(e) => {
            // block backdrop click while pending
            if (!isPending) setModalUpdateOpen(false);
            e.stopPropagation();
          }}
        >
          <div
            className={cn(
              "w-full max-w-md rounded-md border border-neutral-800 bg-neutral-950 p-6 text-center shadow-lg",
              dragOver && "border-emerald-500",
            )}
            onClick={(e) => e.stopPropagation()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <h3 className="mb-1.5 text-lg leading-none text-emerald-500">
              Atualizar o mod:
            </h3>
            <p className="text-sm break-words whitespace-pre-wrap text-neutral-500">
              {name}
            </p>

            <div
              onClick={() => inputRef.current?.click()}
              className={cn(
                "mx-auto mt-7 flex max-w-sm cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-5 text-center break-words transition-colors",
                dragOver
                  ? "border-emerald-500 bg-neutral-800 text-emerald-400 brightness-100"
                  : "border-neutral-700 text-neutral-500 hover:border-emerald-500 hover:text-emerald-400",
              )}
            >
              <UploadIcon size={18} weight="bold" className="min-w-5" />
              <p>Clique aqui ou arraste arquivos .JAR</p>
              <input
                ref={inputRef}
                type="file"
                name="file"
                accept=".jar"
                className="hidden"
                onChange={handleSelect}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
