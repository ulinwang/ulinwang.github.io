'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ProjectMeta } from '@/lib/content';
import ProjectCard from '@/components/ProjectCard';

/**
 * 项目卡片网格：进入视口时 GSAP stagger 入场。
 * IntersectionObserver + 轮询双通道（隐藏标签页 IO/scroll 事件不回调），
 * 隐藏页直通终态，tween 播放后 2.5s 超时兜底。
 */
export default function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    const grid = gridRef.current;
    if (!grid) return;

    let played = false;
    let safety: number | undefined;
    let poll: number | undefined;

    const play = () => {
      if (played) return;
      played = true;
      observer.disconnect();
      window.clearInterval(poll);

      const cards = grid.querySelectorAll('.project-card');
      if (document.visibilityState === 'hidden') {
        // 隐藏标签页没有渲染帧，动画不可见，直接落到终态
        gsap.set(cards, { y: 0, opacity: 1 });
        return;
      }
      const tween = gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
        },
      );
      // 兜底：rAF 被暂停导致 tween 停滞时，2.5s 后强制到最终态
      safety = window.setTimeout(() => {
        if (tween.progress() < 1) tween.progress(1);
      }, 2500);
      tween.eventCallback('onComplete', () => window.clearTimeout(safety));
    };

    const inView = () => {
      const rect = grid.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    };

    const checkNow = () => {
      if (!played && inView()) play();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) play();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(grid);

    // 挂载时已在视口内（锚点直达等）直接播放
    if (inView()) {
      play();
    } else {
      poll = window.setInterval(checkNow, 250);
      document.addEventListener('visibilitychange', checkNow);
      window.addEventListener('focus', checkNow);
    }

    return () => {
      observer.disconnect();
      window.clearInterval(poll);
      window.clearTimeout(safety);
      document.removeEventListener('visibilitychange', checkNow);
      window.removeEventListener('focus', checkNow);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
