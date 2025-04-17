import ServerStatus from "@/components/server-status";
import TokenDependentUI from "@/components/token-dependent-ui";

export default async function Home() {
  return (
    <div className="font-minecraft mx-auto my-16 w-full max-w-md px-4 tracking-wide">
      <h1 className="font-minecraft-ten text-center text-4xl">
        Start/Stop Service
      </h1>

      <hr className="mt-3.5 border-neutral-700" />

      <ServerStatus />

      <TokenDependentUI />
    </div>
  );
}
