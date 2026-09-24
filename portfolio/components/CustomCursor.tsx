'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position state for the ring (trailing)
  const ringPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Instantly move the dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    // Animation loop for trailing ring
    let animationFrameId: number;
    const render = () => {
      // Lerp (smooth follow) for the ring
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${isHovering ? 1.5 : 1})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Hover state detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovering, isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null; // Don't render on mobile/touch
  }

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="transition-transform duration-150 ease-out mix-blend-screen"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          border: '1px solid #9d6bff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          marginLeft: '-16px',
          marginTop: '-16px',
          opacity: isVisible ? (isHovering ? 0.8 : 0.4) : 0,
          background: isHovering ? 'rgba(157, 107, 255, 0.1)' : 'transparent',
        }}
      />
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="mix-blend-screen"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: '#9d6bff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
          marginLeft: '-4px',
          marginTop: '-4px',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
