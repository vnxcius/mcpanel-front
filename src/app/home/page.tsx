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
    <div className="font-minecraft mx-auto flex h-screen max-w-[1366px] flex-col gap-16 py-8 md:flex-row md:gap-6">
      <div className="mx-auto w-full max-w-xl px-4 md:max-w-prose lg:max-w-screen">
        <div className="flex h-full max-h-full flex-col justify-between gap-1.5 pb-4">
          <LatestLog />
          <div className="mb-3.5 flex w-full flex-1 items-end justify-between">
            <ServerStatus />
            <LogoutButton />
          </div>
          <ButtonGroup />
          <hr className="border-neutral-800" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg px-4 tracking-wide">
        <h2 className="text-2xl text-green-500">Server Info</h2>
        <hr className="mt-2.5 border-neutral-800" />
        <ServerInfo />
        <Modlist />
      </div>
    </div>
  );
}
