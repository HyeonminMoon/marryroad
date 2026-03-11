import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
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
  title: "MarryRoad - 결혼 준비를 게임처럼",
  description: "137개의 결혼 준비 과정을 14개의 퀘스트로 재구성. 게임하듯이 하나하나 깨가면서 결혼 준비를 즐겁게 할 수 있도록 돕는 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
