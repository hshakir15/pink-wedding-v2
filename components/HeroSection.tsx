'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Hand, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

interface HeroSectionProps {
  onInvitationOpen?: () => void;
}

export default function HeroSection({ onInvitationOpen }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchCueRef = useRef<HTMLDivElement | null>(null);
  const textOverlayRef = useRef<HTMLDivElement | null>(null);
  const scrollPromptRef = useRef<HTMLDivElement | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const lastHeroTapRef = useRef<number>(0);
  const revealTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    video.muted = true;
    video.volume = 0;
  }, []);

  const revealText = () => {
    if (hasRevealed) return;
    setHasRevealed(true);

    if (textOverlayRef.current) {
      textOverlayRef.current.classList.add('typography-revealed');
      textOverlayRef.current.style.pointerEvents = 'auto';
    }

    if (scrollPromptRef.current) {
      scrollPromptRef.current.style.opacity = '1';
      scrollPromptRef.current.style.pointerEvents = 'auto';
    }

    // Trigger GSAP hero typography animation
    animateHeroTypography();

    // Notify parent to start floral particles and enable full scrolling
    if (onInvitationOpen) {
      onInvitationOpen();
    }
  };

  const startPlayback = () => {
    // Start background music
    if (typeof (window as any).__playWeddingMusic === 'function') {
      (window as any).__playWeddingMusic();
    }

    if (hasStarted) return;
    setHasStarted(true);

    if (touchCueRef.current) {
      touchCueRef.current.style.opacity = '0';
      setTimeout(() => {
        if (touchCueRef.current) touchCueRef.current.style.display = 'none';
      }, 700);
    }

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().catch((err) => {
        console.log('Video playback error', err);
        video.muted = true;
        video.volume = 0;
        video.play();
      });
    }

    // 2.9-second fallback timer
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    revealTimerRef.current = setTimeout(() => {
      revealText();
    }, 2900);
  };

  const handleHeroInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('#scroll-prompt-container') ||
      target.closest('#audio-control-widget')
    ) {
      return;
    }
    const now = Date.now();
    if (now - lastHeroTapRef.current < 350) {
      return;
    }
    lastHeroTapRef.current = now;
    startPlayback();
  };

  const animateHeroTypography = () => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const overlay = textOverlayRef.current;
    if (!overlay) return;

    const elementsToAnimate = [
      overlay.querySelector('.heart-icon-wrapper'),
      overlay.querySelector('.hero-bismillah'),
      ...Array.from(overlay.querySelectorAll('.space-y-1 p')),
      ...Array.from(overlay.querySelectorAll('h1')),
      overlay.querySelector('.hero-ampersand'),
      overlay.querySelector('.nikah-invitation-text'),
      scrollPromptRef.current,
    ].filter(Boolean);

    gsap.fromTo(
      elementsToAnimate,
      {
        opacity: 0,
        y: 28,
        scale: 0.96,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.35,
        stagger: 0,
        ease: 'power3.out',
      }
    );
  };

  const scrollToCoupleSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = document.getElementById('couple-section');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      id="hero-section"
      onClick={handleHeroInteraction}
      onTouchEnd={handleHeroInteraction}
      className="relative w-full h-screen h-[100svh] min-h-[100svh] sm:h-[100dvh] sm:min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-night-950 select-none cursor-pointer"
    >
      {/* Fullscreen Video Layer - Paused at Frame 0 until user touches */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          id="invitation-video"
          playsInline
          preload="auto"
          muted
          onTimeUpdate={() => {
            if (videoRef.current && videoRef.current.currentTime >= 2.9 && !hasRevealed) {
              revealText();
            }
          }}
          onEnded={() => {
            if (videoRef.current) videoRef.current.pause();
            revealText();
          }}
          className="w-full h-full object-cover brightness-[0.96] contrast-[1.04]"
        >
          <source src="/assets/video/opening.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Tint Overlay (+10% black tint for rich contrast) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/[0.55] via-black/[0.40] to-black/[0.58] pointer-events-none"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.76)] pointer-events-none"></div>
      </div>

      {/* INITIAL TOUCH CUE BADGE (Fades out when user touches) */}
      <div
        ref={touchCueRef}
        id="touch-cue-badge"
        className="absolute z-30 inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700"
      >
        <div className="px-6 py-3 rounded-full bg-night-900/80 border border-gold-400/60 backdrop-blur-md shadow-[0_0_30px_rgba(229,169,31,0.4)] flex items-center gap-2.5 animate-pulse transform hover:scale-105">
          <Hand className="w-4 h-4 text-gold-400 animate-bounce" />
          <span className="font-cinzel text-xs sm:text-sm tracking-[0.2em] text-gold-300 uppercase font-semibold">
            Touch Screen to Open
          </span>
        </div>
      </div>

      {/* EXACT REFERENCE TYPOGRAPHY OVERLAY (Fades in after 4.0 seconds of video play) */}
      <div
        ref={textOverlayRef}
        id="reference-text-overlay"
        className="relative z-20 w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center text-center select-none transition-all duration-1000 opacity-0 transform translate-y-6 pointer-events-none overflow-visible"
      >
        {/* Top Heart Icon */}
        <div className="heart-icon-wrapper text-slate-100 text-xl sm:text-2xl mb-1 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] animate-pulse">
          🤍
        </div>

        {/* Arabic Bismillah Calligraphy (With generous top and bottom spacing) */}
        <div className="font-arabic hero-bismillah text-slate-100 font-bold filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] tracking-wide">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>

        {/* Invitation Sub-Headers */}
        <div className="space-y-1 mb-4 sm:mb-6">
          <p className="font-cinzel text-xs sm:text-sm md:text-base uppercase tracking-[0.35em] text-slate-100 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            AN INVITATION
          </p>
          <p className="font-cinzel text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.25em] text-slate-300 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            TOGETHER WITH THEIR FAMILIES
          </p>
        </div>

        {/* BRIDE NAME: SAFINA (Signature Gold Calligraphy) */}
        <div className="my-0.5 overflow-visible">
          <h1 className="font-script hero-name-single text-gold-calligraphy tracking-normal drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
            Safina
          </h1>
        </div>

        {/* AMPERSAND (&) */}
        <div className="my-0.5 overflow-visible">
          <span className="font-script hero-ampersand text-gold-calligraphy drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] inline-block">
            &
          </span>
        </div>

        {/* GROOM NAME: GHALIB (Signature Gold Calligraphy) */}
        <div className="my-0.5 overflow-visible">
          <h1 className="font-script hero-name-single text-gold-calligraphy tracking-normal drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
            Ghalib
          </h1>
        </div>

        {/* NIKAH CEREMONY INVITATION TEXT */}
        <div className="mt-4 sm:mt-6 max-w-lg mx-auto px-2">
          <p className="nikah-invitation-text font-cinzel text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.25em] text-slate-200 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-relaxed">
            REQUEST THE HONOUR OF YOUR PRESENCE AT THEIR NIKAH
          </p>
        </div>

        {/* ANIMATED BOTTOM SCROLL DOWN PROMPT */}
        <div
          ref={scrollPromptRef}
          id="scroll-prompt-container"
          className="mt-[72px] sm:mt-7 flex flex-col items-center gap-1 cursor-pointer group pointer-events-auto opacity-0 transition-opacity duration-700"
          onClick={scrollToCoupleSection}
        >
          <span className="font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase text-gold-300 font-bold group-hover:text-gold-200 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            SCROLL
          </span>
          <div className="scroll-arrow-wrapper flex flex-col items-center -space-y-2 text-gold-400">
            <ChevronDown className="w-4 h-4 animate-bounce stroke-[2.5]" />
            <ChevronDown className="w-4 h-4 animate-bounce stroke-[2.5]" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </header>
  );
}
