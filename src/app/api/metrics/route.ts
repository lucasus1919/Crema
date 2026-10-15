import { NextResponse } from 'next/server';
import { metrics } from '@/lib/metricsCollector';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  metrics.recordRequest({
    method: 'GET',
    path: '/api/metrics',
    status: 200,
    durationMs: Math.max(1, Date.now() - start),
  });
  const body = metrics.toPrometheusFormat();
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
    },
  });
}
