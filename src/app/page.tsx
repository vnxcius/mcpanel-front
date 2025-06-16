import ServerInfo from "@/components/server-info";
import ServerStatus from "@/components/server-status";
import TokenInput from "@/components/token-input";
import { getCurrentSession } from "@/lib/auth/session";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
  const { session } = await getCurrentSession();
  if (session) return redirect("/home");
  return (
    <div className="font-minecraft mx-auto my-16 w-full max-w-xl px-4 tracking-wide">
      <div className="mt-10 flex w-full items-end justify-between">
        <ServerStatus />
      </div>

      <hr className="mt-3.5 border-neutral-800" />

      <ServerInfo />
      <TokenInput />
    </div>
  );
}
