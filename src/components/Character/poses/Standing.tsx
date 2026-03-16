export function Standing({ color = '#4A90D9' }: { color?: string }) {
  return (
    <svg viewBox="0 0 48 64" width="40" height="52" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="24" cy="12" r="8" fill={color} />
      {/* Eyes */}
      <circle cx="21" cy="11" r="1.5" fill="white" />
      <circle cx="27" cy="11" r="1.5" fill="white" />
      <circle cx="21.5" cy="11" r="0.7" fill="#333" />
      <circle cx="27.5" cy="11" r="0.7" fill="#333" />
      {/* Body */}
      <ellipse cx="24" cy="32" rx="8" ry="12" fill={color} opacity="0.9" />
      {/* Arms */}
      <line x1="16" y1="26" x2="10" y2="36" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="26" x2="38" y2="36" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="20" y1="43" x2="18" y2="58" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="43" x2="30" y2="58" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="16" cy="59" rx="4" ry="2" fill={color} />
      <ellipse cx="32" cy="59" rx="4" ry="2" fill={color} />
    </svg>
  );
}
