

/**
 * MediMind brand logo component — medicine pill theme.
 *
 * Props:
 *   size      "sm" | "md" | "lg"
 *   iconOnly  true → icon only, no wordmark
 *   lightText true → white wordmark (for dark backgrounds)
 */
const Logo = ({ size = 'md', iconOnly = false, lightText = false }) => {
  const dims   = { sm: 30, md: 38, lg: 50 };
  const texts  = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };
  const d      = dims[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* ── Icon mark ─────────────────────────────────────────── */}
      <svg
        width={d}
        height={d}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="medimind-bg"
            x1="0" y1="0" x2="48" y2="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor="#EF4444" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Rounded-square background */}
        <rect width="48" height="48" rx="14" fill="url(#medimind-bg)" />

        {/* Top-edge highlight gloss */}
        <rect
          x="1" y="1" width="46" height="22" rx="13"
          fill="white" fillOpacity="0.10"
        />

        {/* ── Pill capsule (rotated 45°, centered at 24,24) ── */}
        <g transform="rotate(-45 24 24)">
          {/* White (bright) left half */}
          <path
            d="M24,17 L13,17 Q6,17 6,24 Q6,31 13,31 L24,31 Z"
            fill="white" fillOpacity="0.92"
          />
          {/* Translucent right half */}
          <path
            d="M24,17 L35,17 Q42,17 42,24 Q42,31 35,31 L24,31 Z"
            fill="white" fillOpacity="0.28"
          />
          {/* Centre seam */}
          <line
            x1="24" y1="18" x2="24" y2="30"
            stroke="white" strokeOpacity="0.45" strokeWidth="1"
          />
        </g>

        {/* ── Medical cross (top-right corner) ── */}
        {/* Horizontal bar */}
        <rect x="32" y="10" width="7"   height="2.8" rx="1.4" fill="white" fillOpacity="0.85" />
        {/* Vertical bar */}
        <rect x="34.6" y="7.4" width="2.8" height="7"   rx="1.4" fill="white" fillOpacity="0.85" />
      </svg>

      {/* ── Wordmark ───────────────────────────────────────────── */}
      {!iconOnly && (
        <span
          className={`font-bold tracking-tight leading-none ${texts[size]} ${
            lightText ? 'text-white' : 'text-slate-800 dark:text-white'
          }`}
        >
          Medi<span className="text-primary">Mind</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
