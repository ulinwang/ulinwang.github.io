import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next 15 会把 /admin/ 308 到 /admin 再 404（public 目录索引不被识别），
  // 用 rewrite 把干净 URL 映射到静态 index.html（Decap CMS 与数据看板）
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/admin/dashboard', destination: '/admin/dashboard/index.html' },
    ];
  },
};

export default nextConfig;
