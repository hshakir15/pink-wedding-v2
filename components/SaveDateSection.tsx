'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CalendarPlus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FLORAL_SPRITES = [
  '/assets/images/floating_petals/petal_1.png',
  '/assets/images/floating_petals/petal_2.png',
  '/assets/images/floating_petals/petal_3.png',
  '/assets/images/floating_petals/petal_4.png',
  '/assets/images/floating_petals/blossom_1.png',
  '/assets/images/floating_petals/blossom_2.png',
  '/assets/images/floating_petals/blossom_3.png',
  '/assets/images/floating_petals/rosebud_1.png',
  '/assets/images/floating_petals/rosebud_2.png',
  '/assets/images/floating_petals/leaf_1.png',
  '/assets/images/floating_petals/leaf_2.png',
  '/assets/images/floating_petals/leaf_3.png',
];

export default function SaveDateSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const blastCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const isRevealedRef = useRef(false);
  const isDrawingRef = useRef(false);
  const hasStartedScratchingRef = useRef(false);
  const strokeCountRef = useRef(0);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const handIconCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const blastAnimationIdRef = useRef<number | null>(null);
  const checkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastCheckTimeRef = useRef<number>(0);

  // Preload floral explosion sprite images & 3D metallic hand icon on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Preload floral explosion sprites
    const images: HTMLImageElement[] = [];
    FLORAL_SPRITES.forEach((src) => {
      const img = new Image();
      img.src = src;
      images.push(img);
    });
    preloadedImagesRef.current = images;

    // 2. Preload & process gold 3D metallic hand icon (convert white background to transparent)
    const handImg = new Image();
    handImg.src = '/assets/images/scratch_hand.png';
    handImg.onload = () => {
      try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = handImg.naturalWidth || 512;
        offCanvas.height = handImg.naturalHeight || 512;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(handImg, 0, 0);
          const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 235 && g > 235 && b > 235) {
              const brightness = (r + g + b) / 3;
              if (brightness >= 248) {
                data[i + 3] = 0;
              } else {
                const factor = (248 - brightness) / 13;
                data[i + 3] = Math.round(data[i + 3] * factor);
              }
            }
          }
          offCtx.putImageData(imgData, 0, 0);
          handIconCanvasRef.current = offCanvas;
          if (!hasStartedScratchingRef.current && !isRevealedRef.current) {
            renderFoilSurface();
          }
        }
      } catch {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = handImg.naturalWidth;
        offCanvas.height = handImg.naturalHeight;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.drawImage(handImg, 0, 0);
          handIconCanvasRef.current = offCanvas;
        }
      }
    };
  }, []);

  // Initial GSAP scroll trigger for card section
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const card = cardContainerRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 28, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
      }
    );
  }, []);

  // Vector drawing helper: 4-pointed sparkle star
  const drawSparkleStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    outerR: number,
    innerR: number,
    color: string
  ) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // Vector drawing helper: Top Star Divider (—— ✦ ——)
  const drawStarDivider = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    lineWidth: number = 60
  ) => {
    ctx.save();
    ctx.lineWidth = 1;

    const leftGrad = ctx.createLinearGradient(cx - lineWidth, cy, cx - 12, cy);
    leftGrad.addColorStop(0, 'rgba(184, 134, 11, 0)');
    leftGrad.addColorStop(1, 'rgba(184, 134, 11, 0.7)');
    ctx.strokeStyle = leftGrad;
    ctx.beginPath();
    ctx.moveTo(cx - lineWidth, cy);
    ctx.lineTo(cx - 12, cy);
    ctx.stroke();

    const rightGrad = ctx.createLinearGradient(cx + 12, cy, cx + lineWidth, cy);
    rightGrad.addColorStop(0, 'rgba(184, 134, 11, 0.7)');
    rightGrad.addColorStop(1, 'rgba(184, 134, 11, 0)');
    ctx.strokeStyle = rightGrad;
    ctx.beginPath();
    ctx.moveTo(cx + 12, cy);
    ctx.lineTo(cx + lineWidth, cy);
    ctx.stroke();

    drawSparkleStar(ctx, cx, cy, 6.5, 2, '#b8860b');

    ctx.restore();
  };

  // Helper to render letter-spaced text on canvas
  const drawTrackedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    letterSpacing: number
  ) => {
    const characters = text.split('');
    const totalWidths = characters.map((c) => ctx.measureText(c).width);
    const totalStringWidth =
      totalWidths.reduce((a, b) => a + b, 0) + (characters.length - 1) * letterSpacing;
    let currentX = x - totalStringWidth / 2;

    for (let i = 0; i < characters.length; i++) {
      ctx.fillText(characters[i], currentX + totalWidths[i] / 2, y);
      currentX += totalWidths[i] + letterSpacing;
    }
  };

  // Render Scratch Foil Surface Canvas
  const renderFoilSurface = useCallback(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas || isRevealedRef.current || hasStartedScratchingRef.current) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const isMobile = width < 640;

    // Background gradient matching wedding card
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#fffaf5');
    bgGradient.addColorStop(0.5, '#fef3ea');
    bgGradient.addColorStop(1, '#fdeade');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Gold Micro-Fleck Shimmer
    const fleckCount = isMobile ? 140 : 220;
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < fleckCount; i++) {
      const fx = pseudoRandom() * width;
      const fy = pseudoRandom() * height;
      const fr = 0.7 + pseudoRandom() * 1.5;
      const alpha = 0.06 + pseudoRandom() * 0.07;
      ctx.fillStyle = `rgba(212, 175, 55, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(fx, fy, fr, 0, Math.PI * 2);
      ctx.fill();
    }

    const cx = width / 2;
    const cy = height / 2;

    // Top Star Divider
    const dividerY = isMobile ? cy - 60 : cy - 70;
    drawStarDivider(ctx, cx, dividerY, isMobile ? 50 : 70);

    // Heading: "SCRATCH TO REVEAL"
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const headingFontSize = isMobile ? 14.5 : 17.5;
    ctx.font = `700 ${headingFontSize}px Cinzel, serif`;
    ctx.fillStyle = '#6b1d28';
    const headingY = isMobile ? cy - 30 : cy - 34;
    drawTrackedText(
      ctx,
      'SCRATCH TO REVEAL',
      cx,
      headingY,
      isMobile ? 3.6 : 4.8
    );

    // Gold 3D Metallic Touch Pointer Hand Icon
    const handSize = isMobile ? 56 : 66;
    const handY = isMobile ? cy + 20 : cy + 24;

    if (handIconCanvasRef.current) {
      ctx.drawImage(
        handIconCanvasRef.current,
        cx - handSize / 2,
        handY - handSize / 2,
        handSize,
        handSize
      );
    }

    // Sub-Hint
    const subFontSize = isMobile ? 15 : 17.5;
    ctx.font = `italic 600 ${subFontSize}px 'Cormorant Garamond', Georgia, serif`;
    ctx.fillStyle = '#a07429';
    const subY = isMobile ? cy + 68 : cy + 78;
    ctx.fillText('Save Our Special Date', cx, subY);

    ctx.restore();
  }, []);

  // High-performance single-readback completion check
  const checkCompletion = useCallback(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas || isRevealedRef.current) return;

    if (!checkCanvasRef.current) {
      const c = document.createElement('canvas');
      c.width = 12;
      c.height = 8;
      checkCanvasRef.current = c;
    }

    const checkCanvas = checkCanvasRef.current;
    const checkCtx = checkCanvas.getContext('2d', { willReadFrequently: true });
    if (!checkCtx) return;

    checkCtx.clearRect(0, 0, 12, 8);
    checkCtx.drawImage(canvas, 0, 0, 12, 8);

    const data = checkCtx.getImageData(0, 0, 12, 8).data;
    let clearedCount = 0;
    const totalSamples = 96;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) {
        clearedCount++;
      }
    }

    const clearedPercentage = (clearedCount / totalSamples) * 100;
    const isMobile = window.innerWidth < 640;
    const strokeCount = strokeCountRef.current;

    const isComplete = isMobile
      ? clearedPercentage >= 58 || (clearedPercentage >= 42 && strokeCount > 50)
      : clearedPercentage >= 52 || (clearedPercentage >= 35 && strokeCount > 40);

    if (isComplete) {
      triggerReveal();
    }
  }, []);

  const scheduleCheckCompletion = useCallback(() => {
    const now = performance.now();
    if (now - lastCheckTimeRef.current > 200) {
      lastCheckTimeRef.current = now;
      checkCompletion();
    }
  }, [checkCompletion]);

  // Cinematic 5.0s Physics Celebration Floral Explosion
  const launchFloralExplosion = (cardRect: DOMRect) => {
    const blastCanvas = blastCanvasRef.current;
    if (!blastCanvas || typeof window === 'undefined') return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    blastCanvas.width = Math.round(window.innerWidth * dpr);
    blastCanvas.height = Math.round(window.innerHeight * dpr);

    const ctx = blastCanvas.getContext('2d');
    if (!ctx) return;

    const originX = cardRect.left + cardRect.width / 2;
    const originY = cardRect.top + cardRect.height / 2;

    const isMobile = window.innerWidth < 640;
    const botanicalCount = isMobile ? 45 : 70;
    const glitterCount = isMobile ? 100 : 180;

    const availableSprites =
      preloadedImagesRef.current.filter((img) => img.complete && img.naturalWidth > 0);

    interface ExplosionParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      gravity: number;
      drag: number;
      rotation: number;
      rotSpeed: number;
      flipPhase: number;
      flipSpeed: number;
      swayFreq: number;
      swayAmp: number;
      swayPhase: number;
      size: number;
      type: 'botanical' | 'star' | 'glitter' | 'ribbon';
      color: string;
      sprite?: HTMLImageElement;
      maxAlpha: number;
    }

    const particles: ExplosionParticle[] = [];

    // 1. Botanical Particles
    for (let i = 0; i < botanicalCount; i++) {
      const angle = (Math.PI * 2 * i) / botanicalCount + (Math.random() - 0.5) * 0.4;
      const speed = isMobile ? 7 + Math.random() * 15 : 9 + Math.random() * 22;
      const upwardBias = -2.5 - Math.random() * 4.5;

      const sprite =
        availableSprites.length > 0
          ? availableSprites[Math.floor(Math.random() * availableSprites.length)]
          : undefined;

      particles.push({
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + upwardBias,
        gravity: 0.16 + Math.random() * 0.12,
        drag: 0.968 + Math.random() * 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.09,
        flipPhase: Math.random() * Math.PI * 2,
        flipSpeed: 0.03 + Math.random() * 0.05,
        swayFreq: 0.003 + Math.random() * 0.004,
        swayAmp: 1.5 + Math.random() * 2.5,
        swayPhase: Math.random() * Math.PI * 2,
        size: isMobile ? 18 + Math.random() * 14 : 22 + Math.random() * 18,
        type: 'botanical',
        color: '#ffffff',
        sprite,
        maxAlpha: 0.85 + Math.random() * 0.15,
      });
    }

    // 2. Gold Shimmer Particles
    const goldColors = ['#d4af37', '#ffd700', '#f4e0a5', '#ffffff', '#b8860b', '#e6b84f'];
    for (let i = 0; i < glitterCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isMobile ? 8 + Math.random() * 16 : 10 + Math.random() * 26;
      const upwardBias = -3.0 - Math.random() * 6.0;

      const pTypeRoll = Math.random();
      const pType: 'star' | 'glitter' | 'ribbon' =
        pTypeRoll < 0.35 ? 'star' : pTypeRoll < 0.7 ? 'glitter' : 'ribbon';

      particles.push({
        x: originX + (Math.random() - 0.5) * 30,
        y: originY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + upwardBias,
        gravity: 0.22 + Math.random() * 0.14,
        drag: 0.962 + Math.random() * 0.018,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        flipPhase: Math.random() * Math.PI * 2,
        flipSpeed: 0.05 + Math.random() * 0.08,
        swayFreq: 0.004 + Math.random() * 0.005,
        swayAmp: 1.8 + Math.random() * 3.0,
        swayPhase: Math.random() * Math.PI * 2,
        size: isMobile ? 4 + Math.random() * 6 : 5 + Math.random() * 9,
        type: pType,
        color: goldColors[Math.floor(Math.random() * goldColors.length)],
        maxAlpha: 0.9 + Math.random() * 0.1,
      });
    }

    const startTime = performance.now();
    const DURATION = 5000;

    const renderLoop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION);

      ctx.clearRect(0, 0, blastCanvas.width, blastCanvas.height);

      ctx.save();
      ctx.scale(dpr, dpr);

      let globalFade = 1.0;
      if (progress > 0.65) {
        const fadeProgress = (progress - 0.65) / 0.35;
        globalFade = Math.max(0, 1 - fadeProgress * fadeProgress);
      }

      particles.forEach((p) => {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;

        const currentSway = Math.sin(elapsed * p.swayFreq + p.swayPhase) * p.swayAmp;
        p.x += p.vx + currentSway;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        const alpha = p.maxAlpha * globalFade;
        if (alpha <= 0.005) return;

        const scaleX = Math.cos(elapsed * p.flipSpeed + p.flipPhase);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(scaleX, 1);
        ctx.globalAlpha = alpha;

        if (p.type === 'botanical' && p.sprite) {
          ctx.drawImage(
            p.sprite,
            -p.size / 2,
            -p.size / 2,
            p.size,
            p.size
          );
        } else if (p.type === 'star') {
          drawSparkleStar(ctx, 0, 0, p.size, p.size * 0.35, p.color);
        } else if (p.type === 'ribbon') {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size, -p.size * 0.35, p.size * 2, p.size * 0.7);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      ctx.restore();

      if (progress < 1) {
        blastAnimationIdRef.current = requestAnimationFrame(renderLoop);
      } else {
        ctx.clearRect(0, 0, blastCanvas.width, blastCanvas.height);
        blastAnimationIdRef.current = null;
      }
    };

    blastAnimationIdRef.current = requestAnimationFrame(renderLoop);
  };

  // Trigger Reveal
  const triggerReveal = () => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);

    const canvas = scratchCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.style.display = 'none';
    }

    const textContainer = textContainerRef.current;
    if (textContainer && textContainer.children.length > 0) {
      gsap.fromTo(
        textContainer.children,
        { opacity: 0, y: 14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.3, stagger: 0.1, ease: 'power2.out' }
      );
    }

    if (cardContainerRef.current) {
      const rect = cardContainerRef.current.getBoundingClientRect();
      launchFloralExplosion(rect);
    }
  };

  // Erasing Logic
  const eraseLine = (fromX: number, fromY: number, toX: number, toY: number) => {
    const canvas = scratchCanvasRef.current;
    if (!canvas || isRevealedRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 640;
    const baseRadius = isMobile ? 24 : 30;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const brushRadius = baseRadius * dpr;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushRadius * 2;

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(toX, toY, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Coordinate helper
  const getCoords = (clientX: number, clientY: number) => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // High-performance Native Touch & Pointer Listeners
  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;

    const handleStart = (clientX: number, clientY: number) => {
      if (isRevealedRef.current) return;
      isDrawingRef.current = true;
      hasStartedScratchingRef.current = true;
      const coords = getCoords(clientX, clientY);
      lastPointRef.current = coords;
      eraseLine(coords.x, coords.y, coords.x, coords.y);
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!isDrawingRef.current || isRevealedRef.current) return;
      const coords = getCoords(clientX, clientY);
      if (lastPointRef.current) {
        eraseLine(lastPointRef.current.x, lastPointRef.current.y, coords.x, coords.y);
      }
      lastPointRef.current = coords;
      strokeCountRef.current += 1;
      scheduleCheckCompletion();
    };

    const handleEnd = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      lastPointRef.current = null;
      checkCompletion();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    };

    const onMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      handleEnd();
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);

      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [scheduleCheckCompletion, checkCompletion]);

  // Mount, resize, and font ready handlers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeout = setTimeout(() => {
      renderFoilSurface();
    }, 50);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!hasStartedScratchingRef.current && !isRevealedRef.current) {
          renderFoilSurface();
        }
      });
    }

    const handleResize = () => {
      if (!hasStartedScratchingRef.current && !isRevealedRef.current) {
        renderFoilSurface();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
      if (blastAnimationIdRef.current) {
        cancelAnimationFrame(blastAnimationIdRef.current);
      }
    };
  }, [renderFoilSurface]);

  // Calendar auto-detect helper
  const isAppleDevice = () => {
    if (typeof navigator === 'undefined') return false;
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    const platform = navigator.platform || '';
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1);
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(platform) || /Mac OS X/.test(userAgent);

    return isIOS || isMac;
  };

  const handleAddToCalendar = () => {
    if (isAppleDevice()) {
      downloadICS();
    } else {
      addToGoogleCalendar();
    }
  };

  const addToGoogleCalendar = () => {
    const title = encodeURIComponent('Safina & Ghalib — Nikah Ceremony');
    const details = encodeURIComponent(
      'Join us in celebrating the holy Nikah union of Safina & Ghalib at Royal Heritage Palace.'
    );
    const location = encodeURIComponent(
      'Royal Heritage Palace, Lake Palace Road, Udaipur, Rajasthan'
    );
    const dates = '20261212T053000Z/20261212T160000Z';

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const downloadICS = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Safina & Ghalib Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:safina-ghalib-nikah-20261212@weddinginvitation',
      'DTSTAMP:20261212T000000Z',
      'SUMMARY:Safina & Ghalib — Nikah Ceremony',
      'DESCRIPTION:Join us for the holy Nikah ceremony of Safina & Ghalib at Royal Heritage Palace.',
      'LOCATION:Royal Heritage Palace, Lake Palace Road, Udaipur, Rajasthan',
      'DTSTART:20261212T053000Z',
      'DTEND:20261212T160000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Safina-Ghalib-Nikah.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      try {
        window.URL.revokeObjectURL(link.href);
      } catch {}
    }, 1500);
  };

  return (
    <section ref={sectionRef} id="save-date-section" className="relative py-12 sm:py-16 px-4">
      <div className="w-[94%] max-w-[480px] sm:max-w-[530px] mx-auto">
        {/* Luxury Clean Card Container matching other cards with no inner border */}
        <div
          ref={cardContainerRef}
          className="wedding-card relative overflow-hidden px-5 py-7 sm:px-8 sm:py-9 text-center select-none [transform:translate3d(0,0,0)] [backface-visibility:hidden]"
        >
          {/* Full-coverage Absolute Scratch Surface Canvas Overlay */}
          {!isRevealed && (
            <canvas
              id="scratch-canvas"
              ref={scratchCanvasRef}
              style={{ touchAction: 'none' }}
              className="absolute inset-0 w-full h-full z-20 cursor-pointer touch-none select-none rounded-[28px] sm:rounded-[34px] [transform:translate3d(0,0,0)]"
            />
          )}

          {/* Underneath Wedding Date Content */}
          <div
            ref={textContainerRef}
            className="relative z-10 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[240px] [transform:translate3d(0,0,0)] [backface-visibility:hidden] [text-rendering:geometricPrecision] [webkit-font-smoothing:antialiased]"
          >
            {/* Line 1: Script Title */}
            <span className="text-[#b8860b] font-script text-3xl sm:text-4xl md:text-[42px] block mb-1 leading-tight select-none [transform:translate3d(0,0,0)]">
              Save Our Special Date
            </span>

            {/* Line 2: Single Line Grand Date */}
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-[28px] text-[#3d0e16] uppercase tracking-[0.16em] sm:tracking-[0.22em] font-bold mt-1 mb-2.5 whitespace-nowrap select-none [transform:translate3d(0,0,0)]">
              DECEMBER 12, 2026
            </h2>

            {/* Line 3: Subtle Gold Accent Point */}
            <div className="flex items-center justify-center my-2 text-[#b8860b] text-[8px] sm:text-[9px] select-none [transform:translate3d(0,0,0)]">
              ✦
            </div>

            {/* Line 4: Barakallahu Lakuma */}
            <p className="font-serif italic text-base sm:text-lg text-[#7a2835] mb-1.5 select-none [transform:translate3d(0,0,0)]">
              Barakallahu Lakuma
            </p>

            {/* Line 5: Blessing Text */}
            <p className="font-serif text-[13px] sm:text-[14.5px] text-[#5c242b] leading-relaxed max-w-[340px] sm:max-w-[380px] mx-auto mb-6 select-none [transform:translate3d(0,0,0)]">
              May Allah bless you, and shower His blessings upon you, and unite you both in goodness.
            </p>

            {/* Line 6: Add to Calendar Button */}
            <div className="flex items-center justify-center [transform:translate3d(0,0,0)]">
              <button
                onClick={handleAddToCalendar}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white/95 border border-[#d4af37] text-[#3d0e16] font-cinzel text-xs sm:text-[12.5px] tracking-[0.16em] font-semibold hover:bg-[#b8860b] hover:text-white active:scale-95 transition-all duration-300 shadow-[0_4px_16px_rgba(180,120,80,0.1)]"
              >
                <CalendarPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#b8860b]" />
                ADD TO CALENDAR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Fixed Particle Canvas for 5.0s Celebration Explosion */}
      <canvas
        id="scratch-blast-canvas"
        ref={blastCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-[60]"
        aria-hidden="true"
      />
    </section>
  );
}
