import type { Metadata } from "next";
import "@/styles/globals.css";
import DemoWrapper from "@/components/demo/DemoWrapper";

export const metadata: Metadata = {
  title: "NexusTrade - 股票交易界面 Demo",
  description:
    "A premium stock trading interface demo with market overview, sector exploration, chart switching, and mock trading flow.",
  openGraph: {
    title: "NexusTrade - 股票交易界面 Demo",
    description:
      "A premium stock trading interface demo with market overview, sector exploration, chart switching, and mock trading flow.",
    type: "website",
    siteName: "NexusTrade",
  },
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
