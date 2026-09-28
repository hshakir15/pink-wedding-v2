'use client';

import React, { useEffect, useRef } from 'react';

interface FloralParticlesProps {
  active?: boolean;
}

export default function FloralParticles({ active = false }: FloralParticlesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const sprites = [
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

    const isMobile = window.innerWidth < 768;
    const maxParticles = isMobile ? 4 : 5;

    let particles: WindParticle[] = [];
    let animationFrameId: number | null = null;
    let isCleanedUp = false;

    class WindParticle {
      el: HTMLImageElement;
      active: boolean = false;
      opacity: number = 0;
      currentX: number = -200;
      currentY: number = -200;
      size: number = 20;
      depth: 'foreground' | 'midground' | 'background' = 'midground';
      speedMultiplier: number = 1;
      maxOpacity: number = 0.6;
      duration: number = 25000;
      startTime: number = 0;
      startX: number = 0;
      endX: number = 0;
      yBaseStart: number = 0;
      yBaseEnd: number = 0;
      waveAmp1: number = 30;
      waveAmp2: number = 15;
      waveFreq1: number = Math.PI;
      waveFreq2: number = Math.PI * 2;
      wavePhase1: number = 0;
      wavePhase2: number = 0;
      wobbleFreq: number = 0.002;
      wobbleAmp: number = 3;
      rotStart: number = 0;
      rotTotal: number = 90;

      targetImpulseX: number = 0;
      targetImpulseY: number = 0;
      targetImpulseRot: number = 0;
      impulseDuration: number = 900;
      impulseStartTime: number = 0;
      isImpulsed: boolean = false;

      constructor() {
        this.el = document.createElement('img');
        this.el.className = 'floral-particle';
        this.el.alt = '';
        this.el.setAttribute('aria-hidden', 'true');

        const triggerReaction = (clientX: number, clientY: number, isHover = false) => {
          if (!this.active || this.opacity < 0.15) return;

          const pCenterX = this.currentX + this.size / 2;
          const pCenterY = this.currentY + this.size / 2;

          let dx = pCenterX - clientX;
          let dy = pCenterY - clientY;

          if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            const windDir = this.endX > this.startX ? 1 : -1;
            dx = windDir * 35;
            dy = -25;
          }

          const dist = Math.hypot(dx, dy) || 1;
          const nx = dx / dist;
          const ny = dy / dist;

          const force = isHover ? 25 + Math.random() * 15 : 48 + Math.random() * 26;

          this.targetImpulseX = nx * force;
          this.targetImpulseY = ny * (force * 0.75) - (12 + Math.random() * 14);
          this.targetImpulseRot = (Math.random() - 0.5) * (isHover ? 45 : 85);
          this.impulseDuration = 800 + Math.random() * 350;
          this.impulseStartTime = performance.now();
          this.isImpulsed = true;
        };

        this.el.addEventListener(
          'pointerdown',
          (e: PointerEvent) => {
            e.stopPropagation();
            triggerReaction(e.clientX, e.clientY, false);
          },
          { passive: false }
        );

        this.el.addEventListener('mouseenter', (e: MouseEvent) => {
          if (e.buttons === 0 && !this.isImpulsed) {
            triggerReaction(e.clientX, e.clientY, true);
          }
        });

        if (container) {
          container.appendChild(this.el);
        }
      }

      spawnJourney(currentTime: number) {
        if (isCleanedUp) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMob = vw < 768;

        this.el.src = sprites[Math.floor(Math.random() * sprites.length)];

        const depthRoll = Math.random();
        if (depthRoll < 0.28) {
          this.depth = 'foreground';
        } else if (depthRoll < 0.74) {
          this.depth = 'midground';
        } else {
          this.depth = 'background';
        }

        if (isMob) {
          if (this.depth === 'foreground') {
            this.size = 28 + Math.random() * 6;
            this.maxOpacity = 0.68 + Math.random() * 0.2;
            this.speedMultiplier = 1.08;
            this.el.style.zIndex = '28';
          } else if (this.depth === 'midground') {
            this.size = 21 + Math.random() * 5;
            this.maxOpacity = 0.54 + Math.random() * 0.2;
            this.speedMultiplier = 1.0;
            this.el.style.zIndex = '26';
          } else {
            this.size = 15 + Math.random() * 3.5;
            this.maxOpacity = 0.4 + Math.random() * 0.16;
            this.speedMultiplier = 0.92;
            this.el.style.zIndex = '24';
          }
        } else {
          if (this.depth === 'foreground') {
            this.size = 20 + Math.random() * 4;
            this.maxOpacity = 0.6 + Math.random() * 0.18;
            this.speedMultiplier = 1.05;
            this.el.style.zIndex = '28';
          } else if (this.depth === 'midground') {
            this.size = 16 + Math.random() * 3.5;
            this.maxOpacity = 0.5 + Math.random() * 0.18;
            this.speedMultiplier = 1.0;
            this.el.style.zIndex = '26';
          } else {
            this.size = 13 + Math.random() * 2.5;
            this.maxOpacity = 0.42 + Math.random() * 0.16;
            this.speedMultiplier = 0.94;
            this.el.style.zIndex = '24';
          }
        }

        this.el.style.width = `${this.size.toFixed(1)}px`;
        this.el.style.height = 'auto';

        this.isImpulsed = false;
        this.duration = ((20 + Math.random() * 12) * 1000) / (this.speedMultiplier || 1);
        this.startTime = currentTime || performance.now();

        const flowType = Math.random();

        if (flowType < 0.48) {
          this.startX = -40 - Math.random() * 40;
          this.endX = vw + 40 + Math.random() * 40;
          this.yBaseStart = vh * (0.15 + Math.random() * 0.7);
          this.yBaseEnd = this.yBaseStart + (Math.random() - 0.5) * (vh * 0.28);
        } else if (flowType < 0.9) {
          this.startX = vw + 40 + Math.random() * 40;
          this.endX = -40 - Math.random() * 40;
          this.yBaseStart = vh * (0.15 + Math.random() * 0.7);
          this.yBaseEnd = this.yBaseStart + (Math.random() - 0.5) * (vh * 0.28);
        } else {
          const fromLeft = Math.random() < 0.5;
          if (fromLeft) {
            this.startX = -40 - Math.random() * 30;
            this.endX = vw + 40 + Math.random() * 40;
            this.yBaseStart = -15 - Math.random() * 25;
            this.yBaseEnd = vh * (0.3 + Math.random() * 0.5);
          } else {
            this.startX = vw + 40 + Math.random() * 30;
            this.endX = -40 - Math.random() * 40;
            this.yBaseStart = -15 - Math.random() * 25;
            this.yBaseEnd = vh * (0.3 + Math.random() * 0.5);
          }
        }

        this.waveAmp1 = (isMob ? 20 : 35) + Math.random() * (isMob ? 25 : 45);
        this.waveAmp2 = 12 + Math.random() * 20;
        this.waveFreq1 = (1 + Math.floor(Math.random() * 2)) * Math.PI;
        this.waveFreq2 = (2 + Math.floor(Math.random() * 2)) * Math.PI;
        this.wavePhase1 = Math.random() * Math.PI * 2;
        this.wavePhase2 = Math.random() * Math.PI * 2;

        this.wobbleFreq = 0.002 + Math.random() * 0.002;
        this.wobbleAmp = 2.5 + Math.random() * 2.5;

        this.rotStart = Math.random() * 360;
        this.rotTotal = (Math.random() - 0.5) * 140;

        this.opacity = 0;
        this.el.style.opacity = '0';
        this.el.style.transform = `translate3d(${this.startX.toFixed(1)}px, ${this.yBaseStart.toFixed(1)}px, 0)`;
        this.active = true;
      }

      update(now: number) {
        if (!this.active || isCleanedUp) return;

        const elapsed = now - this.startTime;
        const progress = Math.min(1, Math.max(0, elapsed / this.duration));

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const rawX = this.startX + progress * (this.endX - this.startX);
        const baseProgY = this.yBaseStart + progress * (this.yBaseEnd - this.yBaseStart);
        const curve =
          Math.sin(progress * this.waveFreq1 + this.wavePhase1) * this.waveAmp1 +
          Math.cos(progress * this.waveFreq2 + this.wavePhase2) * this.waveAmp2;
        const wobbleY = Math.sin(now * this.wobbleFreq) * this.wobbleAmp;

        const rawY = baseProgY + curve + wobbleY;
        const rawRot = this.rotStart + progress * this.rotTotal + Math.sin(now * 0.0015) * 8;

        let impX = 0;
        let impY = 0;
        let impRot = 0;

        if (this.isImpulsed) {
          const impElapsed = now - this.impulseStartTime;
          const impProg = impElapsed / this.impulseDuration;

          if (impProg >= 1) {
            this.isImpulsed = false;
          } else {
            let factor = 0;
            if (impProg < 0.22) {
              const t = impProg / 0.22;
              factor = 1 - Math.pow(1 - t, 3);
            } else {
              const t = (impProg - 0.22) / 0.78;
              factor = Math.cos(t * Math.PI * 0.5);
            }
            impX = this.targetImpulseX * factor;
            impY = this.targetImpulseY * factor;
            impRot = this.targetImpulseRot * factor;
          }
        }

        this.currentX = rawX + impX;
        this.currentY = rawY + impY;
        const currentRot = rawRot + impRot;

        if (this.currentX < 0 || this.currentX > vw || this.currentY < 0 || this.currentY > vh) {
          this.opacity = 0;
        } else {
          const distToEdge = Math.min(this.currentX, vw - this.currentX, this.currentY, vh - this.currentY);
          const fadeFactor = Math.min(1, Math.max(0, distToEdge / 70));
          this.opacity = this.maxOpacity * fadeFactor;
        }

        this.el.style.pointerEvents = this.opacity > 0.15 ? 'auto' : 'none';
        this.el.style.transform = `translate3d(${this.currentX.toFixed(1)}px, ${this.currentY.toFixed(1)}px, 0) rotate(${currentRot.toFixed(1)}deg)`;
        this.el.style.opacity = this.opacity.toFixed(3);

        if (progress >= 1) {
          this.active = false;
          this.el.style.opacity = '0';
          this.el.style.pointerEvents = 'none';

          const pauseMs = 1500 + Math.random() * 3000;
          setTimeout(() => {
            if (!isCleanedUp) {
              this.spawnJourney(performance.now());
            }
          }, pauseMs);
        }
      }

      destroy() {
        this.active = false;
        if (this.el && this.el.parentNode) {
          this.el.parentNode.removeChild(this.el);
        }
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      const p = new WindParticle();
      particles.push(p);

      setTimeout(() => {
        if (!isCleanedUp) {
          p.spawnJourney(performance.now());
        }
      }, 500 + i * (isMobile ? 3600 : 4600));
    }

    const loop = (time: number) => {
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time);
      }
      if (!isCleanedUp) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      isCleanedUp = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      particles.forEach((p) => p.destroy());
      particles = [];
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      id="floral-particles-container"
      className="fixed inset-0 w-full h-full pointer-events-none z-25 overflow-hidden"
      aria-hidden="true"
    />
  );
}
