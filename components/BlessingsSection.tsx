'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function BlessingsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);

  const slidesData = [
    {
      arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا\nلِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
      english: '"And among His signs is that\nHe created for you from yourselves\nmates that you may find tranquility in them\nand He placed between you love and mercy."',
      reference: '— Quran 30:21',
    },
    {
      arabic: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ\nوَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
      english: '"May Allah bless you, shower His blessings upon you,\nand unite you both in goodness."',
      reference: '— Sunan Abi Dawud 2130',
    },
    {
      arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا\nقُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
      english: '"Our Lord, grant us from among our spouses and offspring\ncomfort to our eyes and make us an example for the righteous."',
      reference: '— Quran 25:74',
    },
  ];

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

  const goToSlide = (nextIdx: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const normalized = (nextIdx + slidesData.length) % slidesData.length;
    setCurrentIndex(normalized);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  };

  return (
    <section ref={sectionRef} id="blessings-section" className="relative py-10 sm:py-14 px-4 overflow-hidden">
      <div className="w-[91%] max-w-[460px] mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-5 sm:mb-6">
          <h2 className="font-cinzel text-[16px] sm:text-[18px] text-[#4a181d] font-bold tracking-[0.14em] uppercase">
            Blessings &amp; Moments
          </h2>
          <div className="flex items-center justify-center gap-2 w-28 sm:w-32 mx-auto mt-1.5">
            <span className="h-[1px] bg-[#c4908a]/50 flex-1"></span>
            <span className="text-[#9e4751] text-[10px]">♥</span>
            <span className="h-[1px] bg-[#c4908a]/50 flex-1"></span>
          </div>
        </div>

        {/* Carousel Card Container without Left/Right Arrow Buttons */}
        <div className="relative">
          {/* Rounded Blessing Card */}
          <div
            id="blessing-card"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="wedding-card px-5 py-7 sm:px-8 sm:py-8 text-center min-h-[200px] flex flex-col justify-between transition-all duration-300 select-none cursor-grab active:cursor-grabbing"
          >
            {/* Slides Wrapper */}
            <div id="blessings-slider" className="relative overflow-hidden w-full">
              {slidesData.map((slide, idx) => (
                <div
                  key={idx}
                  className={`blessing-slide transition-opacity duration-300 ${
                    idx === currentIndex ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <p
                    className="font-arabic text-[#7a2835] text-base sm:text-lg font-bold leading-relaxed tracking-wide mb-2 sm:mb-2.5 whitespace-pre-line"
                    dir="rtl"
                  >
                    {slide.arabic}
                  </p>
                  <p className="font-serif italic text-[13.5px] sm:text-[13px] text-[#4a2028] leading-relaxed max-w-sm mx-auto mb-2 whitespace-pre-line">
                    {slide.english}
                  </p>
                  <span className="text-[10px] sm:text-[11px] font-sans tracking-widest uppercase text-[#882937]/80 font-semibold block">
                    {slide.reference}
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div id="blessing-dots" className="flex items-center justify-center gap-2 mt-4 pt-1">
              {slidesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`blessing-dot h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-[#882937] w-3.5' : 'bg-[#ebd3c5] w-2'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
