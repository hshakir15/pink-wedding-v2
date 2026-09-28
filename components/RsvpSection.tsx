'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function RsvpSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState('yes');
  const [guestCount, setGuestCount] = useState('2');
  const [dietaryPref, setDietaryPref] = useState('halal');

  // Wishes Carousel State
  const [currentWishIndex, setCurrentWishIndex] = useState(0);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wishes = [
    {
      quote: '“May your Nikah be the beginning of a lifetime\nof love, peace and barakah.”',
      author: '— Junaid TT',
    },
    {
      quote: '“May Allah bless your journey together with\nendless love, mercy and happiness.”',
      author: '— Shihab KSA',
    },
    {
      quote: '“May your home always be filled with\nsakinah, mawaddah and rahmah.”',
      author: '— Kaleel',
    },
    {
      quote: '“May Allah grant you both a beautiful life\ntogether and bless your union always.”',
      author: '— Nisar NSR',
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
    const barakallahuContainer = document.getElementById('barakallahu-lakuma-container');

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

    if (barakallahuContainer) {
      gsap.fromTo(
        barakallahuContainer.children,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: barakallahuContainer,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }
  }, []);

  // Auto sliding timer for wishes
  useEffect(() => {
    const startTimer = () => {
      stopTimer();
      autoTimerRef.current = setInterval(() => {
        setCurrentWishIndex((prev) => (prev + 1) % wishes.length);
      }, 5000);
    };

    const stopTimer = () => {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
    };

    startTimer();
    return () => stopTimer();
  }, [wishes.length]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#e5a91f', '#ffffff', '#f6d56d', '#ff9a9e'],
      });
    } catch (err) {
      console.log('Confetti error', err);
    }

    setSubmitted(true);

    // Format WhatsApp confirmation
    const attendText = attending === 'yes' ? 'Joyfully Accept 💍' : 'Regretfully Decline 💐';
    const message = `*Wedding RSVP — Safina & Ghalib*%0A%0A*Name:* ${encodeURIComponent(
      guestName
    )}%0A*Attendance:* ${encodeURIComponent(attendText)}%0A*Guests:* ${guestCount}%0A*Dietary:* ${encodeURIComponent(
      dietaryPref
    )}`;

    const whatsappUrl = `https://wa.me/919876543210?text=${message}`;
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  };

  return (
    <section ref={sectionRef} id="rsvp-section" className="relative py-14 sm:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <span className="font-script text-[#b8860b] text-2xl sm:text-4xl">
            Honor Us with Your Presence
          </span>
          <h2 className="font-cinzel text-xl sm:text-3xl md:text-4xl text-[#4a181d] uppercase tracking-[0.2em] font-bold mt-1">
            RSVP
          </h2>
          <div className="flex items-center justify-center gap-2 w-28 sm:w-32 mx-auto my-3 opacity-80">
            <span className="h-[1px] bg-[#b8860b]/60 flex-1"></span>
            <span className="text-[#b8860b] text-xs">💌</span>
            <span className="h-[1px] bg-[#b8860b]/60 flex-1"></span>
          </div>
          <p className="font-serif italic text-[#6b2c37] text-sm sm:text-base">
            Please respond by November 15, 2026 to help us make your experience unforgettable.
          </p>
        </div>

        {/* RSVP Form Container */}
        <div className="wedding-card p-6 sm:p-9 md:p-10">
          {!submitted ? (
            <form id="rsvp-form" onSubmit={handleFormSubmit} className="space-y-5 sm:space-y-6">
              {/* Guest Name */}
              <div>
                <label
                  htmlFor="guest-name"
                  className="block text-[11px] sm:text-xs uppercase tracking-widest text-[#7a323d] font-sans font-semibold mb-1.5 sm:mb-2"
                >
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="guest-name"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Tariq & Family"
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#fffbf8] border border-[#edd4c5] text-[#4a1c22] focus:border-[#c27660] focus:ring-1 focus:ring-[#c27660] outline-none font-sans text-sm transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Attendance Options */}
              <div>
                <label className="block text-[11px] sm:text-xs uppercase tracking-widest text-[#7a323d] font-sans font-semibold mb-1.5 sm:mb-2">
                  Will you be attending? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-sans text-sm">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      attending === 'yes'
                        ? 'border-[#c27660] bg-[#faece3]'
                        : 'border-[#edd4c5] bg-[#fffbf8] hover:border-[#c27660]'
                    } text-[#4a1c22]`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={attending === 'yes'}
                      onChange={() => setAttending('yes')}
                      className="accent-[#c27660]"
                    />
                    <span>Joyfully Accept 💍</span>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      attending === 'no'
                        ? 'border-[#c27660] bg-[#faece3]'
                        : 'border-[#edd4c5] bg-[#fffbf8] hover:border-[#c27660]'
                    } text-[#4a1c22]`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={attending === 'no'}
                      onChange={() => setAttending('no')}
                      className="accent-[#c27660]"
                    />
                    <span>Regretfully Decline 💐</span>
                  </label>
                </div>
              </div>

              {/* Guests Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="guest-count"
                    className="block text-[11px] sm:text-xs uppercase tracking-widest text-[#7a323d] font-sans font-semibold mb-1.5 sm:mb-2"
                  >
                    Total Guests Attending
                  </label>
                  <select
                    id="guest-count"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#fffbf8] border border-[#edd4c5] text-[#4a1c22] focus:border-[#c27660] focus:ring-1 focus:ring-[#c27660] outline-none font-sans text-sm transition-all"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 Persons</option>
                    <option value="3">3 Persons</option>
                    <option value="4">4 Persons</option>
                    <option value="5+">5+ Family</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dietary-pref"
                    className="block text-[11px] sm:text-xs uppercase tracking-widest text-[#7a323d] font-sans font-semibold mb-1.5 sm:mb-2"
                  >
                    Dietary Preference
                  </label>
                  <select
                    id="dietary-pref"
                    value={dietaryPref}
                    onChange={(e) => setDietaryPref(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#fffbf8] border border-[#edd4c5] text-[#4a1c22] focus:border-[#c27660] focus:ring-1 focus:ring-[#c27660] outline-none font-sans text-sm transition-all"
                  >
                    <option value="halal">Halal Multi-Cuisine Feast</option>
                    <option value="vegetarian">Pure Vegetarian / Jain</option>
                    <option value="vegan">Vegan / Special</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#9e7010] text-white font-cinzel font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_4px_20px_rgba(184,134,11,0.35)] hover:shadow-[0_6px_25px_rgba(184,134,11,0.5)] transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Confirm RSVP</span>
              </button>
            </form>
          ) : (
            /* Success Confirmation Message */
            <div id="rsvp-success-box" className="text-center py-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bounce">
                <Check className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl text-[#4a181d] font-bold mb-1.5">
                Jazakallah Khair for Your RSVP!
              </h3>
              <p className="font-serif italic text-[#5c242b] text-base sm:text-lg">
                We are so excited to celebrate this blessed Nikah with you.
              </p>
            </div>
          )}
        </div>

        {/* BLESSINGS & BEST WISHES SECTION (FLOATING AUTO-SLIDING WISHES CAROUSEL) */}
        <div className="mt-14 sm:mt-16 text-center max-w-xl mx-auto space-y-5 sm:space-y-6">
          {/* Couple Script Header (Safina & Ghalib) */}
          <div className="pt-1 pb-0.5">
            <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-[#7a1d2e] tracking-wide select-none drop-shadow-[0_1px_2px_rgba(122,29,46,0.12)]">
              Safina &amp; Ghalib
            </h2>
          </div>

          {/* Warm Note */}
          <div className="space-y-1 text-[14px] sm:text-sm md:text-[15px] text-[#4a2028] font-serif leading-relaxed px-4">
            <p>Your presence and prayers will make our day complete.</p>
            <p>We look forward to celebrating with you, InshaAllah.</p>
          </div>

          {/* Center Floral / Diamond Divider */}
          <div className="flex items-center justify-center gap-2.5 w-36 sm:w-48 mx-auto opacity-75 py-1">
            <span className="h-[1px] bg-[#c4908a]/60 flex-1"></span>
            <span className="text-[#c4908a] text-[8px]">◆</span>
            <span className="text-[#9e3b4e] text-xs">❖</span>
            <span className="text-[#c4908a] text-[8px]">◆</span>
            <span className="h-[1px] bg-[#c4908a]/60 flex-1"></span>
          </div>

          {/* With Love From */}
          <div className="space-y-1.5 px-4">
            <span className="font-sans text-[10px] sm:text-[10px] uppercase tracking-[0.28em] text-[#8a5560] font-semibold block">
              WITH LOVE FROM
            </span>
            <p className="font-serif text-[14px] sm:text-sm text-[#4a2028] leading-snug">
              Mrs. &amp; Mr. Mohammed Ashraf (W/o Abdul Hameed Bajal,
              <br className="hidden sm:inline" />
              Nanthoor Faisal Nagara)
            </p>
          </div>

          {/* BEST WISHES FROM Header + Heart Divider */}
          <div className="pt-2 sm:pt-3">
            <span className="font-sans text-[10px] sm:text-[10px] uppercase tracking-[0.28em] text-[#8a5560] font-semibold block">
              BEST WISHES FROM
            </span>

            {/* Thin elegant blush/gold horizontal divider with small burgundy heart in center */}
            <div className="flex items-center justify-center gap-2 w-32 sm:w-40 mx-auto mt-2.5 mb-5 opacity-85">
              <span className="h-[1px] bg-[#c4908a]/70 flex-1"></span>
              <span className="text-[#7a1d2e] text-[11px]">♥</span>
              <span className="h-[1px] bg-[#c4908a]/70 flex-1"></span>
            </div>

            {/* AUTO-SLIDING WISHES CONTAINER (NO CARD, FLOATING ON WATERCOLOR) */}
            <div id="wishes-carousel" className="relative max-w-lg mx-auto px-4 cursor-default select-none">
              {/* Slides Stack (CSS Grid keeps height stable with zero layout shift) */}
              <div className="grid grid-cols-1 items-center justify-center min-h-[110px] sm:min-h-[120px]">
                {wishes.map((wish, idx) => (
                  <div
                    key={idx}
                    className={`wish-slide col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-700 ease-out ${
                      idx === currentWishIndex
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-3 pointer-events-none'
                    }`}
                  >
                    <blockquote className="font-serif italic text-base sm:text-lg md:text-[21px] text-[#4a181d] font-normal leading-relaxed whitespace-pre-line">
                      {wish.quote}
                    </blockquote>
                    <cite className="font-serif text-xs sm:text-sm text-[#7a323d] mt-2 block not-italic tracking-wide">
                      {wish.author}
                    </cite>
                  </div>
                ))}
              </div>

              {/* 4 Small Pagination Dots */}
              <div className="flex items-center justify-center gap-2 mt-4" id="wishes-dots">
                {wishes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentWishIndex(idx)}
                    className="wish-dot w-2 h-2 rounded-full transition-all duration-500 cursor-pointer"
                    style={{
                      backgroundColor: idx === currentWishIndex ? '#7a1d2e' : '#ecd2cf',
                    }}
                    aria-label={`Go to wish ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* DECORATIVE CLOSING ELEMENT (REFINED COMPACT MASTER ARCH & FLOURISH WITH REAL TEXT) */}
          <div
            id="barakallahu-lakuma-container"
            className="pt-5 sm:pt-6 pb-2 px-3 flex flex-col items-center justify-center select-none text-center space-y-2 sm:space-y-2.5 max-w-[340px] sm:max-w-[400px] mx-auto"
          >
            {/* 1. Top Arch Divider */}
            <img
              src="/assets/images/barakallahu_arch.png"
              alt="Islamic Arch Divider"
              className="w-full max-w-[210px] sm:max-w-[260px] h-auto object-contain filter drop-shadow-[0_1px_4px_rgba(184,134,11,0.15)] pointer-events-none"
              loading="lazy"
            />

            {/* 2. Real Typography: BARAKALLAHU LAKUMA */}
            <h3 className="font-cinzel text-[11px] sm:text-xs md:text-[13px] uppercase tracking-[0.38em] sm:tracking-[0.46em] text-[#9b6f28] font-bold text-center leading-none pl-1 filter drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
              BARAKALLAHU LAKUMA
            </h3>

            {/* 3. Bottom Ornamental Flourish */}
            <img
              src="/assets/images/barakallahu_flourish.png"
              alt="Decorative Flourish"
              className="w-full max-w-[160px] sm:max-w-[200px] h-auto object-contain filter drop-shadow-[0_1px_4px_rgba(184,134,11,0.15)] pointer-events-none"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
