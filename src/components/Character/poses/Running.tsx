export function Running({ color = '#4A90D9' }: { color?: string }) {
  return (
    <svg viewBox="0 0 56 64" width="46" height="52" xmlns="http://www.w3.org/2000/svg">
      {/* Motion lines */}
      <line x1="2" y1="20" x2="10" y2="20" stroke={color} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="0" y1="28" x2="9" y2="28" stroke={color} strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      <line x1="3" y1="36" x2="11" y2="36" stroke={color} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      {/* Head (tilted forward) */}
      <circle cx="30" cy="10" r="8" fill={color} />
      {/* Eyes (determined look) */}
      <circle cx="28" cy="9" r="1.5" fill="white" />
      <circle cx="34" cy="9" r="1.5" fill="white" />
      <circle cx="28.8" cy="9" r="0.7" fill="#333" />
      <circle cx="34.8" cy="9" r="0.7" fill="#333" />
      {/* Mouth (grin) */}
      <path d="M 29 14 Q 32 16 35 14" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Body (leaning forward) */}
      <ellipse cx="26" cy="30" rx="8" ry="11" fill={color} opacity="0.9" transform="rotate(-10, 26, 30)" />
      {/* Arms (swinging) */}
      <line x1="19" y1="24" x2="12" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="33" y1="26" x2="42" y2="34" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Legs (stride) */}
      <line x1="22" y1="40" x2="14" y2="54" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="40" x2="38" y2="54" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="12" cy="55" rx="4" ry="2" fill={color} />
      <ellipse cx="40" cy="55" rx="4" ry="2" fill={color} />
    </svg>
  );
}
