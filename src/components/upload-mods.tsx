"use client";

import { useServerAction } from "@/contexts/ServerActionContext";
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

export default function UploadMods({
  apiUrl,
  onUpload,
}: {
  apiUrl: string;
  onUpload: (newMods: Mod[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [successful_hit] = useSound("/sounds/successful_hit.ogg", {
    volume: 0.1,
  });
  const [noteblock_bass] = useSound("/sounds/noteblock_bass.mp3", {
    volume: 0.1,
  });
  const { setActionState } = useServerAction();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadFiles = useCallback(
    (files: File[]) => {
      if (!files.length) return;

      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      setBusy(true);
      setError("");

      startTransition(async () => {
        try {
          const res = await fetch(`${apiUrl}/api/v2/modlist/upload`, {
            method: "POST",
            body: form,
          });

          if (!res.ok) {
            noteblock_bass();
            const data = await res.json();
            setError(data.message);
            return;
          }

          const data: UploadResponse = await res.json();
          const newMods = data.mods.map((n) => ({
            name: n.replace(/\.jar$/i, ""),
          }));
          onUpload(newMods);
          successful_hit();
          setActionState({
            type: "success",
            message: "Mods carregados com sucesso!",
          });
        } catch (err) {
          noteblock_bass();
          const msg = err instanceof Error ? err.message : "Erro desconhecido";
          setError(msg);
        } finally {
          setBusy(false);
          inputRef.current!.value = ""; // reset input
        }
      });
    },
    [apiUrl, onUpload],
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
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
