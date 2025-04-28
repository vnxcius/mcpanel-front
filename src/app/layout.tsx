import type { Metadata } from "next";
import "./globals.css";
import { ServerActionProvider } from "@/contexts/ServerActionContext";
import { ServerStatusProvider } from "@/contexts/ServerStatusContext";

export const metadata: Metadata = {
  title: "ServerHub | mmfc.vncius.dev",
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
        <ServerActionProvider>
          <ServerStatusProvider>{children}</ServerStatusProvider>
        </ServerActionProvider>
      </body>
    </html>
  );
}
