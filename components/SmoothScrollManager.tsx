'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollManagerProps {
  isUnlocked: boolean;
}

export default function SmoothScrollManager({ isUnlocked }: SmoothScrollManagerProps) {
  const lenisRef = useRef<Lenis | null>(null);

  // Force scroll to top (0, 0) on page load/refresh & disable browser scroll restoration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const resetToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetToTop();
    requestAnimationFrame(resetToTop);
    const timeout = setTimeout(resetToTop, 50);

    window.addEventListener('beforeunload', resetToTop);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('beforeunload', resetToTop);
    };
  }, []);

  // Strict scroll lock when not unlocked (blocks touch swipe, mouse wheel, keyboard scroll)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isUnlocked) {
      document.documentElement.classList.add('scroll-locked');
      document.body.classList.add('scroll-locked');

      const preventTouchMove = (e: TouchEvent) => {
        // Allow interaction only if target is within a dedicated scrollable widget if any
        e.preventDefault();
      };

      const preventWheel = (e: WheelEvent) => {
        e.preventDefault();
      };

      const preventKeys = (e: KeyboardEvent) => {
        const blockedKeys = [
          'Space',
          'PageUp',
          'PageDown',
          'End',
          'Home',
          'ArrowUp',
          'ArrowDown',
        ];
        if (
          blockedKeys.includes(e.code) ||
          [32, 33, 34, 35, 36, 38, 40].includes(e.keyCode)
        ) {
          e.preventDefault();
        }
      };

      window.addEventListener('touchmove', preventTouchMove, { passive: false });
      window.addEventListener('wheel', preventWheel, { passive: false });
      window.addEventListener('keydown', preventKeys, { capture: true });

      if (lenisRef.current) {
        lenisRef.current.stop();
      }

      return () => {
        window.removeEventListener('touchmove', preventTouchMove);
        window.removeEventListener('wheel', preventWheel);
        window.removeEventListener('keydown', preventKeys, { capture: true });
      };
    } else {
      document.documentElement.classList.remove('scroll-locked');
      document.body.classList.remove('scroll-locked');
      if (lenisRef.current) {
        lenisRef.current.start();
        lenisRef.current.resize();
      }
    }
  }, [isUnlocked]);

  // Lenis initialization for smooth desktop wheel scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const isMobileOrTouch = () => {
      return (
        window.innerWidth <= 1024 ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
      );
    };

    const initLenis = () => {
      if (isMobileOrTouch()) {
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
        document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
        document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
        return;
      }

      lenisRef.current = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        syncTouch: false,
        touchMultiplier: 0,
        infinite: false,
      });

      lenisRef.current.on('scroll', () => {
        ScrollTrigger.update();
      });

      gsap.ticker.add((time) => {
        if (lenisRef.current) {
          lenisRef.current.raf(time * 1000);
        }
      });
      gsap.ticker.lagSmoothing(0);

      if (!isUnlocked && lenisRef.current) {
        lenisRef.current.stop();
      }
    };

    initLenis();

    const handleResize = () => {
      if (isMobileOrTouch()) {
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
          document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
          document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
        }
      } else if (!lenisRef.current) {
        initLenis();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [isUnlocked]);

  return null;
}
