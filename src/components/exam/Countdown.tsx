"use client";

import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface CountdownProps {
  date: string;
  variant?: 'default' | 'featured';
}

export function ExamCountdown({ date, variant = 'default' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [past, setPast] = useState(false);

  useEffect(() => {
    const target = parseISO(date);
    
    const update = () => {
      if (isPast(target)) {
        setPast(true);
        return;
      }

      const d = differenceInDays(target, new Date());
      const h = differenceInHours(target, new Date()) % 24;
      const m = differenceInMinutes(target, new Date()) % 60;

      setTimeLeft({ days: d, hours: h, minutes: m });
    };

    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
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
    variant === 'featured' ? "text-5xl md:text-7xl text-white tracking-tighter" : "text-2xl text-primary"
  );

  const labelClasses = cn(
    "text-[10px] md:text-xs uppercase tracking-widest font-bold",
    variant === 'featured' ? "text-white/60 mt-2" : "text-muted-foreground"
  );

  return (
    <div className={cn("flex items-center", variant === 'featured' ? "gap-6 md:gap-10" : "gap-4")}>
      <div className="flex flex-col items-center">
        <span className={valueClasses}>{timeLeft.days}</span>
        <span className={labelClasses}>Days</span>
      </div>
      <div className="h-10 w-px bg-white/20 hidden md:block" />
      <div className="flex flex-col items-center">
        <span className={valueClasses}>{timeLeft.hours}</span>
        <span className={labelClasses}>Hours</span>
      </div>
      <div className="h-10 w-px bg-white/20 hidden md:block" />
      <div className="flex flex-col items-center">
        <span className={valueClasses}>{timeLeft.minutes}</span>
        <span className={labelClasses}>Mins</span>
      </div>
    </div>
  );
}
