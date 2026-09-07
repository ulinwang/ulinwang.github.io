'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import type { ProjectMeta } from '@/lib/content';

const WORLD_W = 1800;
const WORLD_H = 1100;
const MIN_SCALE = 0.4;
const MAX_SCALE = 2;
const NODE_W = 260;
const MAP_W = 160;
const MAP_H = Math.round((WORLD_H / WORLD_W) * MAP_W);

const pad = (n: number) => String(n).padStart(2, '0');
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * 图纸桌画布：拖拽平移（惯性衰减）、滚轮以光标为锚缩放、双击节点进详情。
 * DOM transform 方案（translate + scale 容器），所有变换走 ref 直写 DOM。
 * 粗指针设备（移动端）降级为列表。
 */
export default function CanvasBoard({ projects }: { projects: ProjectMeta[] }) {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const mapViewRef = useRef<HTMLDivElement>(null);
  const scaleLabelRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [coarse, setCoarse] = useState<boolean | null>(null);

  useEffect(() => {
    setCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (coarse) return;
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return;

    gsap.ticker.lagSmoothing(0);

    // ---- 视图状态（ref 直写，不走 React state）----
    const vw = () => viewport.clientWidth;
    const vh = () => viewport.clientHeight;
    let scale = 0.85;
    let tx = (vw() - WORLD_W * scale) / 2;
    let ty = (vh() - WORLD_H * scale) / 2 + 24;

    const clampView = () => {
      const m = 200; // 允许越界拖动的余量
      tx = clamp(tx, vw() - WORLD_W * scale - m, m);
      ty = clamp(ty, vh() - WORLD_H * scale - m, m);
    };

    const apply = () => {
      world.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      // minimap 视口框
      if (mapViewRef.current) {
        const k = MAP_W / WORLD_W;
        mapViewRef.current.style.left = `${(-tx / scale) * k}px`;
        mapViewRef.current.style.top = `${(-ty / scale) * k}px`;
        mapViewRef.current.style.width = `${(vw() / scale) * k}px`;
        mapViewRef.current.style.height = `${(vh() / scale) * k}px`;
      }
      if (scaleLabelRef.current) {
        scaleLabelRef.current.textContent = `${Math.round(scale * 100)}%`;
      }
      // 简单视口裁剪
      const margin = 320;
      nodeRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = projects[i];
        const sx = tx + p.x * scale;
        const sy = ty + p.y * scale;
        const visible =
          sx > -NODE_W * scale - margin &&
          sx < vw() + margin &&
          sy > -160 * scale - margin &&
          sy < vh() + margin;
        el.style.display = visible ? '' : 'none';
      });
    };
    apply();

    // ---- 入场：节点机械弹出 ----
    const nodes = nodeRefs.current.filter(Boolean) as HTMLDivElement[];
    if (document.visibilityState === 'hidden') {
      gsap.set(nodes, { opacity: 1, scale: 1 });
    } else {
      const tween = gsap.fromTo(
        nodes,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: 'steps(3)',
          stagger: 0.07,
        },
      );
      const safety = window.setTimeout(() => {
        if (tween.progress() < 1) tween.progress(1);
      }, 2500);
      tween.eventCallback('onComplete', () => window.clearTimeout(safety));
    }

    // ---- 顶部 hint 数秒后淡出 ----
    const hintTimer = window.setTimeout(() => {
      if (hintRef.current) hintRef.current.style.opacity = '0';
    }, 4000);

    // ---- 拖拽平移（含惯性）----
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;
    let inertiaRaf = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDist = 0;

    const stopInertia = () => {
      cancelAnimationFrame(inertiaRaf);
      inertiaRaf = 0;
    };

    const startInertia = () => {
      stopInertia();
      const step = () => {
        velX *= 0.93;
        velY *= 0.93;
        if (Math.hypot(velX, velY) < 0.15) return;
        tx += velX;
        ty += velY;
        clampView();
        apply();
        inertiaRaf = requestAnimationFrame(step);
      };
      inertiaRaf = requestAnimationFrame(step);
    };

    const zoomAt = (cx: number, cy: number, next: number) => {
      const newScale = clamp(next, MIN_SCALE, MAX_SCALE);
      const k = newScale / scale;
      tx = cx - (cx - tx) * k;
      ty = cy - (cy - ty) * k;
      scale = newScale;
      clampView();
      apply();
    };

    const onPointerDown = (e: PointerEvent) => {
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch {
        // 合成事件（自动化测试）没有真实 pointerId，忽略
      }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stopInertia();
      if (pointers.size === 1) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        velX = 0;
        velY = 0;
      } else if (pointers.size === 2) {
        dragging = false;
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        // 双指缩放
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const rect = viewport.getBoundingClientRect();
        const cx = (a.x + b.x) / 2 - rect.left;
        const cy = (a.y + b.y) / 2 - rect.top;
        if (pinchDist > 0) zoomAt(cx, cy, scale * (dist / pinchDist));
        pinchDist = dist;
        return;
      }

      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = dx;
      velY = dy;
      tx += dx;
      ty += dy;
      clampView();
      apply();
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0 && dragging) {
        dragging = false;
        startInertia();
      }
      if (pointers.size < 2) pinchDist = 0;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = viewport.getBoundingClientRect();
      zoomAt(
        e.clientX - rect.left,
        e.clientY - rect.top,
        scale * Math.exp(-e.deltaY * 0.0016),
      );
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      clampView();
      apply();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(hintTimer);
      stopInertia();
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerUp);
      viewport.removeEventListener('pointercancel', onPointerUp);
      viewport.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coarse]);

  // 移动端降级：列表
  if (coarse) {
    return (
      <main className="min-h-screen px-6 pb-24 pt-24">
        <p className="font-mono text-[11px] tracking-[0.3em] text-dim">
          WORKS / 索引（触屏列表模式）
        </p>
        <div className="mt-6 border-t border-line">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="block border-b border-line py-4"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] text-accent">
                P.{pad(p.order)}
              </span>
              <span className="mt-1 block font-display font-bold">
                {p.title}
              </span>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-ink">
      {/* 顶部 hint */}
      <div
        ref={hintRef}
        className="pointer-events-none absolute left-1/2 top-20 z-20 -translate-x-1/2 border border-line bg-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] text-dim transition-opacity duration-500"
      >
        DRAG TO PAN / SCROLL TO ZOOM / DOUBLE-CLICK TO OPEN
      </div>

      {/* 视口 */}
      <div
        ref={viewportRef}
        className="absolute inset-0 touch-none select-none"
        style={{ cursor: 'grab' }}
      >
        {/* 世界平面 */}
        <div
          ref={worldRef}
          className="bg-dotgrid absolute left-0 top-0 border border-line"
          style={{
            width: WORLD_W,
            height: WORLD_H,
            transformOrigin: '0 0',
          }}
        >
          {/* 世界平面标尺文字 */}
          <span className="absolute left-2 top-2 font-mono text-[10px] tracking-[0.3em] text-dim">
            SHEET A-01 / WORKS FIELD
          </span>
          <span className="absolute bottom-2 right-2 font-mono text-[10px] tracking-[0.3em] text-dim">
            {WORLD_W}×{WORLD_H}
          </span>

          {projects.map((p, i) => (
            <div
              key={p.slug}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              data-cursor
              onDoubleClick={() => router.push(`/projects/${p.slug}`)}
              className="group absolute border border-line bg-ink p-3 opacity-0 transition-colors hover:border-accent hover:bg-paper"
              style={{ left: p.x, top: p.y, width: NODE_W }}
            >
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-dim group-hover:text-ink">
                <span className={p.featured ? 'bg-accent px-1 text-ink' : ''}>
                  P.{pad(p.order)}
                </span>
                <span>
                  X:{String(p.x).padStart(4, '0')} Y:{String(p.y).padStart(4, '0')}
                </span>
              </div>
              <h2 className="mt-2 font-display text-sm font-bold leading-snug group-hover:text-ink">
                {p.title}
              </h2>
              {/* hover 浮层：简介 */}
              <div className="mt-2 hidden border-t border-line pt-2 group-hover:block">
                <p className="text-[11px] leading-relaxed text-dim group-hover:text-ink">
                  {p.description}
                </p>
                <p className="mt-2 font-mono text-[9px] tracking-[0.25em] text-accent group-hover:text-ink">
                  DOUBLE-CLICK TO OPEN ↗
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 左下缩放比例尺 */}
      <div className="absolute bottom-8 left-6 z-20 border border-line bg-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-dim">
        ZOOM <span ref={scaleLabelRef} className="text-paper">85%</span>
      </div>

      {/* 右下 minimap */}
      <div
        className="absolute bottom-8 right-6 z-20 border border-line bg-ink/90"
        style={{ width: MAP_W, height: MAP_H }}
      >
        <div className="relative h-full w-full overflow-hidden">
          {projects.map((p) => (
            <span
              key={p.slug}
              className="absolute h-1 w-1 bg-dim"
              style={{
                left: (p.x / WORLD_W) * MAP_W,
                top: (p.y / WORLD_H) * MAP_H,
              }}
            />
          ))}
          <div
            ref={mapViewRef}
            className="absolute border border-accent"
          />
        </div>
      </div>
    </main>
  );
}
