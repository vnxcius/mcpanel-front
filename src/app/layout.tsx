import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { ServerStatusProvider } from "@/contexts/ServerStatusContext";
import SessionProvider from "@/contexts/SessionContext";

export const metadata: Metadata = {
  title: "Painel | ronaldo.vncius.dev",
  description: "Start/Stop Service Minecraft Server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider>
          <ToastProvider>
            <ServerStatusProvider>{children}</ServerStatusProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
