"use server";

import { ServerActionState } from "@/contexts/ServerActionContext";
import { cookies } from "next/headers";

export async function removeToken(): Promise<ServerActionState> {
  const cookieStore = await cookies();
  cookieStore.delete("sss-token");
  return { success: true, message: "Token removido com sucesso" };
}
