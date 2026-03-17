"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Sparkles, Clock } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/log", icon: MessageCircle, label: "기록" },
  { href: "/recommend", icon: Sparkles, label: "추천" },
  { href: "/history", icon: Clock, label: "히스토리" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card-bg/80 backdrop-blur-xl border-t border-card-border">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 ${
                active
                  ? "text-accent bg-accent-light/40 scale-105"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
