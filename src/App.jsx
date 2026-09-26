import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PosBillingDashboard from './pages/PosBillingDashboard';
import AdminDashboard from './pages/AdminDashboard';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Dashboard route as requested: /admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* POS Bakery Billing System */}
        <Route path="/" element={<PosBillingDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
