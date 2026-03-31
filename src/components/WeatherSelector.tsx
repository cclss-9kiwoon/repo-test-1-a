"use client";

import { motion } from "framer-motion";
import { WEATHER_OPTIONS } from "@/lib/constants";
import { WeatherFeeling } from "@/types";

interface WeatherSelectorProps {
  onSelect: (weather: WeatherFeeling, label: string) => void;
}

export default function WeatherSelector({ onSelect }: WeatherSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-4 gap-2"
    >
      {WEATHER_OPTIONS.map(({ value, emoji, label }) => (
        <button
          key={value}
          onClick={() => onSelect(value, `${emoji} ${label}`)}
          className="flex flex-col items-center gap-1 py-3 px-1 rounded-2xl bg-card-bg border border-card-border hover:border-accent-secondary hover:bg-accent-secondary-light/20 transition-all active:scale-95"
        >
          <span className="text-2xl">{emoji}</span>
          <span className="text-[10px] text-muted leading-tight text-center">{label}</span>
        </button>
      ))}
    </motion.div>
  );
}
