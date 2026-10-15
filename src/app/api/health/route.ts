import { NextResponse } from 'next/server';
import { metrics } from '@/lib/metricsCollector';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  const uptime = metrics.getUptimeSeconds();
  metrics.recordRequest({
    method: 'GET',
    path: '/api/health',
    status: 200,
    durationMs: Math.max(1, Date.now() - start),
  });
  return NextResponse.json({
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    service: 'crema-web',
    version: '0.1.0',
  });
}
