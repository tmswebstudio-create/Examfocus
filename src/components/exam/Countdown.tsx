"use client";

import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface CountdownProps {
  date: string;
  variant?: 'default' | 'featured';
}

export function ExamCountdown({ date, variant = 'default' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [past, setPast] = useState(false);

  useEffect(() => {
    const target = parseISO(date);

    const intervalId = setInterval(() => {
      const now = new Date();
      if (isPast(target)) {
        setPast(true);
        clearInterval(intervalId);
        return;
      }
      
      const d = differenceInDays(target, now);
      const h = differenceInHours(target, now) % 24;
      const m = differenceInMinutes(target, now) % 60;
      const s = differenceInSeconds(target, now) % 60;

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    // Initial check to avoid 1-second delay on first render
    if (isPast(target)) {
      setPast(true);
    } else {
        const now = new Date();
        const d = differenceInDays(target, now);
        const h = differenceInHours(target, now) % 24;
        const m = differenceInMinutes(target, now) % 60;
        const s = differenceInSeconds(target, now) % 60;
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }

    return () => clearInterval(intervalId);
  }, [date]);

  if (past) {
    return (
      <span className={cn(
        "font-medium",
        variant === 'featured' ? "text-white/80" : "text-muted-foreground"
      )}>
        Exam Day!
      </span>
    );
  }

  const valueClasses = cn(
    "font-bold leading-none",
    variant === 'featured' ? "text-4xl md:text-5xl text-white tracking-tighter" : "text-xl text-primary"
  );

  const labelClasses = cn(
    "text-[10px] md:text-xs uppercase tracking-widest font-bold",
    variant === 'featured' ? "text-white/60 mt-2" : "text-muted-foreground"
  );

  const divider = <div className="h-10 w-px bg-white/20 hidden md:block" />;

  return (
    <div className={cn("flex items-start justify-center", variant === 'featured' ? "gap-4 md:gap-6" : "gap-3")}>
      <div className="flex flex-col items-center w-14 text-center">
        <span className={valueClasses}>{timeLeft.days}</span>
        <span className={labelClasses}>Days</span>
      </div>
      {variant === 'featured' && divider}
      <div className="flex flex-col items-center w-14 text-center">
        <span className={valueClasses}>{timeLeft.hours}</span>
        <span className={labelClasses}>Hours</span>
      </div>
      {variant === 'featured' && divider}
      <div className="flex flex-col items-center w-14 text-center">
        <span className={valueClasses}>{timeLeft.minutes}</span>
        <span className={labelClasses}>Mins</span>
      </div>
      {variant === 'featured' && divider}
      <div className="flex flex-col items-center w-14 text-center">
        <span className={valueClasses}>{timeLeft.seconds}</span>
        <span className={labelClasses}>Secs</span>
      </div>
    </div>
  );
}
