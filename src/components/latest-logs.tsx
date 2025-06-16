"use client";

import { cn } from "@/lib/utils";
import { Space_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const spaceMono = Space_Mono({ weight: "400", subsets: ["latin"] });

export default function LatestLog() {
  const [logLines, setLogLines] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const logRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v2/logs/latest`, {
        cache: "no-store",
      });
      const text = await res.text();
      setLogLines(text.split("\n"));
    } catch {
      setLogLines(["Failed to fetch logs"]);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const normalize = (txt: string) => txt.toLowerCase().replace(/\s+/g, "");
  const filtered = search
    ? logLines.filter((line) => normalize(line).includes(normalize(search)))
    : logLines;

  const colorLine = (line: string) => {
    if (/\b(error|severe)\b/i.test(line)) {
      return "text-red-500";
    }
    if (/\bwarn(ing)?\b/i.test(line)) {
      return "text-yellow-500";
    }
    return "text-neutral-300";
  };

  return (
    <div>
      <h2 className="text-2xl text-yellow-400">Latest Logs</h2>
      <hr className="mt-2.5 border-neutral-800" />

      <input
        type="text"
        placeholder="Search logs..."
        className="mt-4 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div
        ref={logRef}
        className={cn(
          spaceMono.className,
          "mt-4 h-96 w-full overflow-y-scroll rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-yellow-400 focus:outline-none md:max-w-[938px]",
        )}
      >
        {filtered.map((line, i) => (
          <p key={i} className={colorLine(line)}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
