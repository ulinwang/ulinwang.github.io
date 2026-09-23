import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const dynamic = 'force-dynamic';

/**
 * GA4 Data API 看板数据：近 30 天 pageViews / sessions / activeUsers、
 * 按天趋势、Top 页面、实时在线人数。
 * 认证：服务账号 JWT（RS256 手写签名，无额外依赖）。
 * env: GA_PROPERTY_ID / GA_CLIENT_EMAIL / GA_PRIVATE_KEY
 */

function envStatus() {
  const missing = [
    'GA_PROPERTY_ID',
    'GA_CLIENT_EMAIL',
    'GA_PRIVATE_KEY',
  ].filter((k) => !process.env[k]);
  return {
    ok: missing.length === 0,
    missing,
    propertyId: process.env.GA_PROPERTY_ID,
    clientEmail: process.env.GA_CLIENT_EMAIL,
    privateKey: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
}

const b64url = (data: object | string) =>
  Buffer.from(typeof data === 'string' ? data : JSON.stringify(data)).toString(
    'base64url',
  );

async function getAccessToken(clientEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url({ alg: 'RS256', typ: 'JWT' })}.${b64url({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = crypto
    .sign('RSA-SHA256', Buffer.from(unsigned), privateKey)
    .toString('base64url');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!data.access_token) {
    throw new Error(`oauth token failed: ${data.error ?? res.status}`);
  }
  return data.access_token;
}

async function gaPost(
  propertyId: string,
  endpoint: 'runReport' | 'runRealtimeReport',
  token: string,
  body: object,
) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:${endpoint}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(`${endpoint} failed: ${res.status}`);
  return res.json() as Promise<{
    rows?: {
      dimensionValues?: { value: string }[];
      metricValues?: { value: string }[];
    }[];
  }>;
}

export async function GET() {
  const env = envStatus();
  if (!env.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: 'ga_not_configured',
        missing: env.missing,
        hint: 'Set GA_PROPERTY_ID / GA_CLIENT_EMAIL / GA_PRIVATE_KEY in Vercel env (see README).',
      },
      { status: 503 },
    );
  }

  try {
    const token = await getAccessToken(env.clientEmail!, env.privateKey!);
    const property = env.propertyId!;

    const [totals, daily, topPages, realtime] = await Promise.all([
      gaPost(property, 'runReport', token, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'activeUsers' },
        ],
      }),
      gaPost(property, 'runReport', token, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
      gaPost(property, 'runReport', token, {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      gaPost(property, 'runRealtimeReport', token, {
        metrics: [{ name: 'activeUsers' }],
      }).catch(() => null), // 实时数据为可选项，失败不阻塞
    ]);

    const totalRow = totals.rows?.[0]?.metricValues ?? [];
    return NextResponse.json(
      {
        ok: true,
        range: 'last_30_days',
        totals: {
          pageViews: Number(totalRow[0]?.value ?? 0),
          sessions: Number(totalRow[1]?.value ?? 0),
          activeUsers: Number(totalRow[2]?.value ?? 0),
        },
        realtimeUsers: Number(
          realtime?.rows?.[0]?.metricValues?.[0]?.value ?? 0,
        ),
        daily: (daily.rows ?? []).map((r) => ({
          date: r.dimensionValues?.[0]?.value ?? '',
          pageViews: Number(r.metricValues?.[0]?.value ?? 0),
        })),
        topPages: (topPages.rows ?? []).map((r) => ({
          path: r.dimensionValues?.[0]?.value ?? '',
          pageViews: Number(r.metricValues?.[0]?.value ?? 0),
        })),
      },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate' } },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'ga_query_failed', detail: String(err) },
      { status: 502 },
    );
  }
}
