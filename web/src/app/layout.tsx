import type { Metadata, Viewport } from "next";
import "./layout.css";
import { dm_sans } from "./fonts";
import { CSSProperties } from "react";
import { ServiceWorker } from "./components/ServiceWorker";

export const metadata: Metadata = {
  title: "Gym Rat",
  description: "Notion powered HiiT timer by Jamie Kosoy",
  applicationName: "Gym Rat",
  appleWebApp: {
    capable: true,
    title: "Gym Rat",
    // lets the purple background run up under the status bar / notch.
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#8254FF',
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
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
