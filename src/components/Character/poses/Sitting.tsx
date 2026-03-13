export function Sitting({ color = '#4A90D9', showCheck = false }: { color?: string; showCheck?: boolean }) {
  return (
    <svg viewBox="0 0 48 64" width="40" height="52" xmlns="http://www.w3.org/2000/svg">
      {/* Check mark or pause icon */}
      {showCheck && (
        <path d="M 18 4 L 22 9 L 32 0" stroke="#4CAF50" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {!showCheck && (
        <>
          <rect x="20" y="1" width="3" height="8" rx="1" fill="#FF9800" />
          <rect x="26" y="1" width="3" height="8" rx="1" fill="#FF9800" />
        </>
      )}
      {/* Head */}
      <circle cx="24" cy="18" r="8" fill={color} />
      {/* Eyes (relaxed / closed) */}
      {showCheck ? (
        <>
          <path d="M 20 17 Q 22 19 24 17" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 25 17 Q 27 19 29 17" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="21" cy="17" r="1.5" fill="white" />
          <circle cx="27" cy="17" r="1.5" fill="white" />
          <circle cx="21.5" cy="17" r="0.7" fill="#333" />
          <circle cx="27.5" cy="17" r="0.7" fill="#333" />
        </>
      )}
      {/* Body (shorter, seated) */}
      <ellipse cx="24" cy="35" rx="9" ry="9" fill={color} opacity="0.9" />
      {/* Arms (resting on sides) */}
      <line x1="15" y1="32" x2="10" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="33" y1="32" x2="38" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Legs (extended forward) */}
      <line x1="20" y1="43" x2="14" y2="52" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="43" x2="34" y2="52" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="12" cy="53" rx="4" ry="2" fill={color} />
      <ellipse cx="36" cy="53" rx="4" ry="2" fill={color} />
    </svg>
  );
}
