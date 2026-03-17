import type { Metadata } from "next";
import { Geist } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "점심 친구",
  description: "오늘 점심 뭐 먹지? AI가 친구처럼 추천해주는 점심 도우미",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} antialiased`}>
        <main className="max-w-lg mx-auto min-h-screen pb-safe">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
