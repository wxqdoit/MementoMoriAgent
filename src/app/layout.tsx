import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Provider } from "@/context/Web3Provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memento Mori Agent — Autonomous Filecoin Storage Runway Sentinel",
  description: "An autonomous AI agent that monitors its Filecoin Pay storage balance & runway in real-time, performing cognitive compaction and synaptic triage as epochs decline.",
  keywords: ["Filecoin", "Filecoin Pay", "Reown AppKit", "AI Agent", "Storage Runway", "Memento Mori", "IPFS", "Autonomous Agent"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full bg-[#070A0F]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#070A0F] text-slate-100 antialiased`}
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
