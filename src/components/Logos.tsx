import React from 'react';

/**
 * Jata Rasmi Negeri Sembilan Darul Khusus
 */
export const JataNegeriSembilan: React.FC<{ className?: string }> = ({ className = 'h-12 w-auto' }) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Jata Rasmi Negeri Sembilan"
  >
    {/* Outer glow / base */}
    <defs>
      <linearGradient id="nsGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFE066" />
        <stop offset="50%" stopColor="#FFD100" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="nsRedGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD100" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFD100" stopOpacity="0" />
      </radialGradient>
      <clipPath id="shieldClip">
        <path d="M40 38 H120 V88 C120 120 80 142 80 142 C80 142 40 120 40 88 Z" />
      </clipPath>
    </defs>

    {/* Sembilan Tangkai Padi (Nine Rice Stalks) Crest at Top */}
    <g transform="translate(80, 22)">
      {[-35, -26, -17, -8, 0, 8, 17, 26, 35].map((angle, idx) => (
        <path
          key={idx}
          d="M0 8 C-1.5 3 -2.5 -6 0 -14 C2.5 -6 1.5 3 0 8 Z"
          fill="url(#nsGold)"
          stroke="#92400E"
          strokeWidth="0.6"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="8" r="3.5" fill="#DC2626" />
    </g>

    {/* Bintang Pecah Sembilan / Bintang & Bulan */}
    <path
      d="M80 32 L82 36 L86 36 L83 38.5 L84 42.5 L80 40 L76 42.5 L77 38.5 L74 36 L78 36 Z"
      fill="#FFD100"
      stroke="#92400E"
      strokeWidth="0.5"
    />

    {/* Perisai / Shield Border */}
    <path
      d="M38 36 H122 V88 C122 122 80 145 80 145 C80 145 38 122 38 88 Z"
      fill="#FFE066"
      stroke="#B45309"
      strokeWidth="2.5"
    />

    {/* Shield Body Clipped */}
    <g clipPath="url(#shieldClip)">
      {/* Upper Right Triangle: Red */}
      <polygon points="40,38 120,38 120,142" fill="url(#nsRedGrad)" />
      {/* Lower Left Triangle: Black */}
      <polygon points="40,38 40,142 120,142" fill="#111827" />
      {/* Diagonal Division Line in Gold */}
      <line x1="120" y1="38" x2="40" y2="142" stroke="#FFD100" strokeWidth="4" />

      {/* Chokmar & Pedang / Keris Bersilang (Crossed Traditional Keris & Staff) */}
      <g transform="translate(80, 84)">
        {/* Keris 1 */}
        <path
          d="M-28 -28 L28 28 M-28 -28 L-22 -22 M-25 -29 L-31 -23"
          stroke="#FFD100"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Keris 2 */}
        <path
          d="M28 -28 L-28 28 M28 -28 L22 -22 M25 -29 L31 -23"
          stroke="#FFD100"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Chokmar center */}
        <rect x="-3" y="-32" width="6" height="64" rx="2" fill="#FFE066" stroke="#92400E" strokeWidth="1" />
        <circle cx="0" cy="-32" r="5" fill="#FFD100" stroke="#92400E" strokeWidth="1" />
        <circle cx="0" cy="32" r="4" fill="#FFD100" stroke="#92400E" strokeWidth="1" />
      </g>
    </g>

    {/* Bawah: Pita / Banner */}
    <g transform="translate(80, 146)">
      <path
        d="M-45 -4 C-20 6 20 6 45 -4 L48 4 C20 14 -20 14 -48 4 Z"
        fill="#FFD100"
        stroke="#92400E"
        strokeWidth="1"
      />
      <text
        x="0"
        y="4"
        textAnchor="middle"
        fontSize="6"
        fontWeight="bold"
        fill="#111827"
        letterSpacing="0.8"
      >
        NEGERI SEMBILAN
      </text>
    </g>
  </svg>
);

/**
 * Logo Rasmi Jabatan Kerja Raya (JKR)
 */
export const JkrLogo: React.FC<{ className?: string }> = ({ className = 'h-12 w-auto' }) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Logo JKR Jabatan Kerja Raya"
  >
    <defs>
      <linearGradient id="jkrBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="jkrGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>

    {/* Outer Gear Ring / Emblem Shape */}
    <circle cx="80" cy="80" r="72" fill="#0B132B" stroke="#CA8A04" strokeWidth="3" />
    <circle cx="80" cy="80" r="66" fill="#1E293B" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="4 2" />

    {/* Structural Bridge & Road Curve (Infrastruktur JKR) */}
    <path
      d="M24 102 C45 74 115 74 136 102 L140 114 C110 88 50 88 20 114 Z"
      fill="url(#jkrGold)"
    />

    {/* Highway / Road centerline stripes */}
    <path
      d="M74 92 L76 110 M84 92 L86 110"
      stroke="#1E293B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* JKR Bold Lettering */}
    <g transform="translate(80, 64)">
      <rect x="-48" y="-22" width="96" height="34" rx="6" fill="#0F172A" stroke="#EAB308" strokeWidth="1.5" />
      <text
        x="0"
        y="2"
        textAnchor="middle"
        fontSize="24"
        fontWeight="900"
        letterSpacing="3"
        fill="#FDE047"
        fontFamily="Arial, sans-serif"
      >
        JKR
      </text>
    </g>

    {/* Text Circular Banner: JABATAN KERJA RAYA */}
    <text
      x="80"
      y="134"
      textAnchor="middle"
      fontSize="8.5"
      fontWeight="800"
      fill="#FFFFFF"
      letterSpacing="1"
      fontFamily="sans-serif"
    >
      JABATAN KERJA RAYA
    </text>

    {/* Small compass / level indicator */}
    <circle cx="80" cy="24" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
  </svg>
);
