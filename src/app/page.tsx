import ServerStatus from "@/components/server-status";
import TokenDependentUI from "@/components/token-dependent-ui";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="font-minecraft mx-auto my-16 w-full max-w-xl px-4 tracking-wide">
      <Image
        src="/minecraft_title.png"
        alt=""
        width={1024}
        height={170}
        className="mx-auto w-2/3"
      />

      <ServerStatus />
      <hr className="mt-3.5 border-neutral-800" />

      <TokenDependentUI />
    </div>
  );
}
