import type { Metadata } from "next";
import "./globals.css";
import "@/src/components/game/game-widgets.css";
import { MuiProvider } from "@/src/components/mui-provider";

export const metadata: Metadata = {
  title: "Croparia IF Docs",
  description: "Croparia IF 多语言多版本文档站原型",
  icons: {
    icon: [
      {
        url: "/assets/logo.webp",
        type: "image/webp",
      },
    ],
    shortcut: ["/assets/logo.webp"],
    apple: [
      {
        url: "/assets/logo.webp",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
