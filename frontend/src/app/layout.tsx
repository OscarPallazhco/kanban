import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launch week | Kanban",
  description: "A simple, focused workspace for moving work forward.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
