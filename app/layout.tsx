import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ModalProvider } from "./ui/modal-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
        className={`${inter.className} h-full selection:bg-blue-100 selection:text-blue-900`}
      >
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
