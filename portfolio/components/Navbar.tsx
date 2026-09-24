'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const linksRef = useRef<HTMLUListElement>(null);
  const { data: session, status } = useSession();

  // Typed — role is guaranteed to be on session.user via next-auth.d.ts
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'admin';
  const isLoggedIn = status === 'authenticated' && !!session?.user;

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id], header[id]'));
    const setActive = () => {
      const pos = window.scrollY + 100;
      let current = '';
      sections.forEach((s) => { if (s.offsetTop <= pos) current = s.id; });
      linksRef.current?.querySelectorAll('a:not(.btn-ghost):not(.btn-primary)').forEach((a) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#')) {
          a.classList.toggle('active', href === `#${current}`);
        }
      });
    };
    document.addEventListener('scroll', setActive, { passive: true });
    setActive();
    return () => document.removeEventListener('scroll', setActive);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#080b16]/70 backdrop-blur-md border-b border-[#242b52]">
      <div className="wrap flex items-center justify-between h-[70px]">

        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-3 font-semibold text-[1.05rem] decoration-none shrink-0">
          <span className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#9d6bff] to-[#41c7ff] flex items-center justify-center font-bold text-[#080b16] font-['Space_Grotesk'] shadow-[0_4px_16px_rgba(157,107,255,0.4)]">
            M
          </span>
          <span className="hidden sm:block">Malindi Pabasara</span>
        </Link>

        {/* Center: Navigation Pill */}
        <ul
          className="hidden md:flex items-center gap-6 bg-gray-800/40 border border-gray-700/50 rounded-full px-8 py-2.5 text-[0.92rem] text-[#9099bb] list-none m-0"
          ref={linksRef}
        >
          {['about', 'experience', 'skills', 'projects', 'certifications', 'education'].map((s) => (
            <li key={s}>
              <a href={`#${s}`} className="transition-all duration-300 hover:!text-purple-400 relative">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Auth Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <>


              {/* Admin Panel — EXCLUSIVE to admins */}
              {isAdmin && (
                <Link
                  href="/admin"
                  id="admin-panel-btn"
                  className="btn btn-ghost !py-1.5 !px-3 !text-[0.85rem] flex items-center gap-1.5 border border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  Admin Panel
                </Link>
              )}

              {/* Greeting + role badge */}
              <span className="text-[0.9rem] text-[#9099bb] hidden sm:inline-flex items-center gap-1.5">
                Hi, {session?.user?.name?.split(' ')[0]}
                {isAdmin && (
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded px-1.5 py-0.5">
                    Admin
                  </span>
                )}
              </span>

              <button
                id="logout-btn"
                onClick={() => signOut()}
                className="btn btn-ghost !py-1.5 !px-3 !text-[0.85rem]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost !py-1.5 !px-3 !text-[0.85rem] hover:!text-purple-400 transition-all duration-300">Login</Link>
              <Link href="/register" className="btn btn-primary !py-1.5 !px-3 !text-[0.85rem] hover:brightness-110 transition-all duration-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
