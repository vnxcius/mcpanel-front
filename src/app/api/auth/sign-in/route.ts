import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import * as argon2 from "argon2";
import { createSession, generateSessionToken } from "@/lib/auth/session";
import { setSessionTokenCookie } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  const { password } = await loginSchema.parseAsync(await request.json());

  const pepper = process.env.HASH_PEPPER;
  if (!pepper) {
    return NextResponse.json(
      { type: "error", message: "Missing hashing pepper" },
      { status: 500 },
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: 1 } });
    if (!user) {
      return NextResponse.json(
        { type: "error", message: "Usuário não foi encontrado" },
        { status: 404 },
      );
    }

    const passwordMatches = await argon2.verify(user.password, password, {
      secret: Buffer.from(pepper),
    });

    if (!passwordMatches) {
      return NextResponse.json(
        {
          type: "error",
          message: "Token incorreto",
        },
        { status: 401 },
      );
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expires_at);

    return NextResponse.json({
      success: true,
      message: "Login efetuado com sucesso.",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
