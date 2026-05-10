'use client';

import { useEffect, useRef, useState } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const defaultStats: StatItem[] = [
  { value: 20, suffix: '+', label: 'Years Experience' },
  { value: 35, suffix: '+', label: 'Projects Delivered' },
  { value: 1200, suffix: '+', label: 'Units Handed Over' },
  { value: 950, suffix: '+', label: 'Happy Families' },
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ stat, animate }: { stat: StatItem; animate: boolean }) {
  const count = useCountUp(stat.value, 1800, animate);
  return (
    <div className="text-center group">
      <div className="text-4xl sm:text-5xl font-bold text-stone-900 mb-2 tabular-nums">
        {stat.prefix}{count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm text-stone-500 font-medium uppercase tracking-wider">{stat.label}</div>
      <div className="mt-4 h-0.5 w-8 bg-amber-500 mx-auto transition-all duration-300 group-hover:w-16" />
    </div>
  );
}

interface StatsProps {
  stats?: StatItem[];
}

export default function StatsSection({ stats = defaultStats }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white border-y border-stone-100 py-16">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x divide-stone-100">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
}
