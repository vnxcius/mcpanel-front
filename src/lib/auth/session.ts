import type { User, Session } from "@prisma/client";
import prisma from "@/lib/prisma";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { cache } from "react";
import { cookies } from "next/headers";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const sessionToken = encodeBase32LowerCaseNoPadding(bytes);
  return sessionToken;
}

export async function createSession(
  token: string,
  userId: number,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    user_id: userId,
    expires_at: new Date(
      Date.now() + 36000 * 24 * 30, // 30 days
    ),
  };

  await prisma.session.create({ data: session });
  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (result === null) return { session: null, user: null };

  const { user, ...session } = result;
  if (Date.now() >= session.expires_at.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }

  // If the session is within 45 days of expiring, extend it
  if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 45) {
    session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
    await prisma.session.update({
      where: { id: session.id },
      data: { expires_at: session.expires_at },
    });
  }

  return { session, user };
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(id: number): Promise<void> {
  await prisma.session.deleteMany({ where: { user_id: id } });
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
