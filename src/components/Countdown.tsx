"use client";

import { useState, useEffect } from "react";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStarted, setIsStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Waktu Kick-Off: 12 Juni 2026 02:00:00 WIB
    const targetDate = new Date("2026-06-12T02:00:00+07:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        setIsStarted(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  if (isStarted) {
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    return (
      <div className="bg-avg-green text-white py-3 px-6 font-black uppercase tracking-[0.2em] italic transform -skew-x-6 inline-block mb-8 shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
        MATCHDAY : {today}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-4 mb-8">
      <div className="bg-white/5 border border-white/10 p-3 md:p-4 transform -skew-x-6 min-w-[60px] md:min-w-[80px] text-center shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <span className="block text-2xl md:text-3xl font-black text-white">{timeLeft.days}</span>
        <span className="text-[8px] md:text-[9px] text-avg-green uppercase font-bold tracking-widest">Days</span>
      </div>
      <div className="bg-white/5 border border-white/10 p-3 md:p-4 transform -skew-x-6 min-w-[60px] md:min-w-[80px] text-center shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <span className="block text-2xl md:text-3xl font-black text-white">{timeLeft.hours}</span>
        <span className="text-[8px] md:text-[9px] text-avg-green uppercase font-bold tracking-widest">Hrs</span>
      </div>
      <div className="bg-white/5 border border-white/10 p-3 md:p-4 transform -skew-x-6 min-w-[60px] md:min-w-[80px] text-center shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <span className="block text-2xl md:text-3xl font-black text-white">{timeLeft.minutes}</span>
        <span className="text-[8px] md:text-[9px] text-avg-green uppercase font-bold tracking-widest">Min</span>
      </div>
      <div className="bg-white/5 border border-white/10 p-3 md:p-4 transform -skew-x-6 min-w-[60px] md:min-w-[80px] text-center shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <span className="block text-2xl md:text-3xl font-black text-torch-red">{timeLeft.seconds}</span>
        <span className="text-[8px] md:text-[9px] text-torch-red uppercase font-bold tracking-widest">Sec</span>
      </div>
    </div>
  );
}