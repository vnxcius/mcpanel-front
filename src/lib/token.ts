"use server";

import { cookies } from "next/headers";
import { cache } from "react";

export const ValidToken = cache(async (): Promise<string> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("sss-token")?.value;
  if (!token) return "";

  const isValid = token === process.env.TOKEN;
  if (isValid) return token;

  return "";
});
