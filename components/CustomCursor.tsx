'use client';

import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 16;

interface Particle {
  x: number;
  y: number;
}

/**
 * 发光彗尾拖尾光标：发光核心 + 弹簧物理粒子尾巴（移动越快尾巴越长），
 * 悬停 a/button/[data-cursor] 时核心变为放大的青紫光环。
 * 仅 pointer:fine 启用；prefers-reduced-motion 与移动端不出现。
 */
export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const canvas = canvasRef.current;
    if (!finePointer || reducedMotion || !canvas) return;

    document.documentElement.classList.add('custom-cursor');

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    let mouseX = -100;
    let mouseY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let hovering = false;
    let ringRadius = 6; // 核心当前半径（缓动）
    const trail: Particle[] = Array.from({ length: TRAIL_LENGTH }, () => ({
      x: -100,
      y: -100,
    }));

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      hovering = Boolean(
        (e.target as HTMLElement).closest('a, button, [data-cursor]'),
      );
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    let raf = 0;
    const loop = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'lighter';

      // 指针速度（用于尾巴拉伸与发光强度）
      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      const speed = Math.min(Math.hypot(vx, vy), 60);
      prevMouseX += vx * 0.5;
      prevMouseY += vy * 0.5;

      // 弹簧物理：头部紧跟指针，尾巴逐级弹簧跟随；速度越快跟随越松、尾巴越长
      const headStiffness = 0.55;
      trail[0].x += (mouseX - trail[0].x) * headStiffness;
      trail[0].y += (mouseY - trail[0].y) * headStiffness;
      const tailStiffness = 0.45 - (speed / 60) * 0.25; // 0.45 → 0.20
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * tailStiffness;
        trail[i].y += (trail[i - 1].y - trail[i].y) * tailStiffness;
      }

      // 尾巴：从尾到头逐渐变大变亮
      for (let i = TRAIL_LENGTH - 1; i >= 1; i--) {
        const t = 1 - i / TRAIL_LENGTH; // 0=尾端, 1=头部
        const radius = 1 + t * 4;
        const alpha = t * t * 0.5;
        // 尾端偏紫，头部偏青
        const rC = Math.round(167 - t * 130);
        const gC = Math.round(139 + t * 72);
        const bC = Math.round(250 - t * 12);
        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${alpha})`;
        ctx.shadowColor = `rgba(${rC}, ${gC}, ${bC}, ${alpha * 0.8})`;
        ctx.shadowBlur = 8 * t;
        ctx.fill();
      }

      // 核心：悬停时变为放大的青紫光环
      const targetRadius = hovering ? 22 : 6;
      ringRadius += (targetRadius - ringRadius) * 0.18;
      const cx = trail[0].x;
      const cy = trail[0].y;

      if (ringRadius > 10) {
        // 光环模式
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fill();
      } else {
        // 发光核心
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
        gradient.addColorStop(0, 'rgba(220, 245, 255, 0.95)');
        gradient.addColorStop(0.3, 'rgba(34, 211, 238, 0.7)');
        gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 0;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    if (!document.hidden) raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove('custom-cursor');
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden [@media(pointer:fine)]:block motion-reduce:hidden"
    />
  );
}
