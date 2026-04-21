import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CommandPalette } from "@/components/CommandPalette";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oracle EPM Planning Modules — Interactive Guide",
  description:
    "A visual architecture reference for Oracle 1Z0-1080 certification and EPM consulting onboarding.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plexSans.variable} ${plexMono.variable} grain antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('epm-theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`}
        </Script>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-[var(--primary)] focus:px-3 focus:py-1.5 focus:text-sm focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Nav />
        <CommandPalette />
        <div id="main-content" className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
