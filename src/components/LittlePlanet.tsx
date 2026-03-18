"use client";

import { motion } from "framer-motion";

export default function LittlePlanet() {
  return (
    <div className="relative w-full flex justify-center items-center py-2">
      <svg
        viewBox="0 0 300 260"
        width="280"
        height="240"
        className="overflow-visible"
      >
        {/* Sunset glow behind planet */}
        <defs>
          <radialGradient id="sunsetGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#FFE08A" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FFD4C4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFF8F0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C42" />
          </radialGradient>
          <radialGradient id="planetGrad" cx="45%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#F5E6F0" />
            <stop offset="50%" stopColor="#E8D5E0" />
            <stop offset="100%" stopColor="#D4BFC8" />
          </radialGradient>
          <clipPath id="planetClip">
            <circle cx="150" cy="160" r="80" />
          </clipPath>
        </defs>

        {/* Background sunset glow */}
        <circle cx="150" cy="160" r="130" fill="url(#sunsetGlow)" />

        {/* Sun peeking behind the planet */}
        <motion.g
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Sun rays (soft) */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 195 + Math.cos(rad) * 22;
            const y1 = 100 + Math.sin(rad) * 22;
            const x2 = 195 + Math.cos(rad) * 34;
            const y2 = 100 + Math.sin(rad) * 34;
            return (
              <motion.line
                key={angle}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              />
            );
          })}
          {/* Sun body */}
          <circle cx="195" cy="100" r="18" fill="url(#sunGrad)" opacity="0.9" />
        </motion.g>

        {/* Planet */}
        <circle
          cx="150" cy="160" r="80"
          fill="url(#planetGrad)"
          stroke="#D4BFC8"
          strokeWidth="1.5"
        />

        {/* Planet surface details - subtle ring/texture */}
        <ellipse cx="150" cy="162" rx="78" ry="12" fill="none" stroke="#C8AABC" strokeWidth="0.5" opacity="0.3" />

        {/* Ground on top of planet - grassy area */}
        <g clipPath="url(#planetClip)">
          <ellipse cx="150" cy="82" rx="82" ry="8" fill="#A8D8A8" opacity="0.4" />
        </g>

        {/* Flowers on the planet surface (like the rose garden) */}
        {/* Flower 1 - left */}
        <g>
          <line x1="108" y1="95" x2="108" y2="82" stroke="#8B9E6B" strokeWidth="1.2" />
          <circle cx="108" cy="79" r="4" fill="#FFB5B5" />
          <circle cx="108" cy="79" r="2" fill="#FF8A8A" />
        </g>

        {/* Flower 2 */}
        <g>
          <line x1="120" y1="90" x2="120" y2="76" stroke="#8B9E6B" strokeWidth="1.2" />
          <circle cx="120" cy="73" r="3.5" fill="#FFDAA5" />
          <circle cx="120" cy="73" r="1.8" fill="#FFB86C" />
        </g>

        {/* Flower 3 - center */}
        <g>
          <line x1="140" y1="84" x2="140" y2="70" stroke="#8B9E6B" strokeWidth="1.2" />
          <circle cx="140" cy="67" r="4.5" fill="#FFB5B5" />
          <circle cx="140" cy="67" r="2.2" fill="#FF8A8A" />
        </g>

        {/* Flower 4 */}
        <g>
          <line x1="155" y1="82" x2="157" y2="68" stroke="#8B9E6B" strokeWidth="1" />
          <circle cx="157" cy="65" r="3" fill="#C4B5FD" />
          <circle cx="157" cy="65" r="1.5" fill="#A78BFA" />
        </g>

        {/* Grass tufts */}
        <g stroke="#8B9E6B" strokeWidth="1" fill="none" strokeLinecap="round">
          <path d="M95,98 Q96,88 98,85" />
          <path d="M98,97 Q100,90 97,84" />
          <path d="M168,84 Q170,76 172,73" />
          <path d="M172,85 Q174,78 171,74" />
          <path d="M185,90 Q187,82 189,79" />
          <path d="M188,91 Q190,85 187,80" />
        </g>

        {/* Tiny chair on the planet (어린왕자 reference) */}
        <g>
          {/* Chair legs */}
          <line x1="82" y1="112" x2="80" y2="104" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="90" y1="110" x2="88" y2="103" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" />
          {/* Chair seat */}
          <line x1="79" y1="104" x2="89" y2="102" stroke="#A0845C" strokeWidth="1.8" strokeLinecap="round" />
          {/* Chair back */}
          <line x1="79" y1="104" x2="77" y2="95" stroke="#A0845C" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Little character sitting (rice bowl buddy) */}
        <motion.g
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "82px 100px" }}
        >
          {/* Body */}
          <ellipse cx="82" cy="98" rx="6" ry="7" fill="#FFD4C4" />
          {/* Head */}
          <circle cx="82" cy="88" r="7" fill="#FFE5D0" />
          {/* Little scarf blowing */}
          <motion.path
            d="M86,90 Q94,86 98,88 Q95,90 92,88"
            fill="#7EC8B8"
            opacity="0.8"
            animate={{ d: ["M86,90 Q94,86 98,88 Q95,90 92,88", "M86,90 Q94,84 100,87 Q96,90 93,87", "M86,90 Q94,86 98,88 Q95,90 92,88"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Rice bowl the character is holding */}
          <ellipse cx="75" cy="97" rx="4" ry="3" fill="white" stroke="#E8D5E0" strokeWidth="0.8" />
          <path d="M72,96 Q75,93 78,96" fill="none" stroke="#FF9B7B" strokeWidth="0.8" />
          {/* Chopsticks */}
          <line x1="74" y1="94" x2="71" y2="89" stroke="#A0845C" strokeWidth="0.8" />
          <line x1="76" y1="94" x2="74" y2="89" stroke="#A0845C" strokeWidth="0.8" />
        </motion.g>

        {/* Stars twinkling */}
        {[
          { x: 40, y: 40, delay: 0 },
          { x: 260, y: 30, delay: 1 },
          { x: 30, y: 130, delay: 0.5 },
          { x: 270, y: 140, delay: 1.5 },
          { x: 55, y: 70, delay: 2 },
          { x: 245, y: 70, delay: 0.8 },
        ].map((star, i) => (
          <motion.circle
            key={i}
            cx={star.x}
            cy={star.y}
            r="1.5"
            fill="#FFD700"
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </svg>
    </div>
  );
}
