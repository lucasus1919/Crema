import { NextResponse } from 'next/server';
import { metrics } from '@/lib/metricsCollector';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uptime = metrics.getUptimeSeconds();
  return NextResponse.json({
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    service: 'crema-web',
    version: '0.1.0',
  });
}
