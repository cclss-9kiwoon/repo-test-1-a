"use client";

import { motion } from "framer-motion";
import { Recommendation } from "@/types";
import { CUISINE_LABELS } from "@/lib/constants";
import { Clock, Sparkles, Coffee } from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

const CONFIDENCE_COLORS = {
  high: "bg-accent/10 text-accent border-accent/20",
  medium: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20",
  low: "bg-muted/10 text-muted border-muted/20",
};

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const { restaurantName, menuSuggestion, reasoning, cuisineCategory, estimatedTimeMinutes, confidence, complementaryTip } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-card-bg rounded-3xl p-5 border border-card-border shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          {restaurantName && (
            <h3 className="font-semibold text-base">{restaurantName}</h3>
          )}
          {menuSuggestion && (
            <p className="text-sm text-accent font-medium mt-0.5">{menuSuggestion}</p>
          )}
        </div>
        <span
          className={`text-[10px] px-2 py-1 rounded-full border font-medium ${CONFIDENCE_COLORS[confidence]}`}
        >
          {CUISINE_LABELS[cuisineCategory]}
        </span>
      </div>

      {/* Reasoning - the key differentiator */}
      <div className="bg-ai-bubble rounded-2xl p-3 mb-3">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="text-accent mt-0.5 shrink-0" />
          <p className="text-sm leading-relaxed">{reasoning}</p>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-3 text-xs text-muted">
        {estimatedTimeMinutes && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            약 {estimatedTimeMinutes}분
          </span>
        )}
      </div>

      {/* Complementary tip */}
      {complementaryTip && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-accent-secondary">
          <Coffee size={12} />
          {complementaryTip}
        </div>
      )}
    </motion.div>
  );
}
