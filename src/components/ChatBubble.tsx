"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  role: "assistant" | "user";
  content: string;
  isTyping?: boolean;
}

export default function ChatBubble({ role, content, isTyping }: ChatBubbleProps) {
  const isAI = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex ${isAI ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
          isAI
            ? "bg-ai-bubble rounded-3xl rounded-tl-lg text-foreground"
            : "bg-user-bubble rounded-3xl rounded-tr-lg text-foreground"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-1 py-1 px-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 bg-accent/50 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        ) : (
          content
        )}
      </div>
    </motion.div>
  );
}
