import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const verifyToken = async () => {
  const token = localStorage.getItem("sss-token");
  const response = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URL + "/v1/verify-token",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    },
  );

  if (!response.ok) {
    return false;
  }

  return true;
};
