import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "AJ — Applications",
  description: "The AJ personal application directory.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
