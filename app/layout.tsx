import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
