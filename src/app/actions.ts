"use server";

import { ToastState } from "@/contexts/ToastContext";
import { getCurrentSession } from "@/lib/auth/session";

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

export async function startServer(): Promise<ToastState> {
  const { session } = await getCurrentSession();
  if (!session)
    return { type: "error", message: "Sessão inválida. Faça login novamente." };

  const res = await fetch(`${serverUrl}/api/v2/signed/server/start`, {
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

  return { type: "info", message: "Ligando o servidor..." };
}

export async function stopServer(): Promise<ToastState> {
  const { session } = await getCurrentSession();
  if (!session)
    return { type: "error", message: "Sessão inválida. Faça login novamente." };

  const res = await fetch(`${serverUrl}/api/v2/signed/server/stop`, {
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

  return { type: "info", message: "Desligando o servidor..." };
}

export async function restartServer(): Promise<ToastState> {
  const { session } = await getCurrentSession();
  if (!session)
    return { type: "error", message: "Sessão inválida. Faça login novamente." };

  const res = await fetch(`${serverUrl}/api/v2/signed/server/restart`, {
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

  return { type: "info", message: "Reiniciando o servidor..." };
}

export async function uploadMod(formData: FormData): Promise<ToastState> {
  const { session } = await getCurrentSession();
  if (!session)
    return { type: "error", message: "Sessão inválida. Faça login novamente." };

  const res = await fetch(`${serverUrl}/api/v2/signed/mod/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.id}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    return { type: "error", message: data.error };
  }

  return { type: "success", message: "Mods carregados com sucesso!" };
}

export async function deleteMod(name: string): Promise<ToastState> {
  const { session } = await getCurrentSession();
  if (!session)
    return { type: "error", message: "Sessão inválida. Faça login novamente." };

  const res = await fetch(`${serverUrl}/api/v2/signed/mod/delete/${name}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.id}`,
    },
  });
  if (!res.ok) {
    const data = await res.json();
    return { type: "error", message: data.error };
  }

  return { type: "success", message: "Mod removido com sucesso!" };
}
