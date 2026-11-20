import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gym Rat",
    short_name: "Gym Rat",
    description: "Notion powered HiiT timer",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#8254FF",
    theme_color: "#8254FF",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
