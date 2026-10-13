'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { TopItem, DailyRevenue, CategoryBreakdown, PeakHourData } from '@/types';
import * as fbService from '@/lib/firebaseService';
import { exportReportsToExcel } from '@/lib/exportService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

interface ReportContextType {
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  monthRevenue: number;
  topItems: TopItem[];
  dailyRevenue: DailyRevenue[];
  categoryBreakdown: CategoryBreakdown[];
  peakHourData: PeakHourData[];
  loading: boolean;
  loadReports: () => Promise<void>;
  exportReport: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [peakHourData, setPeakHourData] = useState<PeakHourData[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { appUser } = useAuth();

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();

      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        todayRev,
        todayCount,
        weekRev,
        monthRev,
        tops,
        daily,
        cats,
        peaks,
      ] = await Promise.all([
        fbService.getRevenueForDateRange(startOfToday, endOfToday),
        fbService.getOrderCountForDateRange(startOfToday, endOfToday),
        fbService.getRevenueForDateRange(startOfWeek, endOfToday),
        fbService.getRevenueForDateRange(startOfMonth, endOfToday),
        fbService.getTopSellingItems(6),
        fbService.getDailyRevenue(7),
        fbService.getCategoryBreakdown(),
        fbService.getPeakHourData(),
      ]);

      setTodayRevenue(todayRev);
      setTodayOrders(todayCount);
      setWeekRevenue(weekRev);
      setMonthRevenue(monthRev);
      setTopItems(tops);
      setDailyRevenue(daily);
      setCategoryBreakdown(cats);
      setPeakHourData(peaks);
    } catch {
      showToast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (appUser?.role === 'admin') {
      loadReports();
    } else {
      setLoading(false);
    }
  }, [appUser?.role, loadReports]);

  const exportReport = () => {
    try {
      exportReportsToExcel({
        todayRevenue,
        todayOrders,
        weekRevenue,
        monthRevenue,
        topItems,
        dailyRevenue,
        categoryBreakdown,
      });
      showToast('Report downloaded successfully!', 'success');
    } catch {
      showToast('Export failed', 'error');
    }
  };

  return (
    <ReportContext.Provider
      value={{
        todayRevenue,
        todayOrders,
        weekRevenue,
        monthRevenue,
        topItems,
        dailyRevenue,
        categoryBreakdown,
        peakHourData,
        loading,
        loadReports,
        exportReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (!context) throw new Error('useReports must be used within a ReportProvider');
  return context;
}
