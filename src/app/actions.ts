"use server";

import { ServerActionState } from "@/contexts/ServerActionContext";
import { sleep } from "@/lib/utils";
import { cookies } from "next/headers";

export async function removeToken(): Promise<ServerActionState> {
  const cookieStore = await cookies();
  cookieStore.delete("sss-token");
  return { success: true, message: "Token removido com sucesso" };
}

export async function stopServer(): Promise<ServerActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sss-token")?.value;
  if (token !== process.env.TOKEN) {
    return { error: false, message: "Token inválido" };
  }

  // await sleep(1000); //! Only for debugging
  return { success: true, message: "Servidor PARADO com sucesso" };
}

export async function restartServer(): Promise<ServerActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sss-token")?.value;
  if (token !== process.env.TOKEN) {
    return { error: false, message: "Token inválido" };
  }

  await sleep(1000); //! Only for debugging
  return { success: true, message: "Servidor REINICIADO com sucesso" };
}
