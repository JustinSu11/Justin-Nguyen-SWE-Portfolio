// Hand-crafted SVG bitmoji avatar — Justin Nguyen
// Short faded hair, natural big smile (not scary-wide), warm skin, dark crewneck

export function AvatarBitmoji({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ── SHIRT / SHOULDERS ─────────────────────────────────── */}
      <path
        d="M 0 240 L 0 198 C 20 176 52 167 70 164 L 100 174 L 130 164
           C 148 167 180 176 200 198 L 200 240 Z"
        fill="#363636"
      />
      <path d="M 70 164 Q 100 180 130 164 L 100 174 Z" fill="#222" />

      {/* ── NECK ──────────────────────────────────────────────── */}
      <rect x="83" y="152" width="34" height="24" rx="9" fill="#C28558" />

      {/* ── EARS ──────────────────────────────────────────────── */}
      <ellipse cx="52" cy="113" rx="7.5" ry="10" fill="#C28558" />
      <ellipse cx="148" cy="113" rx="7.5" ry="10" fill="#C28558" />
      <path d="M 49 108 Q 47 113 49 120" stroke="#9E6235" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 151 108 Q 153 113 151 120" stroke="#9E6235" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* ── HEAD ──────────────────────────────────────────────── */}
      <ellipse cx="100" cy="108" rx="48" ry="54" fill="#C28558" />
      {/* jaw shadow */}
      <ellipse cx="100" cy="158" rx="30" ry="6" fill="#9E6235" opacity="0.18" />

      {/* ── HAIR ──────────────────────────────────────────────── */}
      {/* Crown cap */}
      <ellipse cx="100" cy="62" rx="46" ry="28" fill="#191512" />
      {/* Hair shape around forehead/sides */}
      <path
        d="M 56 90
           Q 54 52 100 48
           Q 146 52 144 90
           Q 146 72 143 60
           Q 130 38 100 36
           Q 70 38 57 60
           Q 54 72 56 90 Z"
        fill="#191512"
      />
      {/* Fade edges — left */}
      <path d="M 56 90 Q 53 102 56 112 Q 59 120 64 124 Q 55 116 52 104 Q 50 92 56 90 Z" fill="#191512" />
      {/* Fade edges — right */}
      <path d="M 144 90 Q 147 102 144 112 Q 141 120 136 124 Q 145 116 148 104 Q 150 92 144 90 Z" fill="#191512" />
      {/* Subtle hair texture */}
      <path d="M 76 45 Q 100 41 124 45" stroke="#0d0b09" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.45" />
      <path d="M 72 53 Q 100 47 128 53" stroke="#0d0b09" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.30" />

      {/* ── EYEBROWS ──────────────────────────────────────────── */}
      <path d="M 66 84 Q 77 79 87 82" stroke="#191512" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 113 82 Q 123 79 134 84" stroke="#191512" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* ── EYES ──────────────────────────────────────────────── */}
      {/* Left */}
      <path d="M 65 97 Q 76 91 88 97 Q 76 103 65 97 Z" fill="#FCFBFA" />
      <circle cx="76" cy="97" r="5.2" fill="#1E1008" />
      <circle cx="77" cy="96" r="1.7" fill="#FCFBFA" />
      <path d="M 65 97 Q 76 91 88 97" stroke="#191512" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      {/* Right */}
      <path d="M 112 97 Q 124 91 135 97 Q 124 103 112 97 Z" fill="#FCFBFA" />
      <circle cx="124" cy="97" r="5.2" fill="#1E1008" />
      <circle cx="125" cy="96" r="1.7" fill="#FCFBFA" />
      <path d="M 112 97 Q 124 91 135 97" stroke="#191512" strokeWidth="1.7" fill="none" strokeLinecap="round" />

      {/* ── NOSE ──────────────────────────────────────────────── */}
      <path d="M 97 110 Q 95 119 100 121 Q 105 119 103 110" stroke="#9E6235" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* ── SMILE ─────────────────────────────────────────────── */}
      {/* Teeth (narrower, natural width) */}
      <path
        d="M 76 124 Q 88 138 100 139 Q 112 138 124 124
           Q 116 132 100 134 Q 84 132 76 124 Z"
        fill="#FCFBFA"
      />
      {/* Lower lip arc */}
      <path d="M 76 124 Q 100 144 124 124" stroke="#7E3012" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Upper lip */}
      <path d="M 76 124 Q 88 118 100 119 Q 112 118 124 124" stroke="#7E3012" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Center tooth divide */}
      <line x1="100" y1="119" x2="100" y2="133" stroke="#DDD8D0" strokeWidth="0.8" />
      {/* Subtle cheek lift — just faint blush ellipses */}
      <ellipse cx="65" cy="118" rx="7" ry="4" fill="#C26840" opacity="0.14" />
      <ellipse cx="135" cy="118" rx="7" ry="4" fill="#C26840" opacity="0.14" />
    </svg>
  );
}
