import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "AJ Applications",
    short_name: "AJ Apps",
    description: "Thoughtful tools for your everyday life.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f7f0",
    theme_color: "#526747",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
