import React from 'react';

export default function FooterSection() {
  return (
    <footer className="py-10 sm:py-12 px-4 bg-white/50 border-t border-[#d4af37]/30 text-center">
      <div className="max-w-md mx-auto space-y-3">
        <span className="couple-script-name text-3xl sm:text-4xl text-[#882937] font-bold block">
          Safina &amp; Ghalib
        </span>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#7a323d] font-sans font-semibold">
          December 12, 2026 • Royal Heritage Palace
        </p>
        <div className="text-[11px] text-[#5c242b] font-sans pt-1">
          With Love &amp; Prayers from Both Families 🤍
        </div>
      </div>
    </footer>
  );
}
