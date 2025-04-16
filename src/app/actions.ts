"use server";

import { ServerActionState } from "@/contexts/ServerActionContext";
import { sleep } from "@/lib/utils";
import { cookies } from "next/headers";

export async function removeToken(): Promise<ServerActionState> {
  const cookieStore = await cookies();
  cookieStore.delete("sss-token");
  return { success: true, message: "Token removido com sucesso" };
}

export async function startServer(): Promise<ServerActionState> {
  // await sleep(1000); //! Only for debugging
  try {
    const res = await fetch(process.env.SERVER_URL! + "/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", token: "123" }),
    });
    console.log(res);
    if (!res.ok) return { error: true, message: "Erro ao iniciar o servidor" };
    return { success: true, message: "Servidor INICIADO com sucesso" };
  } catch (error) {
    console.log(error);
  }
  return { error: true, message: "Falhar ao iniciar servidor" };
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
