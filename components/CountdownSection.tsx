'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const [exitingUnits, setExitingUnits] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const prevValuesRef = useRef(timeLeft);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const header = section.querySelector('h2');
    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    const weddingDate = new Date('December 12, 2026 11:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      const newValues = {
        days: d < 10 ? '0' + d : '' + d,
        hours: h < 10 ? '0' + h : '' + h,
        minutes: m < 10 ? '0' + m : '' + m,
        seconds: s < 10 ? '0' + s : '' + s,
      };

      const changing: any = {};
      if (newValues.days !== prevValuesRef.current.days) changing.days = true;
      if (newValues.hours !== prevValuesRef.current.hours) changing.hours = true;
      if (newValues.minutes !== prevValuesRef.current.minutes) changing.minutes = true;
      if (newValues.seconds !== prevValuesRef.current.seconds) changing.seconds = true;

      if (Object.keys(changing).length > 0) {
        setExitingUnits((prev) => ({ ...prev, ...changing }));
        setTimeout(() => {
          setTimeLeft(newValues);
          prevValuesRef.current = newValues;
          setExitingUnits({ days: false, hours: false, minutes: false, seconds: false });
        }, 120);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} id="countdown-section" className="relative py-10 sm:py-14 px-4">
      <div className="w-[93%] max-w-[500px] sm:max-w-[520px] mx-auto">
        {/* Seamless Countdown Container (No outer card background or border, individual timer unit borders preserved) */}
        <div className="relative px-2 py-4 sm:px-6 sm:py-6 text-center select-none">
          {/* Header */}
          <h2 className="font-cinzel text-xl sm:text-2xl md:text-[26px] text-[#42121a] font-bold tracking-[0.24em] uppercase leading-tight select-none">
            Counting Down
          </h2>
          <p className="font-serif italic text-sm sm:text-[15px] md:text-base text-[#8a4452] mt-1.5 mb-5 sm:mb-6 font-normal">
            to the moment they say Qabool
          </p>

          {/* Countdown Timer Blocks (4 Elevated Rounded Luxury Units with borders intact) */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-[440px] mx-auto mb-5 sm:mb-6">
            <div className="countdown-unit-box rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-1 sm:px-2 flex flex-col items-center justify-center min-w-0">
              <span
                id="days"
                className={`countdown-digit font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#42121a] block leading-none ${
                  exitingUnits.days ? 'digit-exit' : ''
                }`}
              >
                {timeLeft.days}
              </span>
              <span className="text-[9.5px] sm:text-[9.5px] md:text-[10px] uppercase tracking-[0.22em] text-[#783540] font-cinzel mt-1.5 sm:mt-2 block font-medium truncate">
                DAYS
              </span>
            </div>

            <div className="countdown-unit-box rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-1 sm:px-2 flex flex-col items-center justify-center min-w-0">
              <span
                id="hours"
                className={`countdown-digit font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#42121a] block leading-none ${
                  exitingUnits.hours ? 'digit-exit' : ''
                }`}
              >
                {timeLeft.hours}
              </span>
              <span className="text-[9.5px] sm:text-[9.5px] md:text-[10px] uppercase tracking-[0.22em] text-[#783540] font-cinzel mt-1.5 sm:mt-2 block font-medium truncate">
                HOURS
              </span>
            </div>

            <div className="countdown-unit-box rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-1 sm:px-2 flex flex-col items-center justify-center min-w-0">
              <span
                id="minutes"
                className={`countdown-digit font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#42121a] block leading-none ${
                  exitingUnits.minutes ? 'digit-exit' : ''
                }`}
              >
                {timeLeft.minutes}
              </span>
              <span className="text-[9.5px] sm:text-[9.5px] md:text-[10px] uppercase tracking-[0.22em] text-[#783540] font-cinzel mt-1.5 sm:mt-2 block font-medium truncate">
                MINUTES
              </span>
            </div>

            <div className="countdown-unit-box rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 px-1 sm:px-2 flex flex-col items-center justify-center min-w-0">
              <span
                id="seconds"
                className={`countdown-digit font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#42121a] block leading-none ${
                  exitingUnits.seconds ? 'digit-exit' : ''
                }`}
              >
                {timeLeft.seconds}
              </span>
              <span className="text-[9.5px] sm:text-[9.5px] md:text-[10px] uppercase tracking-[0.22em] text-[#783540] font-cinzel mt-1.5 sm:mt-2 block font-medium truncate">
                SECONDS
              </span>
            </div>
          </div>

          {/* Decorative Divider: Champagne Gold Lines with Subtle Burgundy Heart */}
          <div className="flex items-center justify-center gap-2.5 w-32 sm:w-40 mx-auto mb-3.5 opacity-80">
            <span className="h-[1px] bg-gradient-to-r from-transparent via-[#d8b98a] to-[#d8b98a] flex-1"></span>
            <span className="text-[#541922] text-[9px] leading-none select-none">♥</span>
            <span className="h-[1px] bg-gradient-to-l from-transparent via-[#d8b98a] to-[#d8b98a] flex-1"></span>
          </div>

          {/* Bottom Note */}
          <p className="font-serif italic text-sm sm:text-[15px] md:text-base text-[#541922] tracking-wide mb-1.5">
            The blessed day is here <span className="text-[#7a1f2e] not-italic">♥</span>
          </p>
          <p className="font-cinzel text-[10.5px] sm:text-[10.5px] md:text-[11px] uppercase tracking-[0.22em] text-[#5c242b] font-medium leading-relaxed">
            SATURDAY · 12TH DECEMBER 2026 · 11:00 AM
          </p>
        </div>
      </div>
    </section>
  );
}
