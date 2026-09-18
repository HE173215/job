import { useState, useEffect } from 'react';

/**
 * Custom hook tính toán scroll progress của một element hoặc toàn bộ trang
 * Sử dụng requestAnimationFrame để đảm bảo 60fps mượt mà không block main thread
 */
export function useScrollProgress(containerRef = null) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (animationFrameId) return;

      animationFrameId = requestAnimationFrame(() => {
        if (containerRef?.current) {
          const element = containerRef.current;
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Tính toán khoảng scroll qua element
          const totalDistance = rect.height + windowHeight;
          const currentProgress = (windowHeight - rect.top) / totalDistance;
          const clamped = Math.min(Math.max(currentProgress, 0), 1);
          setProgress(clamped);
        } else {
          // Toàn trang
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (scrollHeight > 0) {
            setProgress(Math.min(Math.max(scrollTop / scrollHeight, 0), 1));
          }
        }
        animationFrameId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [containerRef]);

  return progress;
}

export default useScrollProgress;
