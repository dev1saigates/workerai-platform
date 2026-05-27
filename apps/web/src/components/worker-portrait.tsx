/**
 * Semi-realistic illustrated portraits for AI workers (local SVG — no external CDN).
 * Each worker has a distinct look; used in chat and worker cards.
 */

type PortraitPalette = {
  skin: string;
  skinShadow: string;
  hair: string;
  hairHighlight: string;
  shirt: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
};

const PORTRAITS: Record<string, PortraitPalette> = {
  "executive-assistant": {
    skin: "#e8b896",
    skinShadow: "#c9956e",
    hair: "#2c1810",
    hairHighlight: "#4a3020",
    shirt: "#1e3a5f",
    bgFrom: "#0a1628",
    bgTo: "#0066ff",
    accent: "#00b4ff",
  },
  receptionist: {
    skin: "#f0c9a8",
    skinShadow: "#d4a574",
    hair: "#8b4513",
    hairHighlight: "#a0522d",
    shirt: "#0066cc",
    bgFrom: "#051018",
    bgTo: "#0088ff",
    accent: "#00d4ff",
  },
  "blog-writer": {
    skin: "#d4a574",
    skinShadow: "#b8864a",
    hair: "#1a1a1a",
    hairHighlight: "#333",
    shirt: "#2d4a3e",
    bgFrom: "#0a1410",
    bgTo: "#0066aa",
    accent: "#00b4ff",
  },
  "social-manager": {
    skin: "#e8c4a0",
    skinShadow: "#c9a06e",
    hair: "#4a2511",
    hairHighlight: "#6b3a1a",
    shirt: "#5b21b6",
    bgFrom: "#100818",
    bgTo: "#0066ff",
    accent: "#00b4ff",
  },
  "customer-success": {
    skin: "#c68642",
    skinShadow: "#a66b30",
    hair: "#0f0f0f",
    hairHighlight: "#2a2a2a",
    shirt: "#0369a1",
    bgFrom: "#080c14",
    bgTo: "#0080ff",
    accent: "#38bdf8",
  },
  "finance-clerk": {
    skin: "#f5d0b0",
    skinShadow: "#d4a880",
    hair: "#6b5344",
    hairHighlight: "#8b6b54",
    shirt: "#1e40af",
    bgFrom: "#0a0e18",
    bgTo: "#0044aa",
    accent: "#00b4ff",
  },
};

const DEFAULT_PALETTE: PortraitPalette = {
  skin: "#e8b896",
  skinShadow: "#c9956e",
  hair: "#333",
  hairHighlight: "#555",
  shirt: "#0066ff",
  bgFrom: "#050810",
  bgTo: "#00b4ff",
  accent: "#00b4ff",
};

export function WorkerPortrait({
  slug,
  className = "h-full w-full",
}: {
  slug: string;
  className?: string;
}) {
  const p = PORTRAITS[slug] ?? DEFAULT_PALETTE;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`bg-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.bgFrom} />
          <stop offset="100%" stopColor={p.bgTo} />
        </linearGradient>
        <linearGradient id={`glow-${slug}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={p.accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#bg-${slug})`} />
      <ellipse cx="50" cy="88" rx="38" ry="12" fill={`url(#glow-${slug})`} />
      {/* Shoulders / shirt */}
      <path
        d="M18 92 Q18 68 50 62 Q82 68 82 92 Z"
        fill={p.shirt}
      />
      <path
        d="M35 62 L50 58 L65 62 L65 75 L35 75 Z"
        fill={p.shirt}
        opacity="0.85"
      />
      {/* Neck */}
      <rect x="42" y="52" width="16" height="14" rx="4" fill={p.skinShadow} />
      {/* Face */}
      <ellipse cx="50" cy="42" rx="22" ry="26" fill={p.skin} />
      <ellipse cx="50" cy="44" rx="20" ry="24" fill={p.skin} />
      {/* Cheek shadow */}
      <ellipse cx="38" cy="46" rx="5" ry="4" fill={p.skinShadow} opacity="0.25" />
      <ellipse cx="62" cy="46" rx="5" ry="4" fill={p.skinShadow} opacity="0.25" />
      {/* Hair */}
      <path
        d="M28 38 Q28 18 50 14 Q72 18 72 38 Q70 28 50 24 Q30 28 28 38 Z"
        fill={p.hair}
      />
      <path
        d="M30 32 Q50 20 70 32"
        fill="none"
        stroke={p.hairHighlight}
        strokeWidth="2"
        opacity="0.5"
      />
      {/* Eyes */}
      <ellipse cx="40" cy="42" rx="3.5" ry="4" fill="#1a1a2e" />
      <ellipse cx="60" cy="42" rx="3.5" ry="4" fill="#1a1a2e" />
      <circle cx="41" cy="41" r="1.2" fill="white" opacity="0.9" />
      <circle cx="61" cy="41" r="1.2" fill="white" opacity="0.9" />
      {/* Brows */}
      <path d="M34 36 Q40 34 46 36" stroke={p.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M54 36 Q60 34 66 36" stroke={p.hair} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M50 44 L48 50 L52 50 Z" fill={p.skinShadow} opacity="0.35" />
      {/* Smile */}
      <path
        d="M42 54 Q50 60 58 54"
        fill="none"
        stroke={p.skinShadow}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Electric ring accent */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke={p.accent}
        strokeWidth="1.5"
        opacity="0.45"
      />
    </svg>
  );
}
