"use server";

import { ServerActionState } from "@/contexts/ServerActionContext";
import { getCurrentSession } from "@/lib/auth/session";

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

export async function startServer(): Promise<ServerActionState> {
  const { session } = await getCurrentSession();
  if (!session)
    return { type: "error", message: "Sessão inválida. Faça login novamente." };

  const res = await fetch(`${serverUrl}/api/v2/server/start`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.id}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const data = await res.json();
    return { type: "error", message: data.message };
  }

  return { type: "warning", message: "Ligando o servidor..." };
}

export async function stopServer(): Promise<ServerActionState> {
  const { session } = await getCurrentSession();
  if (!session)
    return { type: "error", message: "Sessão inválida. Faça login novamente." };

  const res = await fetch(`${serverUrl}/api/v2/server/stop`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.id}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const data = await res.json();
    return { type: "error", message: data.message };
  }

  return { type: "warning", message: "Desligando o servidor..." };
}

export async function restartServer(): Promise<ServerActionState> {
  const { session } = await getCurrentSession();
  if (!session)
    return { type: "error", message: "Sessão inválida. Faça login novamente." };

  const res = await fetch(`${serverUrl}/api/v2/server/restart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.id}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const data = await res.json();
    return { type: "error", message: data.message };
  }

  return { type: "warning", message: "Reiniciando o servidor..." };
}
