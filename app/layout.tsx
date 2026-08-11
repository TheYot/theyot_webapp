import type { Metadata } from "next";
import { manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "The YOT",
  description: "The YOT restaurant and bar web app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className={`${manrope.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
