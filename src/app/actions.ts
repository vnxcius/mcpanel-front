"use server";

import { ServerActionState } from "@/contexts/ServerActionContext";
import { sleep } from "@/lib/utils";
import { cookies } from "next/headers";

export async function storeToken(
  prevState: { message: string },
  formData: FormData,
): Promise<ServerActionState> {
  const token = formData.get("token") as string;
  if (token.length <= 0) {
    return { warning: true, message: "Preencha o token corretamente" };
  }
  if (token !== process.env.TOKEN) {
    console.log(token);
    return { error: true, message: "Token inválido" };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "sss-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 15,
    path: "/",
    sameSite: "lax",
  });

  return { success: true, message: "Token armazenado com sucesso" };
}

export async function removeToken(): Promise<ServerActionState> {
  const cookieStore = await cookies();
  cookieStore.delete("sss-token");
  return { success: true, message: "Token removido com sucesso" };
}

export async function startServer(): Promise<ServerActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sss-token")?.value;
  if (token !== process.env.TOKEN) {
    return { error: false, message: "Token inválido" };
  }

  await sleep(1000); //! Only for debugging
  return { success: true, message: "Servidor INICIADO com sucesso" };
}

export async function stopServer(): Promise<ServerActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sss-token")?.value;
  if (token !== process.env.TOKEN) {
    return { error: false, message: "Token inválido" };
  }

  await sleep(1000); //! Only for debugging
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
