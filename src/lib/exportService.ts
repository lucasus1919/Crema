import * as XLSX from 'xlsx';

interface ReportData {
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  monthRevenue: number;
  topItems: { name: string; totalQty: number; totalRevenue: number }[];
  dailyRevenue: { day: string; revenue: number }[];
  categoryBreakdown: { category: string; totalRevenue: number }[];
}

export function exportReportsToExcel(report: ReportData): void {
  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Metric', 'Value'],
    ['Today Revenue', report.todayRevenue],
    ['Today Orders', report.todayOrders],
    ['This Week Revenue', report.weekRevenue],
    ['This Month Revenue', report.monthRevenue],
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Top Items
  const topItemsData = [
    ['Item Name', 'Quantity Sold', 'Total Revenue'],
    ...report.topItems.map((i) => [i.name, i.totalQty, i.totalRevenue]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(topItemsData), 'Top Items');

  // Daily Revenue
  const dailyData = [
    ['Day', 'Revenue'],
    ...report.dailyRevenue.map((d) => [d.day, d.revenue]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dailyData), 'Daily Revenue');

  // Category Breakdown
  const catData = [
    ['Category', 'Total Revenue'],
    ...report.categoryBreakdown.map((c) => [c.category, c.totalRevenue]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(catData), 'Category Breakdown');

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  XLSX.writeFile(wb, `reports_${date}.xlsx`);
}
