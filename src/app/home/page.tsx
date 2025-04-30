import ButtonGroup from "@/components/button-group";
import ServerStatus from "@/components/server-status";
import { getCurrentSession } from "@/lib/auth/session";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import Link from "next/link";
import { SignOut } from "@phosphor-icons/react/dist/ssr";

const geist = Geist({ subsets: ["latin"], display: "swap", weight: "400" });

export default async function Home() {
  const { session } = await getCurrentSession();
  if (!session) return redirect("/");

  return (
    <div className="font-minecraft mx-auto my-16 w-full max-w-xl px-4 tracking-wide">
      <Image
        src="/minecraft_title.png"
        alt=""
        width={1024}
        height={170}
        className="mx-auto w-2/3"
        priority
      />

      <div className="mt-10 flex w-full items-end justify-between">
        <ServerStatus />
        <Link
          href={"/api/auth/sign-out"}
          className={cn(
            geist.className,
            "flex w-fit items-center gap-1 text-sm hover:underline",
            "text-rose-500 underline-offset-2",
          )}
        >
          <SignOut size={20} weight="fill" />
          Sair
        </Link>
      </div>
      <hr className="mt-3.5 border-neutral-800" />

      <div className="space-y-4">
        <ButtonGroup />
      </div>
    </div>
  );
}
