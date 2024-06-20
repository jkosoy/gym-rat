import type { Metadata, Viewport } from "next";
import "./layout.css";
import { dm_sans } from "./fonts";
import { CSSProperties, useEffect } from "react";

export const metadata: Metadata = {
  title: "Gym Rat",
  description: "Notion powered HiiT timer by Jamie Kosoy",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" style={{
      "--font-family": dm_sans.style.fontFamily
    } as CSSProperties}>
      <body>{children}</body>
    </html>
  );
}
