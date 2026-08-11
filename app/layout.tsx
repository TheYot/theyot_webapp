import type { Metadata, Viewport } from "next";
import { manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "The YOT",
  description: "The YOT restaurant and bar — order, reserve, and dine smarter.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4E3A25",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className={`${manrope.className} min-h-dvh flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
