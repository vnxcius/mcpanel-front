import ButtonGroup from "@/components/button-group";
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
    <div className="font-minecraft mx-auto my-8 flex max-w-[1366px] flex-col items-start gap-16 md:flex-row md:gap-6">
      <div className="max-w-sm space-y-4 px-4 md:max-w-screen">
        <LatestLog />
        <ButtonGroup />
        <div className="flex w-full items-end justify-between">
          <ServerStatus />
          <LogoutButton />
        </div>
        <hr className="mt-3.5 border-neutral-800" />
      </div>
      <div className="w-full max-w-xl px-4 tracking-wide">
        <h2 className="text-2xl text-green-500">Server Info</h2>
        <hr className="mt-2.5 border-neutral-800" />
        <ServerInfo />
        <Modlist />
      </div>
    </div>
  );
}
