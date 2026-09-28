import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Store,
  Receipt,
  Users,
  Percent,
  Sliders,
  Sparkles
} from 'lucide-react';
import { INITIAL_SETTINGS } from '../../data/adminMockData';

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('Store Info');
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saveToast, setSaveToast] = useState(false);

  const TABS = ['Store Info', 'Tax & Billing', 'Receipt Design', 'User Management'];

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Title "System Settings" & "Save Changes" button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#321E1E]">
            System Settings
          </h2>
          <p className="text-xs text-[#4E3636] mt-0.5">
            Configure bakery branding, tax compliance, receipts, and staff roles
          </p>
        </div>

        {/* Primary button: #116D6E background, white text */}
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-95 text-white text-xs font-bold shadow-teal transition-all cursor-pointer select-none"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Save Toast Feedback */}
      {saveToast && (
        <div className="p-3 bg-[#116D6E]/10 border border-[#116D6E]/20 text-[#116D6E] rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#116D6E]" />
          <span>Settings saved and synced across all SweetBite POS registers!</span>
        </div>
      )}

      {/* Tabbed Interface: Horizontal tabs for "Store Info", "Tax & Billing", "Receipt Design", "User Management"
          Active tab has #116D6E text and a bottom border */}
      <div className="flex items-center gap-4 sm:gap-8 border-b border-[#4E3636]/15 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-semibold transition-colors cursor-pointer relative ${
                isActive
                  ? 'text-[#116D6E] font-bold border-b-2 border-[#116D6E]'
                  : 'text-[#4E3636] hover:text-[#321E1E]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Store Info Form (White card, rounded-xl, soft shadow, responsive padding) */}
      {activeTab === 'Store Info' && (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 p-5 sm:p-8 space-y-6">
          <div className="border-b border-[#4E3636]/10 pb-4">
            <h3 className="font-serif text-lg font-bold text-[#321E1E]">
              Store &amp; Branch Identity
            </h3>
            <p className="text-xs text-[#4E3636] mt-0.5">
              These details appear on thermal printed receipts, proforma invoices, and customer loyalty emails.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Store Name */}
            <div>
              <label className="block font-bold text-[#321E1E] mb-2 uppercase tracking-wider text-[11px]">
                Bakery Store Name *
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#4E3636]/30 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs font-medium"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-[#321E1E] mb-2 uppercase tracking-wider text-[11px]">
                Official Contact Email *
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#4E3636]/30 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs font-medium"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-bold text-[#321E1E] mb-2 uppercase tracking-wider text-[11px]">
                Phone Number *
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#4E3636]/30 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs font-medium"
              />
            </div>

            {/* Physical Address */}
            <div>
              <label className="block font-bold text-[#321E1E] mb-2 uppercase tracking-wider text-[11px]">
                Physical Store Address *
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#4E3636]/30 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs font-medium"
              />
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Tax & Billing Form */}
      {activeTab === 'Tax & Billing' && (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 p-5 sm:p-8 space-y-6">
          <div className="border-b border-[#4E3636]/10 pb-4">
            <h3 className="font-serif text-lg font-bold text-[#321E1E]">
              Tax Compliance &amp; Invoice Numbering
            </h3>
            <p className="text-xs text-[#4E3636] mt-0.5">
              Specify statutory GST percentages, currency prefixes, and automated printing toggles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            {/* Tax Rate (%) */}
            <div>
              <label className="block font-bold text-[#321E1E] mb-2 uppercase tracking-wider text-[11px]">
                GST / Tax Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 rounded-xl border border-[#4E3636]/30 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs font-medium"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4E3636]">
                  %
                </span>
              </div>
            </div>

            {/* Currency Symbol */}
            <div>
              <label className="block font-bold text-[#321E1E] mb-2 uppercase tracking-wider text-[11px]">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#4E3636]/30 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs font-medium"
              />
            </div>

            {/* Invoice Prefix */}
            <div>
              <label className="block font-bold text-[#321E1E] mb-2 uppercase tracking-wider text-[11px]">
                Invoice Prefix
              </label>
              <input
                type="text"
                value={settings.invoicePrefix}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                placeholder="#SB or #BIL"
                className="w-full p-3 rounded-xl border border-[#4E3636]/30 focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 text-[#321E1E] text-xs font-medium"
              />
            </div>
          </div>

          {/* Toggle switches for "Enable Loyalty Points" and "Print Receipt Automatically"
              Toggle active state should be #116D6E */}
          <div className="pt-4 border-t border-[#4E3636]/10 space-y-4">
            <h4 className="font-bold text-[#321E1E] text-xs uppercase tracking-wider">
              Operational Automation &amp; POS Toggles
            </h4>

            {/* Toggle 1: Enable Loyalty Points */}
            <div className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
              <div>
                <span className="font-bold text-[#321E1E] text-xs">
                  Enable Sweet Club Loyalty Points
                </span>
                <p className="text-[11px] text-[#4E3636] mt-0.5">
                  Customers earn 1 point for every ₹10 spent, unlockable on future purchases.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, enableLoyaltyPoints: !settings.enableLoyaltyPoints })}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 select-none ${
                  settings.enableLoyaltyPoints ? 'bg-[#116D6E]' : 'bg-[#4E3636]/25'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    settings.enableLoyaltyPoints ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Print Receipt Automatically */}
            <div className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10">
              <div>
                <span className="font-bold text-[#321E1E] text-xs">
                  Print Receipt Automatically
                </span>
                <p className="text-[11px] text-[#4E3636] mt-0.5">
                  Send silent ESC/POS thermal print command immediately upon payment confirmation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, printReceiptAutomatically: !settings.printReceiptAutomatically })}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 select-none ${
                  settings.printReceiptAutomatically ? 'bg-[#116D6E]' : 'bg-[#4E3636]/25'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    settings.printReceiptAutomatically ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Receipt Design */}
      {activeTab === 'Receipt Design' && (
        <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 p-5 sm:p-8 space-y-4 text-xs">
          <h3 className="font-serif text-lg font-bold text-[#321E1E]">
            Thermal Receipt Template (80mm)
          </h3>
          <p className="text-[#4E3636]">
            Configure customized store header notes, legal FSSAI disclosures, and custom QR codes printed on physical slips.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-[#321E1E] mb-1">Receipt Header Tagline</label>
              <input type="text" defaultValue="Freshly Baked Happiness" className="w-full p-2.5 rounded-xl border border-[#4E3636]/25" />
            </div>
            <div>
              <label className="block font-bold text-[#321E1E] mb-1">FSSAI License No.</label>
              <input type="text" defaultValue="11521000000452" className="w-full p-2.5 rounded-xl border border-[#4E3636]/25" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: User Management */}
      {activeTab === 'User Management' && (
        <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 p-5 sm:p-8 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#321E1E]">
                Staff &amp; Cashier Accounts
              </h3>
              <p className="text-[#4E3636]">
                Manage terminal PINs, cashier shift access, and supervisor permissions.
              </p>
            </div>
            <button className="px-3.5 py-2 bg-[#116D6E] text-white rounded-lg font-bold text-xs">
              + Add Cashier
            </button>
          </div>

          <div className="divide-y divide-[#4E3636]/10 pt-2">
            {[
              { name: 'Chef Marie Laurent', role: 'Head Baker &bull; Super Admin', status: 'Active' },
              { name: 'Arjun Roy', role: 'Cashier Terminal 01', status: 'Active' },
              { name: 'Chloe Dubois', role: 'Kitchen Supervisor', status: 'Shift Off' },
            ].map((usr, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#321E1E]">{usr.name}</span>
                  <div className="text-[11px] text-[#4E3636]" dangerouslySetInnerHTML={{ __html: usr.role }} />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#116D6E]/10 text-[#116D6E]">
                  {usr.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
