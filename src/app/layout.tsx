import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TicketGo - Nobar Solo Paragon",
  description: "Ticketing System for Nobar Piala Dunia 2026 at Solo Paragon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}