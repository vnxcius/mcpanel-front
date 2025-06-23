"use client";

import { Mod } from "@/components/modlist";
import { ColumnDef } from "@tanstack/react-table";
import { ModlistAction } from "@/components/modlist-action";
import { ArrowsDownUpIcon, CopyIcon } from "@phosphor-icons/react";

export const columns: ColumnDef<Mod>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center text-neutral-500 hover:text-neutral-300"
        >
          <ArrowsDownUpIcon size={20} weight="bold" className="mr-1 min-w-5" />
          Nome
        </button>
      );
    },
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      return (
        <button
          title={name}
          onClick={() => navigator.clipboard.writeText(name)}
          className="group flex w-52 items-center truncate text-sm text-gray-300"
        >
          <span className="text-accent mr-1.5">{row.index + 1}.</span>
          <span className="truncate group-hover:underline">{name}</span>
          <CopyIcon
            size={18}
            className="ml-1 hidden min-w-[18px] group-hover:inline"
          />
        </button>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div className="w-fit text-right text-neutral-500">Ações</div>;
    },
    cell: ({ row }) => {
      const mod = row.original;

      return (
        <div className="w-fit text-right text-xs text-green-800">
          <ModlistAction name={mod.name} />
        </div>
      );
    },
  },
];
