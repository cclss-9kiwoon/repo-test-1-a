"use client";

import { useRef, useEffect } from "react";
import { useConversation } from "@/hooks/useConversation";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import QuickReplies from "./QuickReplies";
import MoodSelector from "./MoodSelector";
import WeatherSelector from "./WeatherSelector";
import StarRating from "./StarRating";
import Link from "next/link";
import { Home } from "lucide-react";

export default function ConversationFlow() {
  const { state, processUserInput } = useConversation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages.length]);

  const lastAiMsg = [...state.messages].reverse().find((m) => m.role === "assistant");
  const showSpecialInput = lastAiMsg && !state.isComplete;

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4 space-y-3">
        {state.messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <div className="px-4 pb-4 space-y-3">
        {state.isComplete ? (
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-accent text-white font-medium transition-all active:scale-[0.98]"
          >
            <Home size={18} />
            홈으로 돌아가기
          </Link>
        ) : (
          <>
            {/* Special input components */}
            {showSpecialInput && lastAiMsg?.inputType === "weather" && (
              <WeatherSelector
                onSelect={(weather, label) => processUserInput(label)}
              />
            )}
            {showSpecialInput && lastAiMsg?.inputType === "mood" && (
              <MoodSelector
                onSelect={(mood, label) => processUserInput(label)}
              />
            )}
            {showSpecialInput && lastAiMsg?.inputType === "rating" && (
              <StarRating
                onSelect={(rating, label) => processUserInput(label)}
              />
            )}

            {/* Quick replies */}
            {showSpecialInput &&
              lastAiMsg?.quickReplies &&
              lastAiMsg.inputType !== "weather" &&
              lastAiMsg.inputType !== "mood" &&
              lastAiMsg.inputType !== "rating" && (
                <QuickReplies
                  options={lastAiMsg.quickReplies}
                  onSelect={processUserInput}
                />
              )}

            {/* Text input (always visible unless complete) */}
            <ChatInput
              onSend={processUserInput}
              placeholder={
                lastAiMsg?.inputType === "text"
                  ? "자유롭게 입력해줘..."
                  : "또는 직접 입력..."
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
