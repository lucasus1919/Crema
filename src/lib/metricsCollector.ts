/**
 * Lightweight in-memory Prometheus metrics collector for Next.js.
 */

interface RequestMetric {
  method: string;
  path: string;
  status: number;
  durationMs: number;
}

class MetricsCollector {
  private startTime: number = Date.now();
  private requestCounts: Map<string, number> = new Map();
  private totalDurationMs: number = 0;
  private totalRequests: number = 0;
  private recentLatencies: number[] = [];

  public recordRequest(metric: RequestMetric) {
    const key = `method="${metric.method}",path="${metric.path}",status="${metric.status}"`;
    const count = this.requestCounts.get(key) || 0;
    this.requestCounts.set(key, count + 1);

    this.totalRequests += 1;
    this.totalDurationMs += metric.durationMs;

    this.recentLatencies.push(metric.durationMs);
    if (this.recentLatencies.length > 500) {
      this.recentLatencies.shift();
    }
  }

  public getUptimeSeconds(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  public toPrometheusFormat(): string {
    const lines: string[] = [];

    // App info
    lines.push('# HELP crema_app_info Crema Web POS application info');
    lines.push('# TYPE crema_app_info gauge');
    lines.push('crema_app_info{version="0.1.0",framework="nextjs"} 1');

    // Uptime
    lines.push('# HELP process_uptime_seconds Process uptime in seconds');
    lines.push('# TYPE process_uptime_seconds gauge');
    lines.push(`process_uptime_seconds ${this.getUptimeSeconds()}`);

    // Request total
    lines.push('# HELP http_requests_total Total number of HTTP requests handled');
    lines.push('# TYPE http_requests_total counter');
    if (this.requestCounts.size === 0) {
      lines.push('http_requests_total{method="GET",path="/",status="200"} 0');
    } else {
      for (const [labels, count] of this.requestCounts.entries()) {
        lines.push(`http_requests_total{${labels}} ${count}`);
      }
    }

    // Request duration summary
    lines.push('# HELP http_request_duration_seconds HTTP request duration in seconds');
    lines.push('# TYPE http_request_duration_seconds summary');
    const totalDurationSec = (this.totalDurationMs / 1000).toFixed(4);
    lines.push(`http_request_duration_seconds_sum ${totalDurationSec}`);
    lines.push(`http_request_duration_seconds_count ${this.totalRequests}`);

    // Memory stats
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const mem = process.memoryUsage();
      lines.push('# HELP nodejs_heap_used_bytes Process heap memory used in bytes');
      lines.push('# TYPE nodejs_heap_used_bytes gauge');
      lines.push(`nodejs_heap_used_bytes ${mem.heapUsed}`);

      lines.push('# HELP nodejs_heap_total_bytes Process heap memory total in bytes');
      lines.push('# TYPE nodejs_heap_total_bytes gauge');
      lines.push(`nodejs_heap_total_bytes ${mem.heapTotal}`);
    }

    return lines.join('\n') + '\n';
  }
}

// Global singleton across hot reloads in Node
const globalForMetrics = globalThis as unknown as { __cremaMetrics?: MetricsCollector };
export const metrics = globalForMetrics.__cremaMetrics || new MetricsCollector();
if (process.env.NODE_ENV !== 'production') {
  globalForMetrics.__cremaMetrics = metrics;
}
