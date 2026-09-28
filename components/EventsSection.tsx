'use client';

import React, { useEffect, useRef } from 'react';
import { Calendar, Moon, Clock, Utensils, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function EventsSection() {
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
    const eventsCard = section.querySelector('.wedding-card');
    const detailRows = section.querySelectorAll('.detail-row');

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

    if (eventsCard && detailRows && detailRows.length) {
      gsap.fromTo(
        detailRows,
        { opacity: 0, x: -18 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: eventsCard,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} id="events-section" className="relative py-12 sm:py-16 px-4">
      <div className="w-[91%] max-w-[440px] mx-auto">
        {/* Wedding Details Card */}
        <div className="wedding-card relative px-5 py-7 sm:px-8 sm:py-8 overflow-visible">
          {/* Decorative floral accent (bottom-right corner) */}
          <div className="absolute -bottom-5 -right-5 sm:-bottom-6 sm:-right-6 w-20 sm:w-24 pointer-events-none select-none z-10">
            <img src="/assets/images/floral_right.png" alt="" className="w-full opacity-50 drop-shadow-sm" />
          </div>

          {/* Card Header */}
          <div className="text-center mb-5 sm:mb-6">
            <h2 className="font-cinzel text-[15px] sm:text-[17px] text-[#4a181d] font-bold tracking-[0.14em] uppercase">
              Wedding Details
            </h2>
            <div className="flex items-center justify-center gap-2 w-28 sm:w-32 mx-auto mt-1.5">
              <span className="h-[1px] bg-[#c4908a]/50 flex-1"></span>
              <span className="text-[#9e4751] text-[7px]">◆</span>
              <span className="h-[1px] bg-[#c4908a]/50 flex-1"></span>
            </div>
          </div>

          {/* Detail Rows */}
          <div className="relative z-[5]">
            {/* Row: Nikah Date */}
            <div className="detail-row flex items-start gap-3.5 pb-4">
              <div className="w-9 h-9 rounded-full bg-[#faece3] border border-[#edd4c5] flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-[#882937]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-cinzel text-[11px] sm:text-[11px] text-[#6b2230] font-bold uppercase tracking-[0.12em] leading-tight">
                  Nikah Date
                </h4>
                <p className="font-sans text-[13px] sm:text-sm text-[#4a2028] mt-0.5 leading-snug">
                  12th December 2026, Saturday
                </p>
              </div>
            </div>
            <div className="border-b border-[#ebd3c5]/70 ml-[52px]"></div>

            {/* Row: Hijri Date */}
            <div className="detail-row flex items-start gap-3.5 py-4">
              <div className="w-9 h-9 rounded-full bg-[#faece3] border border-[#edd4c5] flex items-center justify-center shrink-0 mt-0.5">
                <Moon className="w-4 h-4 text-[#882937]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-cinzel text-[11px] sm:text-[11px] text-[#6b2230] font-bold uppercase tracking-[0.12em] leading-tight">
                  Hijri Date
                </h4>
                <p className="font-sans text-[13px] sm:text-sm text-[#4a2028] mt-0.5 leading-snug">
                  20 Jumada Al-Akhir 1448
                </p>
              </div>
            </div>
            <div className="border-b border-[#ebd3c5]/70 ml-[52px]"></div>

            {/* Row: Nikah Time */}
            <div className="detail-row flex items-start gap-3.5 py-4">
              <div className="w-9 h-9 rounded-full bg-[#faece3] border border-[#edd4c5] flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-[#882937]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-cinzel text-[11px] sm:text-[11px] text-[#6b2230] font-bold uppercase tracking-[0.12em] leading-tight">
                  Nikah Time
                </h4>
                <p className="font-sans text-[13px] sm:text-sm text-[#4a2028] mt-0.5 leading-snug">
                  11:00 AM
                </p>
              </div>
            </div>
            <div className="border-b border-[#ebd3c5]/70 ml-[52px]"></div>

            {/* Row: Lunch */}
            <div className="detail-row flex items-start gap-3.5 py-4">
              <div className="w-9 h-9 rounded-full bg-[#faece3] border border-[#edd4c5] flex items-center justify-center shrink-0 mt-0.5">
                <Utensils className="w-4 h-4 text-[#882937]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-cinzel text-[11px] sm:text-[11px] text-[#6b2230] font-bold uppercase tracking-[0.12em] leading-tight">
                  Lunch
                </h4>
                <p className="font-sans text-[13px] sm:text-sm text-[#4a2028] mt-0.5 leading-snug">
                  After Nikah · Till 2:00 PM
                </p>
              </div>
            </div>
            <div className="border-b border-[#ebd3c5]/70 ml-[52px]"></div>

            {/* Row: Venue */}
            <div className="detail-row flex items-start gap-3.5 pt-4 pb-1">
              <div className="w-9 h-9 rounded-full bg-[#faece3] border border-[#edd4c5] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-[#882937]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-cinzel text-[11px] sm:text-[11px] text-[#6b2230] font-bold uppercase tracking-[0.12em] leading-tight">
                  Venue
                </h4>
                <p className="font-sans text-[13px] sm:text-sm text-[#4a2028] mt-0.5 leading-snug">
                  Royal Heritage Palace
                  <br />
                  Royal Courtyard &amp; Mandapam,
                  <br />
                  Lake Palace Road, Heritage District
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message (outside card) */}
        <div className="mt-5 sm:mt-6 text-center">
          <p className="font-cinzel text-[11.5px] sm:text-xs text-[#882937] font-bold uppercase tracking-[0.2em]">
            Kindly be seated by 11:00 AM
          </p>
        </div>
      </div>
    </section>
  );
}
