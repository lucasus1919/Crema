'use client';

import React from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Calendar,
  BarChart2,
  PieChart as PieIcon,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useReports } from '@/contexts/ReportContext';
import { StatCard } from '@/components/admin/StatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

const COLORS = ['#D4A574', '#A87B4F', '#855E38', '#5C4033', '#E6C59E', '#C29263'];

export default function AdminReportsPage() {
  const {
    todayRevenue,
    todayOrders,
    weekRevenue,
    monthRevenue,
    topItems,
    dailyRevenue,
    categoryBreakdown,
    peakHourData,
    loading,
    exportReport,
  } = useReports();

  if (loading) {
    return <Spinner size={40} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#F5E6D3',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Analytics & Reports
          </h1>
          <p style={{ color: 'rgba(245, 230, 211, 0.6)', fontSize: '0.9rem', marginTop: '2px' }}>
            Comprehensive sales performance, volume, and customer patterns
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<FileSpreadsheet size={18} />}
          onClick={exportReport}
        >
          Export to Excel (.xlsx)
        </Button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <StatCard
          title="Today's Revenue"
          value={`₹${todayRevenue.toFixed(2)}`}
          icon={<IndianRupee size={20} />}
        />
        <StatCard
          title="Today's Orders"
          value={todayOrders}
          icon={<ShoppingBag size={20} />}
        />
        <StatCard
          title="7-Day Revenue"
          value={`₹${weekRevenue.toFixed(2)}`}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${monthRevenue.toFixed(2)}`}
          icon={<Calendar size={20} />}
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        {/* 1. Daily Revenue Chart */}
        <Card variant="surface" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <TrendingUp size={20} color="#D4A574" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F5E6D3' }}>
              Daily Revenue Trend
            </h3>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A574" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4A574" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(78, 52, 46, 0.4)" />
                <XAxis
                  dataKey="day"
                  stroke="rgba(245, 230, 211, 0.5)"
                  fontSize={11}
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis stroke="rgba(245, 230, 211, 0.5)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2C1A12',
                    borderColor: 'rgba(78, 52, 46, 0.8)',
                    borderRadius: '8px',
                    color: '#F5E6D3',
                  }}
                  formatter={(value: unknown) => {
                    const num = typeof value === 'number' ? value : Number(value) || 0;
                    return [`₹${num.toFixed(2)}`, 'Revenue'];
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4A574" strokeWidth={2} fill="url(#goldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Top Selling Items */}
        <Card variant="surface" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <BarChart2 size={20} color="#D4A574" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F5E6D3' }}>
              Top Selling Items (Units Sold)
            </h3>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(78, 52, 46, 0.4)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(245, 230, 211, 0.5)"
                  fontSize={10}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="rgba(245, 230, 211, 0.5)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2C1A12',
                    borderColor: 'rgba(78, 52, 46, 0.8)',
                    borderRadius: '8px',
                    color: '#F5E6D3',
                  }}
                />
                <Bar dataKey="totalQty" fill="#D4A574" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Category Breakdown Pie */}
        <Card variant="surface" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <PieIcon size={20} color="#D4A574" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F5E6D3' }}>
              Revenue by Category
            </h3>
          </div>
          <div style={{ height: '260px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {categoryBreakdown.length === 0 ? (
              <p style={{ color: 'rgba(245, 230, 211, 0.5)', fontSize: '0.9rem' }}>No category data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    dataKey="totalRevenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={4}
                    label={({ name }) => name || ''}
                  >
                    {categoryBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#2C1A12',
                      borderColor: 'rgba(78, 52, 46, 0.8)',
                      borderRadius: '8px',
                      color: '#F5E6D3',
                    }}
                    formatter={(value: unknown) => {
                      const num = typeof value === 'number' ? value : Number(value) || 0;
                      return [`₹${num.toFixed(2)}`, 'Revenue'];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* 4. Peak Hours */}
        <Card variant="surface" padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Clock size={20} color="#D4A574" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F5E6D3' }}>
              Peak Ordering Hours
            </h3>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHourData.filter((d) => d.hour >= 6 && d.hour <= 22)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(78, 52, 46, 0.4)" />
                <XAxis
                  dataKey="hour"
                  stroke="rgba(245, 230, 211, 0.5)"
                  fontSize={11}
                  tickFormatter={(h) => `${h}:00`}
                />
                <YAxis stroke="rgba(245, 230, 211, 0.5)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2C1A12',
                    borderColor: 'rgba(78, 52, 46, 0.8)',
                    borderRadius: '8px',
                    color: '#F5E6D3',
                  }}
                  formatter={(val: unknown) => [`${val} orders`, 'Volume']}
                />
                <Bar dataKey="count" fill="#A87B4F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
