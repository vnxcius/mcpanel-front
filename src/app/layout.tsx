import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import SessionProvider from "@/contexts/SessionContext";
import { ServerProviders } from "@/providers";

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
            <ServerProviders>{children}</ServerProviders>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
