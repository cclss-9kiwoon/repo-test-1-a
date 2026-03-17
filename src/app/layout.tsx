import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "MindPick - AI 심리 테스트",
  description: "졸릴 때 1~3분 안에 하는 AI 심리 테스트. 당신의 숨겨진 성격을 알아보세요.",
  openGraph: {
    title: "MindPick - AI 심리 테스트",
    description: "졸릴 때 1~3분 안에 하는 AI 심리 테스트",
    type: "website",
  },
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
        <div className="min-h-screen flex flex-col">
          <header className="px-4 py-4 border-b border-card-border">
            <div className="max-w-lg mx-auto">
              <a href="/" className="text-xl font-bold text-accent-light">
                MindPick
              </a>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="px-4 py-6 border-t border-card-border text-center text-sm text-gray-500">
            MindPick &copy; 2026
          </footer>
        </div>
      </body>
    </html>
  );
}
