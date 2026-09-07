import { NextResponse } from 'next/server';

// Decap CMS GitHub OAuth 入口：/api/auth → 跳转 GitHub 授权页
export function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Missing GITHUB_CLIENT_ID env var' },
      { status: 500 },
    );
  }
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/callback`,
    scope: 'repo,user',
  });
  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
  );
}
