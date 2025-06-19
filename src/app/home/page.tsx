import LatestLog from "@/components/latest-logs";
import LogoutButton from "@/components/logout-button";
import Modlist from "@/components/modlist";
import ServerInfo from "@/components/server-info";
import ServerStatus from "@/components/server-status";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const { session } = await getCurrentSession();
  if (!session) return redirect("/");

  return (
    <div className="font-minecraft h-svh w-full md:flex md:flex-col md:items-center">
      <div className="flex h-full w-full max-w-[1366px] flex-col gap-5 p-5 md:flex-row md:flex-wrap">
        <div className="flex h-full w-full flex-col justify-between gap-1.5 pb-4 md:w-2/3 md:flex-1">
          <h2 className="text-2xl leading-none text-yellow-400">Latest Logs</h2>
          <hr className="border-neutral-800" />
          <LatestLog />
          <div className="mb-3.5 flex flex-1 items-end justify-between">
            <ServerStatus />
            <LogoutButton />
          </div>
          <hr className="border-neutral-800" />
        </div>

        <div className="h-full min-h-max overflow-hidden tracking-wide md:min-h-[400px] md:w-1/3 md:flex-1">
          <h2 className="text-2xl leading-none text-green-500">Server Info</h2>
          <hr className="mt-1.5 border-neutral-800" />
          <div className="flex h-full flex-col pb-12">
            <ServerInfo />
            <Modlist />
            <hr className="mt-2.5 border-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
