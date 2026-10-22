import React, { useEffect, useState } from 'react';

export type StickerType = 'heart' | 'bow' | 'star' | 'kitty';

export const STICKER_TYPES: StickerType[] = ['heart', 'bow', 'star', 'kitty'];

const CANDIDATE_PATHS: Record<StickerType, string[]> = {
  heart: ['./stickers/sticker1.png', './stickers/corazon.png', './stickers/heart.png'],
  bow: ['./stickers/sticker2.png', './stickers/mono.png', './stickers/bow.png'],
  star: ['./stickers/sticker3.png', './stickers/estrella.png', './stickers/star.png'],
  kitty: ['./stickers/sticker4.png', './stickers/gatito.png', './stickers/kitty.png'],
};

function probeImage(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve(url);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function useCustomStickers(): Record<StickerType, string | null> {
  const [customUrls, setCustomUrls] = useState<Record<StickerType, string | null>>({
    heart: null,
    bow: null,
    star: null,
    kitty: null,
  });

  useEffect(() => {
    let mounted = true;
    async function checkAll() {
      const result: Record<StickerType, string | null> = {
        heart: null,
        bow: null,
        star: null,
        kitty: null,
      };

      for (const type of STICKER_TYPES) {
        for (const candidate of CANDIDATE_PATHS[type]) {
          const found = await probeImage(candidate);
          if (found) {
            result[type] = found;
            break;
          }
        }
      }

      if (mounted) {
        setCustomUrls(result);
      }
    }
    checkAll();
    return () => {
      mounted = false;
    };
  }, []);

  return customUrls;
}

interface StickerIconProps {
  type: StickerType;
  customUrl?: string | null;
  className?: string;
}

export const KawaiiSticker: React.FC<StickerIconProps> = ({
  type,
  customUrl,
  className = 'w-8 h-8',
}) => {
  const [imgError, setImgError] = useState(false);

  if (customUrl && !imgError) {
    return (
      <img
        src={customUrl}
        alt={`Sticker ${type}`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${className} object-contain select-none pointer-events-none drop-shadow-sm`}
      />
    );
  }

  switch (type) {
    case 'heart':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} select-none pointer-events-none drop-shadow-sm`}
          aria-hidden="true"
        >
          {/* White sticker outline */}
          <path
            d="M32 56C32 56 8 41.2 8 22.8C8 14.2 14.8 8 22.8 8C27.5 8 30.6 10.4 32 12.6C33.4 10.4 36.5 8 41.2 8C49.2 8 56 14.2 56 22.8C56 41.2 32 56 32 56Z"
            fill="#FF5C93"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner glossy highlight */}
          <path
            d="M16 21C16 17 19 14 23 14"
            stroke="#FFC2D9"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Kawaii face */}
          <circle cx="24.5" cy="27" r="2.3" fill="#4A152B" />
          <circle cx="39.5" cy="27" r="2.3" fill="#4A152B" />
          <ellipse cx="20.5" cy="30" rx="2.8" ry="1.6" fill="#FF99BE" />
          <ellipse cx="43.5" cy="30" rx="2.8" ry="1.6" fill="#FF99BE" />
          <path
            d="M29.2 29.5C30 31.2 34 31.2 34.8 29.5"
            stroke="#4A152B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'bow':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} select-none pointer-events-none drop-shadow-sm`}
          aria-hidden="true"
        >
          {/* Ribbons */}
          <path
            d="M26 36L16 54L24 51L29 56L32 39"
            fill="#F472B6"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M38 36L48 54L40 51L35 56L32 39"
            fill="#F472B6"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Left Loop */}
          <path
            d="M30 28C23 14 7 14 7 28C7 42 23 42 30 32Z"
            fill="#FF7EB6"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Right Loop */}
          <path
            d="M34 28C41 14 57 14 57 28C57 42 41 42 34 32Z"
            fill="#FF7EB6"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Inner creases */}
          <path d="M16 25C19 25 22 27 25 29" stroke="#DB2777" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M48 25C45 25 42 27 39 29" stroke="#DB2777" strokeWidth="2.2" strokeLinecap="round" />
          {/* Center Heart Knot */}
          <circle
            cx="32"
            cy="30"
            r="6.5"
            fill="#EC4899"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <circle cx="30" cy="28" r="1.8" fill="#FCE7F3" />
        </svg>
      );

    case 'star':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} select-none pointer-events-none drop-shadow-sm`}
          aria-hidden="true"
        >
          <path
            d="M32 7L39.4 21.6L55.5 24.1L43.8 35.4L46.5 51.5L32 43.9L17.5 51.5L20.2 35.4L8.5 24.1L24.6 21.6L32 7Z"
            fill="#FBBF24"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="26.5" cy="30" r="2.2" fill="#582808" />
          <circle cx="37.5" cy="30" r="2.2" fill="#582808" />
          <ellipse cx="23" cy="33" rx="2.5" ry="1.4" fill="#F472B6" />
          <ellipse cx="41" cy="33" rx="2.5" ry="1.4" fill="#F472B6" />
          <path
            d="M29.5 32.8C30.5 34.4 33.5 34.4 34.5 32.8"
            stroke="#582808"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'kitty':
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${className} select-none pointer-events-none drop-shadow-sm`}
          aria-hidden="true"
        >
          {/* Cat head with ears */}
          <path
            d="M12 28L14 11L26 20C28 19.4 30 19 32 19C34 19 36 19.4 38 20L50 11L52 28C54.5 31.5 55.5 35.5 55 40C54 49 44.5 54 32 54C19.5 54 10 49 9 40C8.5 35.5 9.5 31.5 12 28Z"
            fill="#FFF0F7"
            stroke="#F472B6"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Inner ears */}
          <path d="M16.5 16L15.5 25L23 20.5L16.5 16Z" fill="#F9A8D4" />
          <path d="M47.5 16L48.5 25L41 20.5L47.5 16Z" fill="#F9A8D4" />
          {/* Little bow on right ear */}
          <circle cx="46" cy="21" r="3" fill="#EC4899" />
          <path d="M46 21L40 17V25L46 21Z" fill="#FF6B9E" />
          <path d="M46 21L52 17V25L46 21Z" fill="#FF6B9E" />
          {/* Eyes */}
          <circle cx="23.5" cy="36" r="2.5" fill="#4A152B" />
          <circle cx="40.5" cy="36" r="2.5" fill="#4A152B" />
          {/* Nose & whiskers */}
          <ellipse cx="32" cy="38.5" rx="2.2" ry="1.6" fill="#F472B6" />
          <ellipse cx="19" cy="39.5" rx="3" ry="1.6" fill="#FBCFE8" />
          <ellipse cx="45" cy="39.5" rx="3" ry="1.6" fill="#FBCFE8" />
          <path d="M8 36H14M8 40H14M50 36H56M50 40H56" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};

export const KawaiiGymKittyMascot: React.FC<{ count: number; goal: number }> = ({
  count,
  goal,
}) => {
  const isCompleted = count >= goal;
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-24 sm:w-32 sm:h-28 select-none animate-float shrink-0"
      aria-hidden="true"
    >
      {/* Soft pastel shadow */}
      <ellipse cx="70" cy="108" rx="42" ry="7" fill="#FCE7F3" />

      {/* Cute Cloud Base */}
      <path
        d="M32 98C23 98 16 91.5 16 83.5C16 76.5 21 70.5 28 69.2C30.5 58 41 50 53.5 50C57.5 50 61.2 50.8 64.5 52.3C69.2 46.5 76.5 43 84.8 43C98.5 43 109.5 53.5 110 66.8C118 68.2 124 75 124 83.2C124 91.5 117 98 108.5 98H32Z"
        fill="#FFFFFF"
        stroke="#FBCFE8"
        strokeWidth="2.5"
      />

      {/* Cat Head & Body */}
      <path
        d="M42 52L44 25L61 38C64 37.2 67 36.8 70 36.8C73 36.8 76 37.2 79 38L96 25L98 52C102 57 104 63 103 70C101.5 83 88 91 70 91C52 91 38.5 83 37 70C36 63 38 57 42 52Z"
        fill="#FFFBFD"
        stroke="#F472B6"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Inner pink ears */}
      <path d="M47 32L46 45L57 38.5L47 32Z" fill="#FBCFE8" />
      <path d="M93 32L94 45L83 38.5L93 32Z" fill="#FBCFE8" />

      {/* Cute Gym Headband */}
      <path
        d="M40 50C50 45 90 45 100 50"
        stroke="#EC4899"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M42 50C52 45.5 88 45.5 98 50"
        stroke="#FBCFE8"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* Signature Bow on Right Ear */}
      <g transform="translate(82, 26) rotate(12)">
        <path d="M10 10L2 4V16L10 10Z" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M10 10L18 4V16L10 10Z" fill="#EC4899" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" fill="#F9A8D4" />
      </g>

      {/* Eyes - happy arcs if completed, sparkling eyes otherwise */}
      {isCompleted ? (
        <>
          <path d="M53 62C55 58 60 58 62 62" stroke="#4A152B" strokeWidth="3" strokeLinecap="round" />
          <path d="M78 62C80 58 85 58 87 62" stroke="#4A152B" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="57" cy="61" r="4" fill="#4A152B" />
          <circle cx="55.8" cy="59.6" r="1.5" fill="#FFFFFF" />
          <circle cx="83" cy="61" r="4" fill="#4A152B" />
          <circle cx="81.8" cy="59.6" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* Rosy cheeks */}
      <ellipse cx="49" cy="66" rx="5" ry="2.8" fill="#F9A8D4" />
      <ellipse cx="91" cy="66" rx="5" ry="2.8" fill="#F9A8D4" />

      {/* Cute cat mouth & nose */}
      <ellipse cx="70" cy="64.5" rx="3" ry="2" fill="#EC4899" />
      <path
        d="M66 68C67.5 70.5 70 69.5 70 67.5C70 69.5 72.5 70.5 74 68"
        stroke="#4A152B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Whiskers */}
      <path
        d="M31 60L39 62M31 66L39 66M109 60L101 62M109 66L101 66"
        stroke="#F472B6"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Cute Pink Dumbbell held in paws */}
      <g transform="translate(0, 4)">
        <line x1="42" y1="84" x2="98" y2="84" stroke="#C084FC" strokeWidth="4.5" strokeLinecap="round" />
        {/* Dumbbell weights */}
        <rect x="33" y="75" width="8" height="18" rx="4" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
        <rect x="27" y="78" width="6" height="12" rx="3" fill="#F472B6" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="99" y="75" width="8" height="18" rx="4" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
        <rect x="107" y="78" width="6" height="12" rx="3" fill="#F472B6" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Little white paws holding the bar */}
        <ellipse cx="56" cy="84" rx="6" ry="5" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2.2" />
        <ellipse cx="84" cy="84" rx="6" ry="5" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2.2" />
      </g>

      {/* Floating Sparkles */}
      <path
        d="M22 30L24 35L29 37L24 39L22 44L20 39L15 37L20 35L22 30Z"
        fill="#FBBF24"
      />
      <path
        d="M118 24L119.5 28L123.5 29.5L119.5 31L118 35L116.5 31L112.5 29.5L116.5 28L118 24Z"
        fill="#F472B6"
      />
    </svg>
  );
};

export const GoalFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 21V4M5 4H19L16 8.5L19 13H5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#F472B6"
      fillOpacity="0.25"
    />
  </svg>
);

export const DecorativeCloud: React.FC<{ className?: string }> = ({ className = 'w-20 h-12' }) => (
  <svg
    viewBox="0 0 120 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M25 58C15.6 58 8 50.8 8 42C8 34.2 13.8 27.7 21.4 26.3C24.2 14.8 35 6.5 48 6.5C53 6.5 57.6 7.8 61.6 10C66.6 5.5 73.2 3 80.5 3C95.4 3 107.5 14.6 108 29C115 31.2 120 37.5 120 45C120 52.2 114 58 106.5 58H25Z"
      fill="currentColor"
    />
  </svg>
);
