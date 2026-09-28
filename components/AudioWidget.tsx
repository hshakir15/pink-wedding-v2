'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Music } from 'lucide-react';

export default function AudioWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastToggleRef = useRef<number>(0);
  const userMutedRef = useRef<boolean>(false);
  const hasUnlockedRef = useRef<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 1.0;

    const handleEnded = () => {
      if (userMutedRef.current) return;
      audio.currentTime = 0;
      audio.play().catch((err) => console.log('Repeat play error:', err));
    };
    audio.addEventListener('ended', handleEnded);

    // One-time interaction unlock listener (only runs before user explicitly chooses mute/play)
    const unlockHandler = () => {
      if (hasUnlockedRef.current || userMutedRef.current) {
        removeUnlock();
        return;
      }
      if (audio && audio.paused) {
        audio.muted = false;
        audio.volume = 1.0;
        const p = audio.play();
        if (p !== undefined) {
          p.then(() => {
            hasUnlockedRef.current = true;
            setIsPlaying(true);
            removeUnlock();
          }).catch(() => {});
        }
      }
    };

    const removeUnlock = () => {
      document.removeEventListener('click', unlockHandler, true);
      document.removeEventListener('touchend', unlockHandler, true);
      document.removeEventListener('pointerup', unlockHandler, true);
    };

    document.addEventListener('click', unlockHandler, true);
    document.addEventListener('touchend', unlockHandler, true);
    document.addEventListener('pointerup', unlockHandler, true);

    // Global play trigger (Hero Section / First Touch)
    (window as any).__playWeddingMusic = () => {
      if (!audio || userMutedRef.current) return;
      audio.muted = false;
      audio.volume = 1.0;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          hasUnlockedRef.current = true;
          setIsPlaying(true);
          removeUnlock();
        }).catch((err) => {
          console.log('Audio autoplay waiting for user interaction:', err);
        });
      }
    };

    // Global pause trigger
    (window as any).__pauseWeddingMusic = () => {
      if (!audio) return;
      audio.pause();
      setIsPlaying(false);
    };

    return () => {
      removeUnlock();
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayback = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastToggleRef.current < 350) return;
    lastToggleRef.current = now;

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // User explicitly muted the audio
      userMutedRef.current = true;
      hasUnlockedRef.current = true;
      audio.pause();
      setIsPlaying(false);
    } else {
      // User explicitly unmuted the audio
      userMutedRef.current = false;
      hasUnlockedRef.current = true;
      audio.muted = false;
      audio.volume = 1.0;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Audio playback error on toggle:', err);
        });
      }
    }
  };

  return (
    <>
      {/* FLOATING AUDIO CONTROLLER */}
      <div
        id="audio-control-widget"
        onClick={(e) => togglePlayback(e)}
        className={`${
          !isPlaying ? 'music-paused' : ''
        } fixed top-4 right-4 z-50 flex items-center gap-2 bg-night-900/85 backdrop-blur-md border border-gold-500/30 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all duration-300 hover:border-gold-400 cursor-pointer select-none`}
      >
        <button
          id="toggle-music-btn"
          onClick={(e) => togglePlayback(e)}
          className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-night-950 shadow-md hover:scale-105 active:scale-95 transition-transform"
          title="Toggle Music"
        >
          <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-night-950" />
        </button>
        <div className="flex flex-col pr-1">
          <span
            className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-300 font-sans font-medium"
            id="audio-label"
          >
            {isPlaying ? 'Playing' : 'Muted'}
          </span>
          <div className="flex items-center gap-1 h-2 mt-0.5" id="sound-equalizer">
            <span className="eq-bar h-1"></span>
            <span className="eq-bar h-2"></span>
            <span className="eq-bar h-1.5"></span>
            <span className="eq-bar h-2.5"></span>
          </div>
        </div>
      </div>

      {/* BACKGROUND AUDIO ELEMENT (Nasheed loop) */}
      <audio
        ref={audioRef}
        id="wedding-audio"
        src="/assets/audio/wedding_nasheed.mp3"
        preload="auto"
        loop
        playsInline
      />
    </>
  );
}
