import { deleteSessionTokenCookie } from "@/lib/auth/cookies";
import { getCurrentSession, invalidateSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function GET() {
  const { session } = await getCurrentSession();
  if (!session) return redirect("/");

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();

  redirect("/");
}
