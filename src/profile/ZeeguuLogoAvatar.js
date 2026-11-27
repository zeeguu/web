import { useId } from "react";

// Exact path from public/static/images/zeeguuLogo.svg (viewBox 0 0 71 71).
const ZEEGUU_LOGO_PATH =
  "M68.0725 22.4526C58.727 -1.97718 26.4607 -7.84855 9.34061 11.6953C-2.58301 25.2857 -3.14697 46.7182 7.971 61.2529C10.7505 64.8661 13.9731 68.0276 17.5582 70.2858C18.7667 69.1362 19.8141 68.1508 20.9822 67.0422C20.3377 66.6316 19.7335 66.2621 19.1293 65.8515C15.6247 63.5112 13.2077 60.3497 11.8381 56.3259C10.388 52.0558 12.6841 47.95 17.0346 46.9646C18.6861 46.595 20.2974 46.2666 21.949 45.9381C25.2925 45.2401 27.4677 46.8414 27.8706 50.2493C28.4345 54.9299 28.9582 59.6106 29.5624 64.2913C30.0055 67.617 31.4154 68.8488 34.7186 69.1362C38.5857 69.4646 42.4528 69.8752 46.3199 70.2448C48.8175 70.4911 50.0259 69.6699 50.3482 67.1654C51.315 59.9391 52.2012 52.6717 53.0874 45.4044C53.2485 44.0905 53.6111 43.023 55.1015 43.1461C56.7128 43.3104 56.8337 44.5832 56.6323 45.9381C56.4711 47.0056 56.3503 48.1142 56.2294 49.1817C55.3835 56.2438 54.5376 63.2648 53.6514 70.409C56.874 71.6407 59.3715 70.9427 61.1036 68.3561C62.3927 66.4263 63.6817 64.4966 64.6888 62.4436C71.0534 49.5923 73.3495 36.2894 68.0725 22.4526ZM30.5695 30.1306C29.4416 30.1306 28.5554 29.1862 28.5554 28.0777C28.5554 26.9691 29.4819 26.0247 30.5695 26.0247C31.6571 26.0247 32.5836 26.9691 32.5836 28.0777C32.5836 29.1862 31.6571 30.1306 30.5695 30.1306ZM42.6945 37.0284C41.5666 37.9728 41.5263 37.9317 40.3178 36.5357C47.2867 27.9545 48.8577 18.4289 45.7963 7.95898C48.616 11.0794 50.0259 14.8568 50.3079 18.9216C50.8316 26.2711 48.2535 32.3477 42.6945 37.0284Z";

const ACCESSORY_LAYERS = {
  beret: (
    <g key="beret" stroke="#940501" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="48" cy="24" rx="22" ry="9" transform="rotate(-12 48 24)" fill="#E11D48" />
      <path d="M 33 27 Q 48 24 63 23" fill="none" stroke="#FFF1F2" strokeWidth="2" />
      <path d="M 46 15 L 44 10" stroke="#940501" strokeWidth="2.6" />
    </g>
  ),
  headphones: (
    <g key="headphones" stroke="#940501" strokeWidth="2.2" strokeLinejoin="round">
      <path d="M 23 50 C 23 16, 80 16, 80 50" fill="none" stroke="#FFEED1" strokeWidth="6" />
      <path d="M 23 50 C 23 16, 80 16, 80 50" fill="none" stroke="#940501" strokeWidth="2.2" />
      <rect x="64" y="42" width="12" height="19" rx="5" fill="#FFEED1" />
    </g>
  ),
  bowtie: (
    <g key="bowtie" stroke="#940501" strokeWidth="2" strokeLinejoin="round">
      <polygon points="36,68 48,74 36,80" fill="#EF4444" />
      <polygon points="60,68 48,74 60,80" fill="#EF4444" />
      <circle cx="48" cy="74" r="3.5" fill="#FBBF24" />
    </g>
  ),
  newspaper: (
    <g key="newspaper" stroke="#940501" strokeWidth="2.2" strokeLinejoin="round">
      <circle cx="46" cy="52" r="7.5" fill="#FFFBEB" fillOpacity="0.78" />
      <line x1="53.5" y1="51" x2="64" y2="48" stroke="#940501" strokeWidth="2" />
      <circle cx="46" cy="52" r="2.2" fill="#940501" stroke="none" />
      <g transform="translate(10, 56) rotate(-14)">
        <rect x="0" y="0" width="22" height="24" rx="2" fill="#FFEED1" />
        <rect x="3" y="3" width="16" height="4" fill="#940501" stroke="none" />
        <line x1="3" y1="11" x2="19" y2="11" strokeWidth="1.6" />
        <line x1="3" y1="15" x2="19" y2="15" strokeWidth="1.6" />
        <line x1="3" y1="19" x2="14" y2="19" strokeWidth="1.6" />
      </g>
    </g>
  ),
  mug: (
    <g key="mug" stroke="#940501" strokeWidth="2" strokeLinejoin="round">
      <rect x="14" y="61" width="16" height="17" rx="3" fill="#FFEED1" />
      <path d="M 30 65 C 35 65, 35 74, 30 74" fill="none" strokeWidth="2.2" />
      <path
        d="M 19 57 Q 21 53 19 50 M 24 57 Q 26 53 24 50"
        fill="none"
        stroke="#940501"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  ),
  scarf: (
    <g key="scarf" stroke="#940501" strokeWidth="2" strokeLinejoin="round">
      <path d="M 32 66 Q 55 76 76 66 L 74 75 Q 55 84 34 74 Z" fill="#FFEED1" />
      <path d="M 58 75 L 66 93 L 54 94 L 50 76 Z" fill="#FFEED1" />
    </g>
  ),
  blossom: (
    <g key="blossom" stroke="#940501" strokeWidth="1.8" strokeLinejoin="round">
      <g transform="translate(65, 25)">
        <circle cx="0" cy="-5.5" r="4" fill="#FDA4AF" />
        <circle cx="5.2" cy="-1.7" r="4" fill="#FDA4AF" />
        <circle cx="3.2" cy="4.4" r="4" fill="#FDA4AF" />
        <circle cx="-3.2" cy="4.4" r="4" fill="#FDA4AF" />
        <circle cx="-5.2" cy="-1.7" r="4" fill="#FDA4AF" />
        <circle cx="0" cy="0" r="2.6" fill="#FFEED1" stroke="none" />
        <circle cx="0" cy="0" r="1.3" fill="#940501" stroke="none" />
      </g>
    </g>
  ),
  kimono: (
    <g key="kimono" stroke="#940501" strokeWidth="2" strokeLinejoin="round">
      <path d="M 38 66 L 56 85 L 73 66 L 78 96 L 34 96 Z" fill="#F43F5E" />
      <path d="M 42 66 L 56 82 L 70 66" fill="none" stroke="#FFEED1" strokeWidth="4.5" />
      <rect x="37" y="80" width="38" height="9" rx="2" fill="#FBBF24" />
      <line x1="37" y1="84.5" x2="75" y2="84.5" stroke="#940501" strokeWidth="1.4" />
    </g>
  ),
};

export default function ZeeguuLogoAvatar({ layers = [], color, label = "Zeeguu avatar" }) {
  const clipId = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      role="img"
      aria-label={label}
      style={{ display: "block", pointerEvents: "none" }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g transform="translate(18, 25) scale(0.92)">
          <path d={ZEEGUU_LOGO_PATH} fill={color} />
        </g>
        {layers.map((layerId) => ACCESSORY_LAYERS[layerId] ?? null)}
      </g>
    </svg>
  );
}
