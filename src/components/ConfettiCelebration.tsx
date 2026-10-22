import React, { useMemo } from 'react';
import { KawaiiSticker } from './KawaiiIllustrations';

interface ConfettiCelebrationProps {
  show: boolean;
  onDismiss: () => void;
}

interface ConfettiParticle {
  id: number;
  left: string;
  delay: string;
  duration: string;
  drift: string;
  color: string;
  shape: 'heart' | 'circle' | 'ribbon';
  size: number;
}

const COLORS = ['#EC4899', '#F472B6', '#F9A8D4', '#C084FC', '#FBBF24', '#FB7185'];

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({ show, onDismiss }) => {
  const particles = useMemo<ConfettiParticle[]>(() => {
    const shapes: Array<'heart' | 'circle' | 'ribbon'> = ['heart', 'circle', 'ribbon'];
    return Array.from({ length: 65 }, (_, i) => ({
      id: i,
      left: `${(i * 1.55) % 100}%`,
      delay: `${(i % 12) * 0.16}s`,
      duration: `${2.6 + (i % 7) * 0.35}s`,
      drift: `${((i % 2 === 0 ? 1 : -1) * (15 + (i % 5) * 12))}px`,
      color: COLORS[i % COLORS.length],
      shape: shapes[i % shapes.length],
      size: 10 + (i % 4) * 3,
    }));
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3b1528]/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      {/* Confetti shower layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute top-0 animate-confetti"
            style={
              {
                left: p.left,
                animationDelay: p.delay,
                '--duration': p.duration,
                '--drift': p.drift,
              } as React.CSSProperties
            }
          >
            {p.shape === 'heart' ? (
              <svg width={p.size + 4} height={p.size + 4} viewBox="0 0 24 24" fill={p.color}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : p.shape === 'circle' ? (
              <div
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  borderRadius: '9999px',
                }}
              />
            ) : (
              <div
                style={{
                  width: p.size * 1.3,
                  height: p.size * 0.55,
                  backgroundColor: p.color,
                  borderRadius: '4px',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Kawaii Celebration Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border-2 border-pink-200 animate-sticker-pop">
        <div className="flex justify-center items-center gap-3 mb-4">
          <KawaiiSticker type="bow" className="w-12 h-12" />
          <KawaiiSticker type="kitty" className="w-16 h-16" />
          <KawaiiSticker type="heart" className="w-12 h-12" />
        </div>

        <h2
          id="celebration-title"
          className="font-display text-2xl sm:text-3xl font-bold text-pink-600 mb-2 text-balance"
        >
          ¡Felicidades mi amor, lograste las 30 venidas! 🎉
        </h2>

        <p className="text-sm sm:text-base text-[#6b3852] leading-relaxed mb-6">
          Cumpliste toda tu meta del gimnasio con disciplina, constancia y muchísimo brillo.
          ¡Estoy súper orgulloso de ti! Te mereces todos los abrazos y premios del mundo. 💗✨
        </p>

        <div className="bg-pink-50 rounded-2xl p-4 mb-6 border border-pink-100">
          <p className="font-display text-lg font-semibold text-pink-700 tabular-nums">
            30 / 30 asistencias completadas 🏆
          </p>
          <p className="text-xs text-pink-500 mt-0.5">
            Reto del 21 de octubre al 21 de diciembre de 2026
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="w-full min-h-[48px] py-3 px-6 rounded-2xl bg-pink-500 hover:bg-pink-600 active:scale-[0.98] text-white font-display font-semibold text-base shadow-md shadow-pink-500/20 transition-all cursor-pointer whitespace-nowrap"
        >
          ¡Seguir brillando! 🎀
        </button>
      </div>
    </div>
  );
};
