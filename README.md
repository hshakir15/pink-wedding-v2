# Safina & Ghalib — Nikah Wedding Invitation (Next.js)

A luxury, interactive digital wedding invitation built with **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, **GSAP**, and **Lenis**.

Features:
- **Custom Video Hero Reveal**: Opening video frame with interactive touch-to-play, unmuted audio trigger, and seamless 4.0s choreographed typography entrance.
- **Background Audio Nasheed Loop**: Floating music controller (`Playing` / `Muted` single-word indicator) with animated equalizer and global interaction priming.
- **Floating Botanical Particle System**: 3 depth tiers of petals, blossoms, and leaves with natural wind wave drift and touch impulse physics.
- **Bride & Groom Portraits**: Symmetrical portrait framing, halo rings, and custom responsive heart divider (mobile dangling crystal ornament, desktop horizontal divider).
- **Auto-Detecting Calendar Integration**: Intelligent device detection (Apple Calendar `.ics` on iOS/macOS, Google Calendar on Android/Windows).
- **Event Details & Venue**: Venue & time breakdown with direct Google Maps navigation.
- **Blessings & Moments**: Quranic verse carousel with Arabic calligraphy and touch swipe support.
- **Live Countdown Timer**: Days, hours, minutes, seconds countdown to December 12, 2026.
- **Interactive RSVP**: Instant WhatsApp submission with celebratory confetti and auto-sliding guest wishes feed.
- **Performance & Scroll Optimization**: Pure native hardware-accelerated touch scrolling on mobile (pull-back effect 100% eliminated), Lenis smooth scroll on desktop.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🚀 Deploy to Vercel

1. Push your project to GitHub:
   ```bash
   git add .
   git commit -m "Migrate Wedding Invitation to Next.js"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Vercel will automatically detect Next.js and deploy with zero configuration needed.

---

## 📂 Project Structure

- `app/`
  - `layout.tsx`: Root HTML layout with Google Fonts preconnections and SEO metadata.
  - `page.tsx`: Main page assembling all wedding sections and state managers.
  - `globals.css`: Global styles, calligraphy shaders, equalizer animations, and theme backgrounds.
- `components/`
  - `HeroSection.tsx`: Video reveal, touch cue, and hero typography animations.
  - `AudioWidget.tsx`: Floating music widget, state handling, and audio element.
  - `FloralParticles.tsx`: Canvas/DOM floating petals and wind physics engine.
  - `CoupleSection.tsx`: Bride & Groom portraits with responsive heart ornaments.
  - `SaveDateSection.tsx`: Save the Date with auto-detecting Apple/Google Calendar button.
  - `EventsSection.tsx`: Wedding details card and timing breakdown.
  - `BlessingsSection.tsx`: Quranic verse slider with swipe and pagination.
  - `CountdownSection.tsx`: Live countdown timer with smooth digit transitions.
  - `VenueSection.tsx`: Location details and Google Maps integration.
  - `RsvpSection.tsx`: RSVP form, WhatsApp integration, and wishes slider.
  - `FooterSection.tsx`: Closing family signatures.
  - `SmoothScrollManager.tsx`: Lenis desktop / native mobile scroll controller.
- `public/assets/`
  - `audio/`: Background wedding nasheed audio track (`wedding_nasheed.mp3`).
  - `video/`: Hero reveal video (`opening.mp4`).
  - `images/`: High-resolution transparent PNGs, couple portraits, floral frames, and floating petals.
