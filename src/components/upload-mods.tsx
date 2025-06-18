"use client";

import { uploadMod } from "@/app/actions";
import { useToast } from "@/contexts/ToastContext";
import {
  useState,
  useRef,
  useCallback,
  ChangeEvent,
  DragEvent,
  startTransition,
} from "react";
import useSound from "use-sound";

interface Mod {
  name: string;
}
interface UploadResponse {
  mods: string[];
}

export default function UploadMods({ apiUrl }: { apiUrl: string }) {
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [successful_hit] = useSound("/sounds/successful_hit.ogg", {
    volume: 0.1,
  });
  const [noteblock_bass] = useSound("/sounds/noteblock_bass.mp3", {
    volume: 0.1,
  });
  const { setToastState } = useToast();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadFiles = useCallback(
    (files: File[]) => {
      if (!files.length) return;

      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      setBusy(true);
      setToastState({ type: "info", message: "Upando mods..." });

      startTransition(async () => {
        try {
          const res = await uploadMod(form);

          if (res.type === "error") {
            noteblock_bass();
            console.log(res.message);
            setToastState(res);
            return;
          }

          successful_hit();
          setToastState(res);
        } catch (err) {
          noteblock_bass();
          const msg = err instanceof Error ? err.message : "Erro desconhecido";
          setToastState({ type: "error", message: msg });
        } finally {
          setBusy(false);
          inputRef.current!.value = ""; // reset input
        }
      });
    },
    [apiUrl],
  );

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    uploadFiles(files);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.name.toLowerCase().endsWith(".jar"),
    );
    uploadFiles(files);
  };

  return (
    <div className="my-2.5">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`block cursor-pointer rounded-md border border-dashed p-4 text-center transition-colors ${dragOver ? "border-green-500 bg-neutral-800 text-green-400" : "border-neutral-700 text-neutral-400 hover:border-green-500 hover:text-green-400"}`}
      >
        {busy ? "Uploading…" : "Clique ou arraste arquivos .JAR"}
        <input
          ref={inputRef}
          type="file"
          name="files"
          accept=".jar"
          multiple
          className="hidden"
          onChange={handleSelect}
          disabled={busy}
        />
      </div>
    </div>
  );
}
