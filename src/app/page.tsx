import TokenInput from "@/components/token-input";
import { cookies } from "next/headers";
import ServerStatus from "@/components/server-status";
import ButtonGroup from "@/components/button-group";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sss-token")?.value;
  const isValidToken = token === process.env.TOKEN;

  return (
    <div className="font-minecraft mx-auto my-16 w-full max-w-md px-4 tracking-wide">
      <h1 className="font-minecraft-ten text-center text-4xl">
        Start/Stop Service
      </h1>

      <hr className="mt-3.5 border-neutral-700" />

      <ServerStatus />

      {!isValidToken ? <TokenInput /> : <ButtonGroup />}
    </div>
  );
}
