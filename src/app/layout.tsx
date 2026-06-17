import type { Metadata } from "next";
import "@/styles/globals.css";
import DemoWrapper from "@/components/demo/DemoWrapper";

export const metadata: Metadata = {
  title: "NexusTrade · 高质感股票交易终端",
  description: "Professional stock trading terminal demo with glassmorphism UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <DemoWrapper>{children}</DemoWrapper>
      </body>
    </html>
  );
}
