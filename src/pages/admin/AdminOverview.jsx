import React from 'react';
import { useOutletContext } from 'react-router-dom';
import KpiCard from '../../components/admin/KpiCard';
import RevenueChart from '../../components/admin/RevenueChart';
import TopCategoriesDonut from '../../components/admin/TopCategoriesDonut';
import RecentOrdersTable from '../../components/admin/RecentOrdersTable';
import InventoryAlerts from '../../components/admin/InventoryAlerts';
import { getDashboardDataByRange } from '../../data/adminMockData';
import { DollarSign, ShoppingBag, CreditCard, Users } from 'lucide-react';

const KPI_ICONS = {
  'kpi-1': DollarSign,
  'kpi-2': ShoppingBag,
  'kpi-3': CreditCard,
  'kpi-4': Users,
};

export const AdminOverview = () => {
  const outletContext = useOutletContext();
  const selectedDateRange = outletContext?.selectedDateRange || 'This Week';
  const currentData = getDashboardDataByRange(selectedDateRange);

  return (
    <div className="space-y-6">
      {/* B. KPI Metrics Cards (Top Row) - Dynamic based on selectedDateRange */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentData.kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            isPositive={kpi.isPositive}
            comparison={kpi.comparison}
            icon={KPI_ICONS[kpi.id]}
          />
        ))}
      </section>

      {/* C. Analytics Section (Middle Row) - Dynamic charts synced with selectedDateRange */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            data={currentData.revenueData}
            timeframe={selectedDateRange}
          />
        </div>
        <div className="lg:col-span-1">
          <TopCategoriesDonut
            data={currentData.categoryData}
            timeframe={selectedDateRange}
          />
        </div>
      </section>

      {/* D. Data Tables & Alerts (Bottom Row) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable timeframe={selectedDateRange} />
        </div>
        <div className="lg:col-span-1">
          <InventoryAlerts />
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
