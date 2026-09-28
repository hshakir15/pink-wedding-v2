'use client';

import React, { useEffect, useRef } from 'react';
import { MapPin, Phone, Send, Compass } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function VenueSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

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

  return (
    <section ref={sectionRef} id="venue-section" className="relative py-14 sm:py-20 px-4">
      <div className="max-w-4xl lg:max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="font-script text-[#b8860b] text-2xl sm:text-4xl block mb-1">
            The Destination
          </span>
          <h2 className="font-cinzel text-xl sm:text-3xl md:text-4xl text-[#4a181d] uppercase tracking-[0.18em] font-bold">
            Venue &amp; Location
          </h2>
          <div className="flex items-center justify-center gap-2 w-28 sm:w-36 mx-auto mt-2 mb-2 opacity-80">
            <span className="h-[1px] bg-[#c4908a]/60 flex-1"></span>
            <span className="text-[#9e4751] text-[10px]">♥</span>
            <span className="h-[1px] bg-[#c4908a]/60 flex-1"></span>
          </div>
          <p className="font-sans text-[10px] sm:text-[10px] uppercase tracking-[0.24em] text-[#8a5560] font-semibold">
            A Beautiful Place for a Beautiful Beginning
          </p>
        </div>

        {/* Main Venue Card */}
        <div className="wedding-card p-6 sm:p-9 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Details Column */}
            <div className="space-y-4 sm:space-y-5">
              <div>
                <span className="font-cinzel text-[10.5px] sm:text-[11px] uppercase tracking-[0.22em] text-[#8a5560] font-bold block mb-1">
                  Royal Heritage Palace
                </span>
                <h3 className="font-cinzel text-2xl sm:text-3xl lg:text-[34px] text-[#4a181d] font-bold tracking-[0.04em] leading-tight">
                  Lake Palace Grounds
                </h3>
                <div className="flex items-center gap-2 w-24 sm:w-28 mt-2 mb-3.5 opacity-60">
                  <span className="h-[1px] bg-[#c4908a] flex-1"></span>
                  <span className="text-[#9e4751] text-[8px]">❖</span>
                  <span className="h-[1px] bg-[#c4908a] flex-1"></span>
                </div>
                <p className="font-serif italic text-xs sm:text-sm text-[#5c242b] leading-relaxed">
                  Surrounded by tranquil waters and majestic historic courtyards, creating the perfect fairy-tale setting for our Nikah ceremony.
                </p>
              </div>

              {/* Info Rows */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#faece3] border border-[#edd4c5] flex items-center justify-center shrink-0 text-[#882937]">
                    <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <span className="font-sans text-[13px] sm:text-[13px] text-[#4a2028] leading-snug">
                    Lake Palace Road, Heritage District, Udaipur, Rajasthan
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#faece3] border border-[#edd4c5] flex items-center justify-center shrink-0 text-[#882937]">
                    <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <span className="font-sans text-[13px] sm:text-[13px] text-[#4a2028] leading-snug">
                    Concierge &amp; Guest Assistance: +91 98765 43210
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#7a1c2d] hover:bg-[#631422] text-white font-cinzel font-bold text-[11px] sm:text-xs uppercase tracking-[0.14em] shadow-md transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Open in Google Maps</span>
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-[#7a1c2d] text-[#7a1c2d] hover:bg-[#7a1c2d]/10 font-cinzel font-bold text-[11px] sm:text-xs uppercase tracking-[0.14em] transition-all active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="rounded-2xl overflow-hidden border border-[#edd4c5] shadow-md relative w-full aspect-[4/3] sm:aspect-[16/11] group">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                alt="Lake Palace Grounds"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="font-script text-2xl sm:text-3xl text-white drop-shadow-md block mb-0.5">
                  Lake Palace Grounds
                </span>
                <div className="flex items-center justify-center gap-2 w-36 sm:w-44 mx-auto opacity-90">
                  <span className="h-[1px] bg-white/60 flex-1"></span>
                  <span className="text-[10px] sm:text-[10px] uppercase tracking-[0.24em] text-white/95 font-sans font-semibold">
                    Udaipur, Rajasthan
                  </span>
                  <span className="h-[1px] bg-white/60 flex-1"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Subtitle / Divider */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 w-24 sm:w-28 mx-auto mb-2 opacity-70">
            <span className="h-[1px] bg-[#c4908a]/60 flex-1"></span>
            <span className="text-[#9e4751] text-[10px]">♥</span>
            <span className="h-[1px] bg-[#c4908a]/60 flex-1"></span>
          </div>
          <p className="font-cinzel text-[10px] sm:text-[11px] text-[#8a5560] tracking-[0.24em] uppercase font-bold">
            Same Place, A New Chapter
          </p>
        </div>
      </div>
    </section>
  );
}
