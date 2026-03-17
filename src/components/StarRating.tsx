"use client";

import { motion } from "framer-motion";
import { SATISFACTION_LABELS } from "@/lib/constants";
import { SatisfactionLevel } from "@/types";

interface StarRatingProps {
  onSelect: (rating: SatisfactionLevel, label: string) => void;
}

export default function StarRating({ onSelect }: StarRatingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="flex gap-2">
        {([1, 2, 3, 4, 5] as SatisfactionLevel[]).map((n) => (
          <button
            key={n}
            onClick={() => onSelect(n, `${"★".repeat(n)} ${SATISFACTION_LABELS[n]}`)}
            className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl bg-card-bg border border-card-border hover:border-accent hover:bg-mood-happy/20 transition-all active:scale-95"
          >
            <span className="text-2xl">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
            <span className="text-[10px] text-muted">{SATISFACTION_LABELS[n]}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
