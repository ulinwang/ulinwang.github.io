'use client';

import { useEffect, useRef, useState } from 'react';

const VERT = `#version 300 es
layout(location = 0) in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// 「活的工程图纸」：呼吸点阵 + 微幅起伏的透视网格 + 周期扫描线 + 指针扰动
// 只用灰阶 + accent 点缀，颜色全部由 uniform 传入（跟随 data-theme）
const FRAG = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;   // 像素坐标（原点在左下）
uniform vec3 u_bg;
uniform vec3 u_grid;    // 网格点/线基色（灰阶）
uniform vec3 u_accent;  // 南大紫

out vec4 outColor;

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y); // 改为左上原点
  vec3 col = u_bg;

  // 指针扰动：附近网格点轻微位移
  vec2 dm = p - u_mouse;
  float md2 = dot(dm, dm);
  vec2 warp = (dm / max(sqrt(md2), 1.0)) * 16.0 * exp(-md2 / 32000.0);
  vec2 pw = p + warp;

  // ---- 呼吸点阵 ----
  float cell = 42.0;
  vec2 g = pw / cell;
  vec2 gv = fract(g) - 0.5;
  float wave = 0.5 + 0.5 * sin(u_time * 0.55 + g.x * 0.35 + g.y * 0.6
                 + 1.6 * sin(u_time * 0.21 + g.y * 0.3));

  // ---- 扫描线（竖线周期扫过，扫过处点亮）----
  float period = 8.0;
  float sx = mod(u_time, period) / period * (u_resolution.x + 480.0) - 240.0;
  float scan = exp(-pow((p.x - sx) / 90.0, 2.0));

  float intensity = 0.22 + 0.38 * wave + 0.9 * scan;
  float dotMask = smoothstep(2.4, 1.1, length(gv) * cell);
  vec3 dotCol = mix(u_grid, u_accent, clamp(scan * 1.1 + 0.12 * wave, 0.0, 1.0));
  col = mix(col, dotCol, dotMask * intensity);

  // ---- 透视网格线（下半部，微幅起伏）----
  float horizon = u_resolution.y * 0.60;
  if (p.y > horizon) {
    float py = (p.y - horizon) / (u_resolution.y - horizon); // 0 天际线 → 1 底部
    float persp = 1.0 / (py * 7.0 + 0.22);
    float und = 0.35 * sin(u_time * 0.45 + p.x * 0.004 + py * 3.0);
    float f = fract(persp + und);
    float ln = 1.0 - smoothstep(0.0, 0.10, min(f, 1.0 - f));
    float fade = smoothstep(0.02, 0.2, py) * (1.0 - smoothstep(0.75, 1.0, py));
    vec3 lineCol = mix(u_grid, u_accent, scan * 0.8);
    col = mix(col, lineCol, ln * fade * (0.16 + 0.35 * scan));
  }

  outColor = vec4(col, 1.0);
}
`;

/** 解析 CSS 颜色（#rgb/#rrggbb/rgb[a]()）为 vec3 */
function parseColor(raw: string): [number, number, number] {
  const s = raw.trim();
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    const full =
      hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    const n = parseInt(full, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = s.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
  }
  return [0, 0, 0];
}

function readThemeColors() {
  const cs = getComputedStyle(document.documentElement);
  const light = document.documentElement.dataset.theme === 'light';
  return {
    bg: parseColor(cs.getPropertyValue('--bg')),
    // 网格点基色：暗主题用浅灰，亮主题用深灰（灰阶水墨）
    grid: light ? [0.35, 0.33, 0.3] : [0.75, 0.75, 0.78],
    accent: parseColor(cs.getPropertyValue('--accent')),
  } as const;
}

export default function BlueprintGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const canvas = canvasRef.current;
    if (reducedMotion || !canvas) {
      setFallback(true);
      return;
    }

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) {
      setFallback(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile error');
      }
      return shader;
    };

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'link error');
      }
    } catch {
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uBg = gl.getUniformLocation(program, 'u_bg');
    const uGrid = gl.getUniformLocation(program, 'u_grid');
    const uAccent = gl.getUniformLocation(program, 'u_accent');

    const pushTheme = () => {
      const c = readThemeColors();
      gl.uniform3f(uBg, ...c.bg);
      gl.uniform3f(uGrid, ...(c.grid as [number, number, number]));
      gl.uniform3f(uAccent, ...c.accent);
    };
    pushTheme();

    // 跟随 data-theme 切换
    const observer = new MutationObserver(pushTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let targetX = -9999;
    let targetY = -9999;
    let mouseX = -9999;
    let mouseY = -9999;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = (e.clientX - rect.left) * dpr;
      targetY = (e.clientY - rect.top) * dpr;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let raf = 0;
    const start = performance.now();
    const render = () => {
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    if (!document.hidden) raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  if (fallback) {
    // 降级：静态点阵（reduced-motion / WebGL2 不可用 / 编译失败）
    return <div aria-hidden className="bg-dotgrid-soft absolute inset-0 z-0" />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 z-0 h-full w-full"
    />
  );
}
