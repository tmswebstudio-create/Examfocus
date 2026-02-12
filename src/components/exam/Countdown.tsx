"use client";

import { useEffect, useState } from 'react';
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO, isPast } from 'date-fns';

interface CountdownProps {
  date: string;
}

export function ExamCountdown({ date }: CountdownProps) {
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
    return <span className="text-muted-foreground font-medium">Exam Day!</span>;
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">{timeLeft.days}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">{timeLeft.hours}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">{timeLeft.minutes}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Mins</span>
      </div>
    </div>
  );
}