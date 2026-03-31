"use client";

import { motion } from "framer-motion";

interface QuickRepliesProps {
  options: string[];
  onSelect: (option: string) => void;
}

export default function QuickReplies({ options, onSelect }: QuickRepliesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className="px-4 py-2 text-sm rounded-full bg-card-bg border border-card-border text-foreground hover:border-accent hover:bg-ai-bubble transition-all active:scale-95"
        >
          {option}
        </button>
      ))}
    </motion.div>
  );
}
