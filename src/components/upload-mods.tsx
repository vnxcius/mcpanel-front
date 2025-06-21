"use client";

import { useSession } from "@/contexts/SessionContext";
import { cn, formatFileSize } from "@/lib/utils";
import {
  CheckCircleIcon,
  CircleNotchIcon,
  FileTextIcon,
  UploadIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Geist } from "next/font/google";
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import useSound from "use-sound";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

type FileStatus = "pending" | "uploading" | "success" | "error";
type UIFile = { file: File; status: FileStatus; errorReason?: string };

export default function UploadMods() {
  const [dragOver, setDragOver] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [files, setFiles] = useState<UIFile[]>([]);
  const { session } = useSession();
  const [successful_hit] = useSound("/sounds/successful_hit.ogg", {
    volume: 0.1,
  });
  const [noteblock_bass] = useSound("/sounds/noteblock_bass.mp3", {
    volume: 0.1,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const openModal = () => {
    setModalOpen(true);
  };

  const parseIncoming = (incoming: File[], existing: UIFile[]) => {
    const jars = incoming.filter((f) => f.name.toLowerCase().endsWith(".jar"));
    return jars.reduce<[File[], File[]]>(
      ([unique, dup], file) => {
        const isDup = existing.some(
          (ex) => ex.file.name === file.name && ex.file.size === file.size,
        );
        return isDup ? [unique, [...dup, file]] : [[...unique, file], dup];
      },
      [[], []],
    );
  };

  const uploadSingle = async (uiFile: UIFile, idx: number) => {
    const form = new FormData();
    form.append("files", uiFile.file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/signed/mod/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session.id}` },
          body: form,
        },
      );

      if (!res.ok) {
        interface Skipped {
          file: string;
          reason: string;
        }
        const data = await res.json();
        const skipped = data?.skipped ?? [];

        const reason =
          skipped.find((s: Skipped) => s.file === uiFile.file.name)?.reason ??
          "Erro desconhecido";

        setFiles((prev) =>
          prev.map((f, i) =>
            i === idx ? { ...f, status: "error", errorReason: reason } : f,
          ),
        );

        noteblock_bass();
        return;
      }

      setFiles((prev) =>
        prev.map((f, i) => (i === idx ? { ...f, status: "success" } : f)),
      );
      successful_hit();
    } catch {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === idx
            ? { ...f, status: "error", errorReason: "Falha de rede" }
            : f,
        ),
      );
      noteblock_bass();
    }
  };

  const addFiles = async (incoming: File[]) => {
    const [unique] = parseIncoming(incoming, files);
    if (!unique.length) return;

    const newUIFiles: UIFile[] = unique.map((f) => ({
      file: f,
      status: "uploading",
    }));

    // Add placeholders to files state first
    setFiles((prev) => [...prev, ...newUIFiles]);

    for (let i = 0; i < newUIFiles.length; i++) {
      const idx = files.length + i; // absolute index in `files` state
      await uploadSingle(newUIFiles[i], idx);
    }
  };

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="grid grid-cols-2 place-items-stretch gap-2">
        <button
          onClick={openModal}
          className="flex items-center justify-center-safe gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-gray-300 hover:border-green-500 hover:bg-neutral-800"
        >
          <UploadIcon size={18} weight="bold" className="min-w-5" />
          <p className={`text-sm ${geist.className}`}>Upload mods</p>
        </button>
        <button className="flex items-center justify-center-safe gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-gray-300 hover:border-green-500 hover:bg-neutral-800">
          <FileTextIcon size={18} weight="bold" className="min-w-5" />
          <p className={`text-sm ${geist.className}`}>Changelog</p>
        </button>
      </div>

      {/* --- Modal ---------------------------------------------------- */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => {
            // block backdrop click while pending
            setModalOpen(false);
            e.stopPropagation();
          }}
        >
          <div
            className={cn(
              "mx-4 h-96 w-full max-w-2xl rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-center shadow-lg transition",
              dragOver && "border-green-500 brightness-50",
            )}
            onClick={(e) => e.stopPropagation()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <p className="mb-1.5 text-sm text-neutral-500">Max. 50mb</p>

            <div
              onClick={() => inputRef.current?.click()}
              className={cn(
                "mx-auto flex max-w-sm cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-4 py-5 text-center transition-colors",
                dragOver
                  ? "border-green-500 bg-neutral-800 text-green-400 brightness-100"
                  : "border-neutral-700 text-neutral-400 hover:border-green-500 hover:text-green-400",
              )}
            >
              <UploadIcon size={18} weight="bold" className="min-w-5" />
              <p>Clique aqui ou arraste arquivos .JAR</p>
              <input
                ref={inputRef}
                type="file"
                name="files"
                accept=".jar"
                multiple
                className="hidden"
                onChange={handleSelect}
              />
            </div>
            <hr className="my-3.5 border-neutral-800" />

            {files.length ? (
              <div className="flex h-60 flex-col overflow-y-auto">
                {files.map(({ file, status, errorReason }, i) => (
                  <div
                    key={file.name + i}
                    className="flex items-center justify-between gap-2 px-3 text-neutral-500"
                  >
                    <p className="truncate text-sm font-medium">{file.name}</p>

                    <div className="flex w-fit items-center justify-end gap-2.5">
                      {status === "uploading" && (
                        <CircleNotchIcon
                          size={18}
                          className="min-w-4 animate-spin text-blue-500"
                        />
                      )}
                      {status === "success" && (
                        <CheckCircleIcon
                          size={18}
                          className="min-w-4 text-green-500"
                        />
                      )}
                      {status === "error" && (
                        <div title={errorReason}>
                          <WarningIcon
                            size={18}
                            className="min-w-4 text-red-500"
                          />
                        </div>
                      )}
                      <p className="w-18 text-right text-sm">
                        {formatFileSize(file.size)}
                      </p>
                      <button
                        onClick={() => removeFile(i)}
                        className="hover:text-red-500"
                      >
                        <XIcon size={18} weight="bold" className="min-w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Nenhum arquivo selecionado</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
