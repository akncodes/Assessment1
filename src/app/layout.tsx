import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";

import { SiteHeader } from "@/components/SiteHeader";
import { getCurrentUserProfile } from "@/lib/auth";

import "./globals.css";

const headingFont = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inkwise - AI Blogging Platform",
  description: "A Next.js, Supabase, and Google AI powered blogging platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentUserProfile();

  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader profile={profile} />
        {children}
        <footer className="mt-auto border-t border-black/10 bg-(--paper)/80">
          <div className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-(--ink-soft) md:px-6">
            BlogSpace • Built for clean publishing workflows
          </div>
        </footer>
      </body>
    </html>
  );
}
