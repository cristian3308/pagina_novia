import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Calendar as CalendarIcon,
  Award,
  Heart,
  Flame,
  Unlock,
  Lock,
} from 'lucide-react';
import {
  KawaiiSticker,
  KawaiiGymKittyMascot,
  GoalFlagIcon,
  DecorativeCloud,
  StickerType,
  STICKER_TYPES,
  useCustomStickers,
} from './components/KawaiiIllustrations';
import { ConfettiCelebration } from './components/ConfettiCelebration';

const STORAGE_KEY = 'mi_camino_al_gym_v1';
const GOAL_VISITS = 30;
const START_DATE_STR = '2026-10-21';
const END_DATE_STR = '2026-12-21';

interface MonthConfig {
  index: number;
  year: number;
  month: number; // 0-indexed (9 = Oct, 10 = Nov, 11 = Dec)
  name: string;
  subtitle: string;
}

const MONTHS: MonthConfig[] = [
  {
    index: 0,
    year: 2026,
    month: 9,
    name: 'Octubre 2026',
    subtitle: '¡El comienzo del reto! 🌸',
  },
  {
    index: 1,
    year: 2026,
    month: 10,
    name: 'Noviembre 2026',
    subtitle: '¡Mes de constancia y poder! 💪',
  },
  {
    index: 2,
    year: 2026,
    month: 11,
    name: 'Diciembre 2026',
    subtitle: '¡Recta final hacia la meta! 🎀',
  },
];

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const MOTIVATIONAL_MESSAGES = [
  '¡Eres una máquina! 💪💗',
  '¡Una más, mi amor! Estoy súper orgulloso de ti 🌸',
  '¡Esooo! Cada día más fuerte y más hermosa ✨',
  '¡Asistencia marcada! Nadie te detiene, princesa 🎀',
  '¡Brillas muchísimo! Un paso más cerca de las 30 ⭐',
  '¡Mi chica fit favorita! Te amo con todo mi corazón 💕',
  '¡Constancia nivel diosa! Sigue así, mi vida 🌷',
  '¡Día conquistado! Te mereces muchos mimitos hoy 🐱💗',
  '¡Qué orgullo verte cumplir tus metas, mi amor! 🥰',
  '¡Imparable! Suma otra venida a tu récord 🌟',
];

function formatDateKey(year: number, monthZeroIndexed: number, day: number): string {
  const m = String(monthZeroIndexed + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function getLocalTodayStr(): string {
  const now = new Date();
  return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function diffDays(fromStr: string, toStr: string): number {
  const from = parseDateLocal(fromStr);
  const to = parseDateLocal(toStr);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

function getDefaultMonthIndex(todayStr: string): number {
  if (todayStr.startsWith('2026-10')) return 0;
  if (todayStr.startsWith('2026-11')) return 1;
  if (todayStr.startsWith('2026-12')) return 2;
  if (todayStr < START_DATE_STR) return 0;
  return 2;
}

function loadSavedAttendance(): Record<string, StickerType> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const cleaned: Record<string, StickerType> = {};
      for (const [key, val] of Object.entries(parsed)) {
        if (
          key >= START_DATE_STR &&
          key <= END_DATE_STR &&
          typeof val === 'string' &&
          STICKER_TYPES.includes(val as StickerType)
        ) {
          cleaned[key] = val as StickerType;
        }
      }
      return cleaned;
    }
  } catch {
    // Ignore localStorage read errors in restricted environments
  }
  return {};
}

function saveAttendance(data: Record<string, StickerType>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore localStorage write errors in private mode / quota exceeded
  }
}

export default function App() {
  const todayStr = useMemo(() => getLocalTodayStr(), []);
  const customStickers = useCustomStickers();

  const [attendance, setAttendance] = useState<Record<string, StickerType>>(() =>
    loadSavedAttendance()
  );
  const [currentMonthIdx, setCurrentMonthIdx] = useState<number>(() =>
    getDefaultMonthIndex(todayStr)
  );
  const [selectedStickerMode, setSelectedStickerMode] = useState<'auto' | StickerType>('auto');
  const [motivationalBanner, setMotivationalBanner] = useState<string>(
    '¡Toca el día que fuiste al gym para poner tu sticker! 🎀'
  );
  const [lastMarkedDate, setLastMarkedDate] = useState<string | null>(null);
  const [counterShineKey, setCounterShineKey] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [allowFutureDemo, setAllowFutureDemo] = useState<boolean>(false);

  // Touch swipe tracking for mobile month navigation
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);

  const markedDates = useMemo(() => Object.keys(attendance).sort(), [attendance]);
  const visitsCount = markedDates.length;
  const progressPercent = Math.min(100, Math.round((visitsCount / GOAL_VISITS) * 100));
  const remainingVisits = Math.max(0, GOAL_VISITS - visitsCount);

  // Calculate remaining days until December 21, 2026
  const effectiveTodayForStats = useMemo(() => {
    if (todayStr < START_DATE_STR) return START_DATE_STR;
    if (todayStr > END_DATE_STR) return END_DATE_STR;
    return todayStr;
  }, [todayStr]);

  const daysRemaining = useMemo(() => {
    const diff = diffDays(effectiveTodayForStats, END_DATE_STR);
    return Math.max(0, diff);
  }, [effectiveTodayForStats]);

  // Calculate required weekly pace ("necesitas ir ~N veces por semana")
  const weeklyPaceInfo = useMemo(() => {
    if (remainingVisits <= 0) {
      return {
        valueText: '¡Meta lograda!',
        sentence: '¡Ya cumpliste tus 30 venidas al gym! 🏆💗',
      };
    }

    const isTodayMarked = Boolean(attendance[effectiveTodayForStats]);
    // Days left including today if today isn't marked yet
    const actionableDaysLeft = Math.max(1, daysRemaining + (isTodayMarked ? 0 : 1));
    const weeksLeft = actionableDaysLeft / 7;
    const rawPace = remainingVisits / weeksLeft;
    const clampedPace = Math.min(7, Math.max(0.5, rawPace));
    const formattedPace =
      Math.abs(clampedPace - Math.round(clampedPace)) < 0.08
        ? String(Math.round(clampedPace))
        : clampedPace.toFixed(1);

    return {
      valueText: `~${formattedPace} / sem`,
      sentence: `Necesitas ir ~${formattedPace} veces por semana`,
    };
  }, [remainingVisits, daysRemaining, attendance, effectiveTodayForStats]);

  const pickNextSticker = (dateKey: string): StickerType => {
    if (selectedStickerMode !== 'auto') {
      return selectedStickerMode;
    }
    // Deterministic cute cycle mixed with current count so it feels playful
    const mainPool: StickerType[] = ['heart', 'bow', 'star', 'kitty'];
    const dayNum = Number(dateKey.split('-')[2]) || 1;
    return mainPool[(dayNum + Object.keys(attendance).length) % mainPool.length];
  };

  const handleDayPress = (dateKey: string, isInRange: boolean, isFuture: boolean) => {
    if (!isInRange) {
      setMotivationalBanner(
        'Ese día está fuera del reto (21 de oct al 21 de dic de 2026) 🌸'
      );
      return;
    }

    if (isFuture && !allowFutureDemo) {
      setMotivationalBanner(
        '¡Paso a paso, mi amor! No se pueden marcar días futuros todavía 🌷'
      );
      return;
    }

    setAttendance((prev) => {
      const next = { ...prev };
      if (next[dateKey]) {
        delete next[dateKey];
        setLastMarkedDate(null);
        setMotivationalBanner('Día desmarcado. ¡Puedes volver a marcarlo cuando quieras! 🎀');
      } else {
        const chosenSticker = pickNextSticker(dateKey);
        next[dateKey] = chosenSticker;
        setLastMarkedDate(dateKey);
        setCounterShineKey((k) => k + 1);

        const newTotal = Object.keys(next).length;
        if (newTotal === GOAL_VISITS) {
          setMotivationalBanner('¡¡LO LOGRASTE MI AMOR!! ¡30 de 30 venidas completadas! 🎉💗');
          setShowCelebration(true);
        } else {
          const randomMsg =
            MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
          setMotivationalBanner(randomMsg);
        }
      }
      return next;
    });
  };

  const handleResetConfirm = () => {
    setAttendance({});
    setLastMarkedDate(null);
    setShowResetConfirm(false);
    setShowCelebration(false);
    setMotivationalBanner('Calendario reiniciado desde cero. ¡Vamos con toda, mi amor! 🎀');
  };

  const goPrevMonth = () => {
    setCurrentMonthIdx((idx) => Math.max(0, idx - 1));
  };

  const goNextMonth = () => {
    setCurrentMonthIdx((idx) => Math.min(MONTHS.length - 1, idx + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0 && currentMonthIdx < MONTHS.length - 1) {
        goNextMonth();
      } else if (deltaX > 0 && currentMonthIdx > 0) {
        goPrevMonth();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const activeMonth = MONTHS[currentMonthIdx];

  // Build calendar cells for activeMonth (Monday-first week)
  const calendarCells = useMemo(() => {
    const { year, month } = activeMonth;
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Convert JS Sunday=0..Saturday=6 into Monday=0..Sunday=6
    const leadingEmptyDays = (firstDayOfMonth.getDay() + 6) % 7;

    const cells: Array<{
      key: string;
      dayNumber: number | null;
      dateKey: string | null;
      isInRange: boolean;
      isFuture: boolean;
      isToday: boolean;
      isDeadline: boolean;
      isStartDay: boolean;
    }> = [];

    for (let i = 0; i < leadingEmptyDays; i++) {
      cells.push({
        key: `empty-start-${i}`,
        dayNumber: null,
        dateKey: null,
        isInRange: false,
        isFuture: false,
        isToday: false,
        isDeadline: false,
        isStartDay: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const isInRange = dateKey >= START_DATE_STR && dateKey <= END_DATE_STR;
      const isFuture = dateKey > todayStr;
      const isToday = dateKey === todayStr;
      const isDeadline = dateKey === END_DATE_STR;
      const isStartDay = dateKey === START_DATE_STR;

      cells.push({
        key: dateKey,
        dayNumber: day,
        dateKey,
        isInRange,
        isFuture,
        isToday,
        isDeadline,
        isStartDay,
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push({
        key: `empty-end-${cells.length}`,
        dayNumber: null,
        dateKey: null,
        isInRange: false,
        isFuture: false,
        isToday: false,
        isDeadline: false,
        isStartDay: false,
      });
    }

    return cells;
  }, [activeMonth, todayStr]);

  // Count how many days were marked in this specific month
  const monthMarkedCount = useMemo(() => {
    const prefix = `${activeMonth.year}-${String(activeMonth.month + 1).padStart(2, '0')}`;
    return markedDates.filter((d) => d.startsWith(prefix)).length;
  }, [activeMonth, markedDates]);

  return (
    <div className="min-h-screen bg-[#fff7fb] text-[#4a2538] relative overflow-x-hidden flex flex-col justify-between">
      {/* Subtle kawaii sky decorations in background */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 overflow-hidden z-0 flex justify-between px-4 pt-3 opacity-70"
        aria-hidden="true"
      >
        <DecorativeCloud className="w-24 h-14 text-pink-100/80 animate-float" />
        <DecorativeCloud className="w-28 h-16 text-fuchsia-100/70 animate-float" />
      </div>

      {/* Top Navigation / Brand Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <KawaiiSticker type="bow" customUrl={customStickers.bow} className="w-8 h-8 shrink-0" />
          <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#4a1932] whitespace-nowrap">
            Mi camino al gym 🎀
          </h1>
        </div>

        <div className="text-xs sm:text-sm font-semibold text-pink-600 tabular-nums whitespace-nowrap">
          21 oct · 21 dic 2026
        </div>
      </header>

      {/* Main Content Container: Mobile-first single flow, Desktop 2-column balanced layout */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* LEFT / TOP PANEL: Progress Counter, Mascot, Pink Progress Bar, Stats & Pace */}
          <section
            aria-label="Resumen de progreso"
            className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-pink-100/90"
          >
            {/* Hero Counter + Kawaii Gym Kitty Mascot */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-pink-100/80">
              <div>
                <p className="text-xs font-semibold text-pink-500 tracking-wide mb-1">
                  Tu progreso hacia la meta
                </p>
                <div
                  key={counterShineKey}
                  className="animate-counter-shine inline-flex items-baseline gap-2"
                >
                  <span className="font-display text-4xl sm:text-5xl font-bold text-pink-600 tabular-nums">
                    {visitsCount}
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-semibold text-pink-300 tabular-nums">
                    / {GOAL_VISITS}
                  </span>
                  <span className="font-display text-lg sm:text-xl font-semibold text-[#6b3852] ml-0.5">
                    venidas
                  </span>
                </div>
                <p className="text-xs text-[#85526c] mt-1 font-medium">
                  {weeklyPaceInfo.sentence}
                </p>
              </div>

              <KawaiiGymKittyMascot count={visitsCount} goal={GOAL_VISITS} />
            </div>

            {/* Pink Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-[#78425d] mb-2 tabular-nums">
                <span>Avance del reto</span>
                <span className="text-pink-600 font-bold">{progressPercent}% completado</span>
              </div>
              <div
                className="w-full h-4 bg-pink-100/80 rounded-full overflow-hidden p-0.5 border border-pink-200/60"
                role="progressbar"
                aria-valuenow={visitsCount}
                aria-valuemin={0}
                aria-valuemax={GOAL_VISITS}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 via-pink-500 to-fuchsia-500 transition-all duration-300 relative"
                  style={{ width: `${ Math.max(visitsCount > 0 ? 6 : 0, progressPercent) }%` }}
                />
              </div>

              {/* Milestone markers */}
              <div className="flex justify-between text-[11px] font-medium text-pink-400 mt-1.5 px-0.5 tabular-nums">
                <span>Inicio</span>
                <span className={visitsCount >= 10 ? 'text-pink-600 font-bold' : ''}>10 🌸</span>
                <span className={visitsCount >= 20 ? 'text-pink-600 font-bold' : ''}>20 ✨</span>
                <span className={visitsCount >= 30 ? 'text-pink-600 font-bold' : ''}>Meta 30 🏆</span>
              </div>
            </div>

            {/* Key Metrics Grid: Días restantes, Venidas que faltan, Ritmo necesario */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-pink-100/80">
              <div className="bg-[#fff8fc] rounded-2xl p-3 text-center border border-pink-100/70">
                <div className="flex items-center justify-center text-pink-500 mb-1">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div className="font-display text-xl sm:text-2xl font-bold text-[#4a1932] tabular-nums">
                  {daysRemaining}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-[#7d4964] leading-tight mt-0.5">
                  Días restantes
                </div>
                <div className="text-[10px] text-pink-400 mt-0.5">hasta el 21/dic</div>
              </div>

              <div className="bg-[#fff8fc] rounded-2xl p-3 text-center border border-pink-100/70">
                <div className="flex items-center justify-center text-pink-500 mb-1">
                  <Award className="w-4 h-4" />
                </div>
                <div className="font-display text-xl sm:text-2xl font-bold text-pink-600 tabular-nums">
                  {remainingVisits}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-[#7d4964] leading-tight mt-0.5">
                  Venidas faltan
                </div>
                <div className="text-[10px] text-pink-400 mt-0.5">para las 30</div>
              </div>

              <div className="bg-[#fff8fc] rounded-2xl p-3 text-center border border-pink-100/70">
                <div className="flex items-center justify-center text-fuchsia-500 mb-1">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="font-display text-lg sm:text-xl font-bold text-fuchsia-600 tabular-nums whitespace-nowrap">
                  {weeklyPaceInfo.valueText}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-[#7d4964] leading-tight mt-0.5">
                  Ritmo necesario
                </div>
                <div className="text-[10px] text-pink-400 mt-0.5">promedio semanal</div>
              </div>
            </div>

            {/* Motivational Toast / Message Box */}
            <div
              className="mt-4 bg-gradient-to-r from-pink-50 via-rose-50/70 to-fuchsia-50 rounded-2xl p-3.5 border border-pink-200/60 flex items-center gap-3"
              aria-live="polite"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs text-pink-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#5e2843] leading-snug">
                {motivationalBanner}
              </p>
            </div>

            {/* Sticker Picker Bar */}
            <div className="mt-4 pt-3.5 border-t border-pink-100/80 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#7d4964]">
                Elige tu sticker al marcar:
              </span>
              <div className="flex items-center gap-1 bg-pink-50/90 p-1 rounded-2xl border border-pink-100">
                <button
                  type="button"
                  onClick={() => setSelectedStickerMode('auto')}
                  className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedStickerMode === 'auto'
                      ? 'bg-white text-pink-600 shadow-xs'
                      : 'text-[#7d4964] hover:text-pink-600'
                  }`}
                >
                  Sorpresa ✨
                </button>
                {STICKER_TYPES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStickerMode(st)}
                    title={`Sticker ${st}`}
                    aria-label={`Elegir sticker ${st}`}
                    className={`min-h-[36px] min-w-[36px] p-1 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      selectedStickerMode === st
                        ? 'bg-white shadow-xs scale-105 ring-1 ring-pink-300'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <KawaiiSticker
                      type={st}
                      customUrl={customStickers[st]}
                      className="w-5 h-5"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT / BOTTOM PANEL: Interactive 3-Month Calendar (Oct, Nov, Dec 2026) */}
          <section
            aria-label="Calendario de asistencia"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-pink-100/90 select-none"
          >
            {/* Month Segmented Tabs + Prev/Next Arrows */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-100/80">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  disabled={currentMonthIdx === 0}
                  aria-label="Mes anterior"
                  className="min-h-[44px] min-w-[44px] rounded-2xl bg-pink-50 hover:bg-pink-100 disabled:opacity-35 disabled:pointer-events-none text-pink-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center sm:text-left px-1">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#4a1932]">
                    {activeMonth.name}
                  </h2>
                  <p className="text-xs font-medium text-pink-500">
                    {activeMonth.subtitle} ·{' '}
                    <span className="tabular-nums font-semibold">
                      {monthMarkedCount} {monthMarkedCount === 1 ? 'venida' : 'venidas'} este mes
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goNextMonth}
                  disabled={currentMonthIdx === MONTHS.length - 1}
                  aria-label="Mes siguiente"
                  className="min-h-[44px] min-w-[44px] rounded-2xl bg-pink-50 hover:bg-pink-100 disabled:opacity-35 disabled:pointer-events-none text-pink-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Direct Month Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-pink-50/90 p-1 rounded-2xl border border-pink-100">
                {MONTHS.map((m) => {
                  const shortLabel = m.name.split(' ')[0].slice(0, 3);
                  const active = m.index === currentMonthIdx;
                  return (
                    <button
                      key={m.index}
                      type="button"
                      onClick={() => setCurrentMonthIdx(m.index)}
                      className={`min-h-[38px] px-3 py-1.5 rounded-xl font-display text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'text-[#78425d] hover:text-pink-600'
                      }`}
                    >
                      {shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weekday Header Row (Starts on Monday) */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mt-4 mb-2 text-center">
              {WEEKDAYS.map((dayName, idx) => (
                <div
                  key={dayName}
                  className={`font-display text-xs sm:text-sm font-semibold py-1 ${
                    idx >= 5 ? 'text-pink-400' : 'text-[#7d4964]'
                  }`}
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarCells.map((cell) => {
                if (!cell.dayNumber || !cell.dateKey) {
                  return (
                    <div
                      key={cell.key}
                      className="min-h-[54px] sm:min-h-[68px] rounded-2xl bg-pink-50/25 border border-transparent"
                      aria-hidden="true"
                    />
                  );
                }

                const sticker = attendance[cell.dateKey];
                const isMarked = Boolean(sticker);
                const isDisabled = !cell.isInRange || (cell.isFuture && !allowFutureDemo);
                const justPopped = lastMarkedDate === cell.dateKey;

                return (
                  <button
                    key={cell.key}
                    type="button"
                    onClick={() =>
                      handleDayPress(cell.dateKey!, cell.isInRange, cell.isFuture)
                    }
                    aria-pressed={isMarked}
                    aria-label={`${cell.dayNumber} de ${activeMonth.name}${
                      cell.isToday ? ' (Hoy)' : ''
                    }${cell.isDeadline ? ' (Fecha límite Meta)' : ''}${
                      isMarked ? ', Asistencia marcada' : ''
                    }`}
                    className={`group relative min-h-[56px] sm:min-h-[70px] rounded-2xl p-1 sm:p-1.5 flex flex-col items-center justify-between transition-all select-none ${
                      !cell.isInRange
                        ? 'bg-slate-50/60 text-slate-300 border border-slate-100/80 opacity-45 cursor-not-allowed'
                        : isMarked
                        ? 'bg-gradient-to-b from-pink-100/90 to-pink-50 border-2 border-pink-400 shadow-xs cursor-pointer active:scale-95'
                        : cell.isToday
                        ? 'bg-pink-50/90 border-2 border-pink-500 text-[#4a1932] shadow-xs cursor-pointer hover:bg-pink-100/70 active:scale-95'
                        : cell.isDeadline
                        ? 'bg-fuchsia-50/80 border-2 border-fuchsia-400 text-[#4a1932] cursor-pointer hover:bg-fuchsia-100/60 active:scale-95'
                        : isDisabled
                        ? 'bg-[#fff9fc] text-pink-300 border border-pink-100/60 opacity-65 cursor-not-allowed'
                        : 'bg-[#fff9fc] hover:bg-pink-50/90 text-[#52233b] border border-pink-100 cursor-pointer active:scale-95'
                    }`}
                  >
                    {/* Top row inside day cell: Day number + Today / Start / Goal indicator */}
                    <div className="w-full flex items-center justify-between px-1">
                      <span
                        className={`font-display text-xs sm:text-sm font-bold tabular-nums leading-none ${
                          !cell.isInRange
                            ? 'text-slate-300'
                            : cell.isToday
                            ? 'text-pink-600'
                            : cell.isDeadline
                            ? 'text-fuchsia-600'
                            : isMarked
                            ? 'text-pink-700'
                            : 'text-[#5e2b45]'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {cell.isToday && (
                        <span className="text-[9px] sm:text-[10px] font-bold text-pink-600 tracking-tight leading-none">
                          Hoy
                        </span>
                      )}

                      {!cell.isToday && cell.isStartDay && (
                        <span className="text-[9px] sm:text-[10px] font-bold text-pink-500 tracking-tight leading-none">
                          Día 1
                        </span>
                      )}

                      {cell.isDeadline && (
                        <span
                          title="Fecha límite: 21 de diciembre"
                          className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-fuchsia-600 leading-none"
                        >
                          <GoalFlagIcon className="w-3 h-3 text-fuchsia-600" />
                          <span className="hidden sm:inline">Meta</span>
                        </span>
                      )}
                    </div>

                    {/* Center/Bottom slot: Animated Sticker or subtle prompt */}
                    <div className="flex-1 flex items-center justify-center my-0.5">
                      {isMarked ? (
                        <div className={justPopped ? 'animate-sticker-pop' : ''}>
                          <KawaiiSticker
                            type={sticker}
                            customUrl={customStickers[sticker]}
                            className="w-7 h-7 sm:w-9 sm:h-9"
                          />
                        </div>
                      ) : cell.isDeadline ? (
                        <span className="text-xs sm:text-sm" aria-hidden="true">
                          🏁
                        </span>
                      ) : cell.isInRange && (!cell.isFuture || allowFutureDemo) ? (
                        <span
                          className="w-2 h-2 rounded-full bg-pink-200/70 group-hover:bg-pink-300 transition-colors"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend & Swipe Hint */}
            <div className="mt-4 pt-3.5 border-t border-pink-100/80 flex flex-wrap items-center justify-between gap-3 text-xs text-[#7d4964]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md border-2 border-pink-500 bg-pink-50 inline-block" />
                  <span>Hoy</span>
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md border-2 border-fuchsia-400 bg-fuchsia-50 inline-block" />
                  <span>Meta 21/dic 🏁</span>
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  <span>Día asistido</span>
                </span>
              </div>

              <span className="text-[11px] text-pink-400">
                Desliza o usa las flechas para cambiar de mes
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Footer with Dedication + Discreet Actions */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 mt-2 border-t border-pink-100/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7d4964]">
        <p className="font-display text-sm font-semibold text-pink-600 flex items-center gap-1.5">
          <span>Hecho con amor por Cristhian 💗</span>
        </p>

        <div className="flex items-center gap-3">
          {visitsCount >= GOAL_VISITS && (
            <button
              type="button"
              onClick={() => setShowCelebration(true)}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Ver celebración 🎉
            </button>
          )}

          <button
            type="button"
            onClick={() => setAllowFutureDemo((prev) => !prev)}
            title="Permite probar marcando cualquier fecha del rango aunque sea futura"
            className="min-h-[36px] px-2.5 py-1.5 rounded-xl text-[#8d5b74] hover:text-pink-600 hover:bg-pink-50 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            {allowFutureDemo ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-pink-500" />
                <span>Bloquear días futuros</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Modo prueba</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="min-h-[36px] px-2.5 py-1.5 rounded-xl text-[#8d5b74] hover:text-rose-600 hover:bg-rose-50 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </footer>

      {/* Custom In-App Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3b1528]/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-pink-200 text-center animate-sticker-pop">
            <div className="flex justify-center mb-3">
              <KawaiiSticker type="kitty" customUrl={customStickers.kitty} className="w-14 h-14" />
            </div>
            <h3
              id="reset-modal-title"
              className="font-display text-xl font-bold text-[#4a1932] mb-2"
            >
              ¿Reiniciar tu calendario?
            </h3>
            <p className="text-sm text-[#6b3852] mb-6 leading-relaxed">
              Se borrarán las{' '}
              <span className="font-bold text-pink-600 tabular-nums">{visitsCount}</span>{' '}
              asistencias marcadas hasta ahora. ¿Estás segura de empezar desde cero?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="min-h-[44px] py-2.5 px-4 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#5e2843] font-display font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="min-h-[44px] py-2.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-display font-semibold text-sm shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Sí, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti Celebration Modal when reaching 30 visits */}
      <ConfettiCelebration
        show={showCelebration}
        onDismiss={() => setShowCelebration(false)}
      />
    </div>
  );
}
