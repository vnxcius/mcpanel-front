import type { Metadata } from "next";
import "./globals.css";
import { ServerActionProvider } from "@/contexts/ServerActionContext";
import { ServerStatusProvider } from "@/contexts/ServerStatusContext";

export const metadata: Metadata = {
  title: "Start/Stop Service | SSS Minecraft",
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
        <ServerStatusProvider>
          <ServerActionProvider>{children}</ServerActionProvider>
        </ServerStatusProvider>
      </body>
    </html>
  );
}
