"use client";

import { motion } from "framer-motion";
import { MOOD_OPTIONS } from "@/lib/constants";
import { MoodLevel } from "@/types";

interface MoodSelectorProps {
  onSelect: (mood: MoodLevel, label: string) => void;
}

export default function MoodSelector({ onSelect }: MoodSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-3 gap-2"
    >
      {MOOD_OPTIONS.map(({ value, emoji, label }) => (
        <button
          key={value}
          onClick={() => onSelect(value, `${emoji} ${label}`)}
          className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl bg-card-bg border border-card-border hover:border-accent hover:bg-ai-bubble transition-all active:scale-95"
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-xs text-muted">{label}</span>
        </button>
      ))}
    </motion.div>
  );
}
