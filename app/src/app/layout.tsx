import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./layout.css";

export const metadata: Metadata = {
  title: "Gym Rat",
  description: "Notion powered HiiT timer by Jamie Kosoy",
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
