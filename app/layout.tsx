import type { Metadata, Viewport } from "next";
import { ServiceWorker } from "./service-worker";
import "./globals.css";
export const metadata: Metadata = {
  title: "AJ — Applications",
  description: "The AJ personal application directory.",
  applicationName: "AJ Applications",
  appleWebApp: { capable: true, title: "AJ Apps", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};
export const viewport: Viewport = { themeColor: "#526747" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}<ServiceWorker /></body>
    </html>
  );
}
