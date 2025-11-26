import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ModalProvider } from "./ui/modal-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Freelance tools",
  description: "Whatever you need to get the job done",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} h-full bg-[#ffffff] text-[#37352f] antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
