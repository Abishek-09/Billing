import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export const AdminLayout = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('This Week');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FDFBF7] text-[#321E1E]">
      {/* 1. Left Sidebar (Fixed 240px Width, #116D6E Deep Teal) */}
      <AdminSidebar />

      {/* 2. Main Area (Flexible Width, #FDFBF7 Background) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FDFBF7] relative">
        {/* Fixed / Sticky Header with dynamic route page title and live Date Range syncing */}
        <AdminHeader
          selectedDateRange={selectedDateRange}
          onSelectDateRange={setSelectedDateRange}
        />

        {/* Scrollable Main Area wrapping all child pages in p-8 max-w-7xl */}
        <main className="flex-1 overflow-y-auto bg-[#FDFBF7]">
          <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
            <Outlet context={{ selectedDateRange, setSelectedDateRange }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
