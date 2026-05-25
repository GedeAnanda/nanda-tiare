import type { Metadata, Viewport } from "next";
import { Caveat, Quicksand, Fredoka } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nanda 💗 Tiare — Happy 2 Years",
  description: "Website anniversary yang dibuat Nanda khusus buat Tiare. Happy 2 Years, sayang! 🎀",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFF8F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${caveat.variable} ${quicksand.variable} ${fredoka.variable}`}>
      <body className="font-body antialiased bg-cream">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
