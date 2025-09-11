// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"] });

// --- Global metadata for the entire app ---
export const metadata: Metadata = {
  title: {
    default: "NicheFire - Find The Next Viral Hit",
    template: "%s | NicheFire", // Child pages can override
  },
  description: "NicheFire uses autonomous bots to scan YouTube Shorts 24/7, identifying viral outliers before they hit the mainstream. Stop guessing, start discovering.",
  // Optional icons for browser tabs / devices
  // icons: [
  //   { rel: "icon", url: "/favicon.ico" },
  //   { rel: "apple-touch-icon", url: "/favicon-192.png" }
  // ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
