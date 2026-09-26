import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Award,
  Calendar,
  X,
  ShoppingBag
} from 'lucide-react';
import { ALL_CUSTOMERS_DATA } from '../../data/adminMockData';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState(ALL_CUSTOMERS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    loyaltyTier: 'Bronze',
  });

  const itemsPerPage = 6;

  // Search filter across Name, Email, and Phone
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        cust.phone.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Gold':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'Silver':
        return 'bg-slate-100 text-slate-800 border border-slate-300';
      case 'Bronze':
        return 'bg-[#4E3636]/10 text-[#4E3636] border border-[#4E3636]/20';
      default:
        return 'bg-[#4E3636]/10 text-[#4E3636]';
    }
  };

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCustomerData.name.trim()) return;

    const newCust = {
      id: `cust-${Date.now()}`,
      name: newCustomerData.name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      email: newCustomerData.email || 'customer@sweetbite.com',
      phone: newCustomerData.phone || '+91 98000 00000',
      totalOrders: 1,
      totalSpent: '₹0',
      loyaltyTier: newCustomerData.loyaltyTier,
      joinedDate: 'Just now',
    };

    setCustomers([newCust, ...customers]);
    setAddCustomerOpen(false);
    setNewCustomerData({ name: '', email: '', phone: '', loyaltyTier: 'Bronze' });
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Search bar (by Name, Email, or Phone) & "Add Customer" button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#4E3636] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by customer name, email, or phone number..."
            className="w-full bg-white text-[#321E1E] text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#4E3636]/20 placeholder-[#4E3636]/50 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 shadow-xs"
          />
        </div>

        {/* Outline style: #116D6E border, white background */}
        <button
          type="button"
          onClick={() => setAddCustomerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-[#116D6E] bg-white text-[#116D6E] hover:bg-[#116D6E] hover:text-white transition-all shadow-xs cursor-pointer select-none"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Data Table: White background, rounded-xl, soft shadow */}
      <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#4E3636]/10 bg-[#FDFBF7]/60">
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#4E3636] uppercase tracking-wider">
                  Loyalty Tier
                </th>
                <th className="py-3 px-5 text-xs font-semibold text-[#4E3636] uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4E3636]/10 text-xs">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-[#FDFBF7]/70 transition-colors"
                  >
                    {/* Customer Name with a small avatar circle */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#4E3636]/15 bg-white"
                        />
                        <div>
                          <div className="font-bold text-[#321E1E]">
                            {cust.name}
                          </div>
                          <div className="text-[10px] text-[#4E3636]/70">
                            Member since {cust.joinedDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info (Email / Phone) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[#321E1E]">
                          <Mail className="w-3 h-3 text-[#4E3636]" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#4E3636]">
                          <Phone className="w-3 h-3 text-[#4E3636]" />
                          <span>{cust.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Total Orders */}
                    <td className="py-3.5 px-4 font-bold text-[#321E1E]">
                      {cust.totalOrders} orders
                    </td>

                    {/* Total Spent */}
                    <td className="py-3.5 px-4 font-bold text-[#116D6E]">
                      {cust.totalSpent}
                    </td>

                    {/* Loyalty Tier Badges */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getTierBadge(
                          cust.loyaltyTier
                        )}`}
                      >
                        <Award className="w-3 h-3" />
                        <span>{cust.loyaltyTier}</span>
                      </span>
                    </td>

                    {/* Action Column: A "View Profile" button (Text #116D6E, hover underline) */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(cust)}
                        className="text-[#116D6E] hover:underline font-semibold text-xs cursor-pointer select-none"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#4E3636]/60">
                    No customers found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination: Bottom right, simple previous/next buttons */}
        <div className="p-4 px-5 bg-[#FDFBF7]/40 border-t border-[#4E3636]/10 flex items-center justify-between text-xs text-[#4E3636]">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{' '}
            {filteredCustomers.length} registered patrons
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-[#4E3636]/20 bg-white text-[#321E1E] hover:bg-[#FDFBF7] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#116D6E] text-white'
                    : 'bg-white border border-[#4E3636]/20 text-[#321E1E] hover:bg-[#FDFBF7]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[#4E3636]/20 bg-white text-[#321E1E] hover:bg-[#FDFBF7] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Profile View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#116D6E] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/40"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">
                    {selectedCustomer.name}
                  </h3>
                  <span className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold ${getTierBadge(selectedCustomer.loyaltyTier)}`}>
                    {selectedCustomer.loyaltyTier} Member
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Lifetime Spend</span>
                  <div className="text-lg font-bold text-[#116D6E] mt-0.5">
                    {selectedCustomer.totalSpent}
                  </div>
                </div>
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Completed Visits</span>
                  <div className="text-lg font-bold text-[#321E1E] mt-0.5">
                    {selectedCustomer.totalOrders} orders
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Email:</span>
                  <span className="font-medium text-[#321E1E]">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Phone:</span>
                  <span className="font-medium text-[#321E1E]">{selectedCustomer.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#4E3636]/10">
                  <span className="text-[#4E3636]">Member Since:</span>
                  <span className="font-medium text-[#321E1E]">{selectedCustomer.joinedDate}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full py-2.5 rounded-xl bg-[#116D6E] text-white font-semibold hover:bg-[#0e5859] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {addCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#116D6E] p-4 px-5 text-white flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">Add New Customer</h3>
              <button onClick={() => setAddCustomerOpen(false)} className="p-1 rounded-lg hover:bg-white/20 text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCustomerSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#321E1E] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                  placeholder="e.g. Sumanth Sen"
                  className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-[#321E1E] mb-1">Email Address</label>
                <input
                  type="email"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                  placeholder="sumanth@example.com"
                  className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-[#321E1E] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                  placeholder="+91 98..."
                  className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-[#321E1E] mb-1">Loyalty Tier</label>
                <select
                  value={newCustomerData.loyaltyTier}
                  onChange={(e) => setNewCustomerData({ ...newCustomerData, loyaltyTier: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#4E3636]/25 bg-white text-xs"
                >
                  <option value="Bronze">Bronze (Standard)</option>
                  <option value="Silver">Silver (Preferred)</option>
                  <option value="Gold">Gold (VIP)</option>
                </select>
              </div>
              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#116D6E] text-white font-bold rounded-xl hover:bg-[#0e5859]">
                  Save Customer
                </button>
                <button type="button" onClick={() => setAddCustomerOpen(false)} className="px-4 py-2.5 bg-white border border-[#4E3636]/20 rounded-xl">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
