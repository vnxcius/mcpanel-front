import { getCurrentSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  const { user, session } = await getCurrentSession();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  user.password = "";
  return NextResponse.json({ session });
}
