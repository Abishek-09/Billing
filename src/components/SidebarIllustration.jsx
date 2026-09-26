import React from 'react';

/**
 * Subtle Bakery Illustration: Handcrafted Wheat & Croissant
 * Rendered with soft stroke at the bottom of the #116D6E sidebar
 */
export const SidebarIllustration = () => {
  return (
    <div className="w-full px-4 py-2 flex flex-col items-center select-none pointer-events-none opacity-80">
      <svg
        viewBox="0 0 180 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-36 h-auto drop-shadow-sm"
      >
        <defs>
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Central Wheat stalks */}
        <g stroke="url(#strokeGradient)" strokeWidth="1.2" strokeLinecap="round">
          {/* Main stem */}
          <path d="M90 80 C 90 55, 90 35, 90 12" />
          {/* Wheat grains left */}
          <path d="M90 22 C 82 17, 78 12, 75 8" />
          <path d="M90 32 C 80 27, 74 22, 72 17" />
          <path d="M90 42 C 80 37, 74 32, 72 27" />
          <path d="M90 52 C 80 47, 75 43, 74 38" />

          {/* Wheat grains right */}
          <path d="M90 22 C 98 17, 102 12, 105 8" />
          <path d="M90 32 C 100 27, 106 22, 108 17" />
          <path d="M90 42 C 100 37, 106 32, 108 27" />
          <path d="M90 52 C 100 47, 105 43, 106 38" />

          {/* Whimsical pastry curve / croissant base */}
          <path d="M45 68 C 65 52, 115 52, 135 68" strokeDasharray="2 3" opacity="0.5" />
          <circle cx="90" cy="10" r="1.5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="68" cy="72" r="1.2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="112" cy="72" r="1.2" fill="#FFFFFF" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

export default SidebarIllustration;
