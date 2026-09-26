import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopHeader from '../components/admin/AdminTopHeader';
import KpiCard from '../components/admin/KpiCard';
import RevenueChart from '../components/admin/RevenueChart';
import TopCategoriesDonut from '../components/admin/TopCategoriesDonut';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import InventoryAlerts from '../components/admin/InventoryAlerts';
import { ADMIN_KPI_DATA } from '../data/adminMockData';
import { DollarSign, ShoppingBag, CreditCard, Users } from 'lucide-react';

const KPI_ICONS = {
  'kpi-1': DollarSign,
  'kpi-2': ShoppingBag,
  'kpi-3': CreditCard,
  'kpi-4': Users,
};

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedDateRange, setSelectedDateRange] = useState('This Week');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FDFBF7] text-[#321E1E]">
      {/* 1. Left Sidebar (Navigation) - Width: 240px (Fixed) */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      {/* 2. Main Content Area - Flexible Width */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FDFBF7] relative">
        {/* A. Top Header Bar */}
        <AdminTopHeader
          selectedDateRange={selectedDateRange}
          onSelectDateRange={setSelectedDateRange}
          unreadNotifications={3}
        />

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* B. KPI Metrics Cards (Top Row) - Grid of 4 Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADMIN_KPI_DATA.map((kpi) => (
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

          {/* C. Analytics Section (Middle Row) - Grid (2/3 width and 1/3 width) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <div className="lg:col-span-1">
              <TopCategoriesDonut />
            </div>
          </section>

          {/* D. Data Tables & Alerts (Bottom Row) - Grid (2/3 width and 1/3 width) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
            <div className="lg:col-span-2">
              <RecentOrdersTable />
            </div>
            <div className="lg:col-span-1">
              <InventoryAlerts />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
