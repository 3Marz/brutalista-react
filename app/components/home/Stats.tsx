import { memo, useEffect, useRef, useState } from 'react';

interface Stat {
  icon?: string;
  title?: string;
  number?: number | string;
  more_then?: boolean;
}

export interface StatsData {
  stats?: Stat[];
  [key: string]: unknown;
}

/** easeOutCubic, matching the Twig theme's `stats.js`. */
const easeOutCubic = (t: number) => (--t) * t * t + 1;

/**
 * Counts up to `value` once scrolled into view — the React equivalent of the
 * Twig theme's `<stat-count>` custom element (`src/assets/js/partials/stats.js`).
 */
function StatCount({ value, moreThen }: { value: number; moreThen?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(value)) return;

    const duration = 700;
    const range = value;
    let raf = 0;

    const run = () => {
      const timeStart = Date.now();
      const loop = () => {
        const elapsed = Math.min(Date.now() - timeStart, duration);
        setDisplay(Math.trunc(range * easeOutCubic(elapsed / duration)));
        if (elapsed < duration) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    if (typeof IntersectionObserver === 'undefined') {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="text-xl md:text-2xl font-bold stat-value s-ltr">
      {moreThen ? `+${display}` : display}
    </span>
  );
}

/**
 * `stats` home block — a row of dashed counters. Ported from the Twig theme's
 * `home/stats.twig`, with `<stat-count>` reimplemented as {@link StatCount}.
 */
export const Stats = memo(function Stats({ data }: { data: StatsData }) {
  const { stats = [] } = data;

  if (!stats.length) return null;

  return (
    <div className="container">
      <div className="flex gap-8 flex-wrap justify-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="pb-4 pt-5 px-7 border-2 border-base-300 border-dashed rounded-neo w-40 sm:w-52 md:w-60 flex flex-col items-center text-center"
          >
            <i className={`${stat.icon || ''} mb-1 md:mb-2 text-2xl md:text-3xl`} />
            <StatCount value={Number(stat.number) || 0} moreThen={stat.more_then} />
            <p className="text-sm md:text-base">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
});
