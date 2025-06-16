import ButtonGroup from "@/components/button-group";
import LogoutButton from "@/components/logout-button";
import ServerInfo from "@/components/server-info";
import ServerStatus from "@/components/server-status";
import { getCurrentSession } from "@/lib/auth/session";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const { session } = await getCurrentSession();
  if (!session) return redirect("/");

  return (
    <div className="font-minecraft mx-auto my-16 w-full max-w-xl px-4 tracking-wide">
      <div className="mt-10 flex w-full items-end justify-between">
        <ServerStatus />
        <LogoutButton />
      </div>
      <hr className="mt-3.5 border-neutral-800" />

      <ServerInfo />
      <div className="space-y-4">
        <ButtonGroup />
      </div>
    </div>
  );
}
