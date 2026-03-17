"use client";

import ConversationFlow from "@/components/ConversationFlow";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LogPage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Link
          href="/"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-card-border/50 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-base font-semibold">점심 기록</h1>
          <p className="text-xs text-muted">오늘 뭐 먹었는지 알려줘!</p>
        </div>
      </div>
      <ConversationFlow />
    </div>
  );
}
