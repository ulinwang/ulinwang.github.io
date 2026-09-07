import { NextResponse } from 'next/server';

// Decap CMS GitHub OAuth 回调：/api/callback?code=...
// 用 code 换 access_token，再按 Decap 的 postMessage 协议把 token 交回 CMS 窗口
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code');
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Missing code or GitHub OAuth env vars' },
      { status: 400 },
    );
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });
  const data = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  const success = Boolean(data.access_token);
  const payload = success
    ? JSON.stringify({ token: data.access_token, provider: 'github' })
    : JSON.stringify({
        error: data.error ?? 'oauth_failed',
        provider: 'github',
      });

  const html = `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        var payload = '${Buffer.from(payload).toString('base64')}';
        var message = 'authorization:github:${success ? 'success' : 'error'}:' + atob(payload);
        function receiveMessage(e) {
          window.opener.postMessage(message, e.origin);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
