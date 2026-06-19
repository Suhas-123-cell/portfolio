import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { CRTProvider } from "@/lib/crt-context";
import { CRTToggle } from "@/components/CRTToggle";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Suhas Chowdary | Portfolio",
  description: "AI Engineer & Full Stack Developer. Insert coin to continue.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body className="min-h-dvh bg-crt-bg text-crt-amber-bright overflow-x-hidden">
        <CRTProvider>
          <div className="fixed top-3 right-3 z-50">
            <CRTToggle />
          </div>
          {children}
        </CRTProvider>
      </body>
    </html>
  );
}
