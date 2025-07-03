import { cn, formatDateTime } from "@/lib/utils";
import { FileTextIcon } from "@phosphor-icons/react";
import { Geist, Space_Mono } from "next/font/google";
import { useState } from "react";
import { format } from "date-fns";
import { ModChangelog, useModlist } from "@/providers/ModlistProvider";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function ButtonChangelog() {
  const [modalOpen, setModalOpen] = useState(false);
  const { changelog } = useModlist();

  const grouped = changelog.reduce(
    (acc, change) => {
      const date = format(new Date(change.time), "dd/MM/yyyy");
      acc[date] ||= [];
      acc[date].push(change);
      return acc;
    },
    {} as Record<string, ModChangelog[]>,
  );

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center justify-center-safe gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-gray-300 hover:border-green-500 hover:bg-neutral-800 hover:text-green-500"
      >
        <FileTextIcon size={18} weight="bold" className="min-w-5" />
        <p className={`text-sm ${geist.className}`}>Changelog</p>
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => {
            setModalOpen(false);
            e.stopPropagation();
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={cn(
              "mx-4 h-4/5 w-full max-w-2xl space-y-1.5 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-950 px-10 py-2 text-center",
              "[&::-webkit-scrollbar-thumb]:bg-accent [&::-webkit-scrollbar]:size-1 [&::-webkit-scrollbar-thumb]:rounded-se-md [&::-webkit-scrollbar-thumb]:rounded-ee-md [&::-webkit-scrollbar-track]:rounded-se-md [&::-webkit-scrollbar-track]:rounded-ee-md [&::-webkit-scrollbar-track]:bg-neutral-950",
            )}
          >
            <h2 className="my-3 text-2xl text-green-500">Changelog</h2>
            <hr className="mb-2 border-neutral-800" />
            {Object.entries(grouped).map(([date, entries]) => (
              <div key={date}>
                <div className="sticky top-0 px-2 py-1 text-xs text-neutral-500">
                  {date}
                </div>
                {entries.map((change, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-2 text-left font-mono text-sm hover:bg-neutral-800 ${spaceMono.className}`}
                  >
                    <p className="space-x-1">
                      {change.type === "added" && (
                        <span className="text-sky-500">+</span>
                      )}
                      {change.type === "deleted" && (
                        <span className="text-rose-500">-</span>
                      )}
                      {change.type === "updated" && (
                        <span className="text-emerald-500">~</span>
                      )}
                      <span className="text-neutral-400">{change.name}</span>
                    </p>
                    <span className="text-xs text-neutral-500">
                      {formatDateTime(change.time)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
