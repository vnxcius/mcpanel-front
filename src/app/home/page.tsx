import LatestLog from "@/components/latest-logs";
import ButtonLogout from "@/components/button-logout";
import Modlist from "@/components/modlist";
import ServerInfo from "@/components/server-info";
import ServerStatus from "@/components/server-status";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const { session } = await getCurrentSession();
  if (!session) return redirect("/");

  return (
    <div className="font-minecraft w-full md:flex md:h-svh md:flex-col md:items-center">
      <div className="flex h-full w-full max-w-[1568px] flex-col gap-5 p-5 md:flex-row">
        <div className="flex h-full w-full flex-col justify-between gap-1.5 md:w-2/3 md:flex-1">
          <h2 className="text-xl leading-none text-yellow-400">Latest Logs</h2>
          <hr className="border-neutral-800" />
          <LatestLog />
          <div className="mb-3.5 flex flex-1 items-end justify-between">
            <ServerStatus />
            <ButtonLogout />
          </div>
          <hr className="border-neutral-800" />
        </div>

        <div className="mx-auto mb-20 flex h-full w-full max-w-xs flex-col gap-2 tracking-wide md:flex-1">
          <Modlist />
          <div className="rounded-md border border-neutral-800 bg-[#111111] p-3">
            <ServerInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
