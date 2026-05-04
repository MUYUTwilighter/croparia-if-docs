import type { Metadata } from "next";
import "./globals.css";
import { MuiProvider } from "@/src/components/mui-provider";

export const metadata: Metadata = {
  title: "Croparia IF Docs",
  description: "Croparia IF 多语言多版本文档站原型",
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
