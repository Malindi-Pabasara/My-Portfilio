'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import TypewriterEffect from './TypewriterEffect';

interface Stat { label: string; value: number; suffix: string; }

interface HeroProps {
  name: string;
  tagline: string;
  bio: string;
  available: boolean;
  stats: Stat[];
  cvUrl?: string;
  avatarUrl?: string;
}

export default function Hero({ name, tagline, bio, available, stats, cvUrl, avatarUrl }: HeroProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Cursor glow
  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - r.left}px`;
      glow.style.top = `${e.clientY - r.top}px`;
    };
    if (window.matchMedia('(hover:hover)').matches) hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  // Count-up
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-count]');
    if (!els.length) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        const target = parseInt(el.getAttribute('data-count') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        if (reduceMotion) { el.textContent = target + suffix; return; }
        let start: number | null = null;
        const dur = 900;
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.floor(p * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const taglineLines = tagline.split('systems').length > 1
    ? ['Building full‑stack', <span key="s">systems that work.</span>]
    : [tagline];

  return (
    <header className="hero wrap" id="hero" ref={heroRef}>
      <div className="cursor-glow" ref={glowRef} />
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="flex flex-col items-start text-left">
          {available && (
            <div className="tag fade-in d1 inline-flex items-center gap-2 text-[#9d6bff] font-mono text-sm mb-6 border border-[#9d6bff]/30 bg-[#9d6bff]/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></span>
              available for opportunities
            </div>
          )}
          <h1 className="fade-in d2 text-4xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight font-['Space_Grotesk']">
            Building full‑stack
            <span className="block bg-gradient-to-r from-[#9d6bff] to-[#41c7ff] text-transparent bg-clip-text">
              systems that work.
            </span>
          </h1>
          <TypewriterEffect />
          <p className="fade-in d2 text-[#9099bb] text-lg max-w-xl mb-8 leading-relaxed">
            {bio}
          </p>
          <div className="flex flex-wrap gap-4 mb-10 fade-in d3">
            <a href="#projects" className="btn btn-primary">Explore projects</a>
            {cvUrl && cvUrl !== '#' && (
              <a 
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(cvUrl)}&embedded=true`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-ghost"
              >
                Download CV
              </a>
            )}
          </div>
          <div className="flex gap-8 flex-wrap fade-in d4">
            {(stats || []).map((s, i) => (
              <div key={i} className="flex flex-col">
                <b className="font-['Space_Grotesk'] text-2xl font-bold bg-gradient-to-r from-[#9d6bff] to-[#41c7ff] text-transparent bg-clip-text">
                  <span data-count={s?.value || 0} data-suffix={s?.suffix || ''}>0</span>
                </b>
                <span className="text-sm text-[#5a6291]">{s?.label || ''}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="flex justify-center lg:justify-center fade-in d3 relative w-full mt-12 lg:mt-0">
          <div className="relative w-[360px] h-[360px] flex items-center justify-center translate-x-[50px]">
            
            {/* Outer Rotating Glowing Ring */}
            <div 
              className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-tr from-purple-500 via-[#41c7ff] to-purple-500 animate-[spin_10s_linear_infinite] shadow-[0_0_30px_rgba(168,85,247,0.4)] z-0"
              style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
            ></div>
            
            {/* Secondary Dashed Ring */}
            <div className="absolute inset-[-16px] rounded-full border border-dashed border-purple-500/40 animate-[spin_15s_linear_infinite_reverse] z-0"></div>

            {/* Static Inner Avatar */}
            <div className="relative w-[320px] h-[320px] rounded-full border-4 border-[#242b52] bg-gradient-to-br from-[#1c2444] to-[#0c1020] flex items-center justify-center shadow-[inset_0_0_70px_rgba(157,107,255,0.18)] z-10 overflow-hidden">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={name} fill style={{ objectFit: 'cover' }} sizes="320px" priority />
              ) : (
                <span className="font-['Space_Grotesk'] font-bold text-[6rem] text-[#eef0fb]/30 tracking-tighter">
                  {name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'MP'}
                </span>
              )}
              {/* Note: Moved dots outside the overflow-hidden container to prevent clipping */}
            </div>
            <div className="absolute w-3 h-3 rounded-full bg-[#9d6bff] shadow-[0_0_12px_#9d6bff] top-[12%] right-[15%] z-20"></div>
            <div className="absolute w-3 h-3 rounded-full bg-[#41c7ff] shadow-[0_0_12px_#41c7ff] bottom-[15%] left-[10%] z-20"></div>

            {/* Background Glow */}
            <div className="absolute inset-[-60px] rounded-full bg-[#9d6bff]/20 blur-[70px] -z-10 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
