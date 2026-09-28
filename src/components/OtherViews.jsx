import React from 'react';
import {
  TrendingUp,
  Package,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
  Printer,
  Sliders,
  DollarSign
} from 'lucide-react';
import { PRODUCTS, CUSTOMERS, INITIAL_RECENT_BILLS } from '../data/mockData';

export const ProductsView = ({ onBackToBilling }) => (
  <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FDFBF7]">
    {/* Page Header */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#321E1E]">Product Catalog Management</h2>
        <p className="text-xs text-[#4E3636] mt-1">Manage active menu items, pricing, inventory thresholds, and categories</p>
      </div>
      <button
        onClick={onBackToBilling}
        className="px-4 py-2 bg-[#116D6E] text-white rounded-xl text-xs font-semibold hover:bg-[#0e5859] transition-colors cursor-pointer shadow-xs active:scale-95"
      >
        Go to POS Billing
      </button>
    </div>

    {/* Table Container: Table header titles are static, rows scroll underneath */}
    <div className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft overflow-hidden">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-[#FDFBF7] border-b border-[#4E3636]/10 text-[#4E3636] font-bold shadow-2xs">
            <tr>
              <th className="p-4 bg-[#FDFBF7]">Item Name</th>
              <th className="p-4 bg-[#FDFBF7]">Category</th>
              <th className="p-4 bg-[#FDFBF7]">Unit</th>
              <th className="p-4 bg-[#FDFBF7]">Price</th>
              <th className="p-4 bg-[#FDFBF7]">Stock</th>
              <th className="p-4 bg-[#FDFBF7]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4E3636]/10">
            {PRODUCTS.map((prod) => (
              <tr key={prod.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <div className="font-bold text-[#321E1E]">{prod.name}</div>
                    <div className="text-[11px] text-[#4E3636] line-clamp-1">{prod.description}</div>
                  </div>
                </td>
                <td className="p-4 text-[#4E3636] font-medium">{prod.category}</td>
                <td className="p-4 text-[#4E3636]">{prod.unit}</td>
                <td className="p-4 font-bold text-[#321E1E]">₹{prod.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    prod.stock > 10
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {prod.stock} pcs left
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export { OrdersView } from './OrdersView';
export { CategoriesView } from './CategoriesView';

export const CustomersView = ({ onBackToBilling }) => (
  <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FDFBF7]">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#321E1E]">Sweet Club &bull; Customer Directory</h2>
        <p className="text-xs text-[#4E3636] mt-1">Customer profiles, VIP club tiers, loyalty points, and purchase frequency</p>
      </div>
      <button
        onClick={onBackToBilling}
        className="px-4 py-2 bg-[#116D6E] text-white rounded-xl text-xs font-semibold hover:bg-[#0e5859] transition-colors"
      >
        Go to POS Billing
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {CUSTOMERS.map((cust) => (
        <div key={cust.id} className="bg-white p-5 rounded-2xl border border-[#4E3636]/15 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-sm text-[#321E1E]">{cust.name}</h4>
              <p className="text-xs text-[#4E3636] mt-0.5">{cust.phone}</p>
            </div>
            {cust.discountEligible && (
              <span className="px-2 py-0.5 rounded-full bg-[#116D6E]/10 text-[#116D6E] text-[10px] font-bold">
                10% VIP
              </span>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-[#4E3636]/10 flex items-center justify-between text-xs text-[#4E3636]">
            <span>Total Visits: <strong className="text-[#321E1E]">{cust.visits}</strong></span>
            <span className="text-[#116D6E] font-semibold cursor-pointer">View History &rarr;</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const InventoryView = ({ onBackToBilling }) => (
  <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FDFBF7]">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#321E1E]">Raw Material &amp; Ingredient Stock</h2>
        <p className="text-xs text-[#4E3636] mt-1">Flour, cultured butter, Belgian cocoa, Madagascar vanilla, yeast, and packaging</p>
      </div>
      <button
        onClick={onBackToBilling}
        className="px-4 py-2 bg-[#116D6E] text-white rounded-xl text-xs font-semibold hover:bg-[#0e5859] transition-colors"
      >
        Go to POS Billing
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'French T55 Flour', qty: '120 kg', status: 'Healthy', color: 'text-emerald-700' },
        { label: 'Normandy Butter', qty: '18 kg', status: 'Low Stock', color: 'text-amber-700' },
        { label: 'Valrhona Chocolate', qty: '35 kg', status: 'Healthy', color: 'text-emerald-700' },
        { label: 'Bio Degradable Boxes', qty: '450 pcs', status: 'Healthy', color: 'text-emerald-700' },
      ].map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-xl border border-[#4E3636]/15 shadow-soft">
          <div className="text-xs text-[#4E3636]">{item.label}</div>
          <div className="text-xl font-bold text-[#321E1E] mt-1">{item.qty}</div>
          <div className={`text-xs font-semibold mt-1 ${item.color}`}>{item.status}</div>
        </div>
      ))}
    </div>
  </div>
);

export const ReportsView = ({ onBackToBilling }) => (
  <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FDFBF7]">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#321E1E]">Daily Sales &amp; Revenue Analytics</h2>
        <p className="text-xs text-[#4E3636] mt-1">Shift performance, top bakery categories, payment method breakdowns</p>
      </div>
      <button
        onClick={onBackToBilling}
        className="px-4 py-2 bg-[#116D6E] text-white rounded-xl text-xs font-semibold hover:bg-[#0e5859] transition-colors"
      >
        Go to POS Billing
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
      <div className="bg-white p-5 rounded-2xl border border-[#4E3636]/15 shadow-soft">
        <span className="text-xs text-[#4E3636]">Today&apos;s Gross Sales</span>
        <div className="text-3xl font-extrabold text-[#CD1818] mt-1">₹42,850</div>
        <span className="text-xs font-semibold text-emerald-700 mt-1 inline-block">+14.2% vs yesterday</span>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-[#4E3636]/15 shadow-soft">
        <span className="text-xs text-[#4E3636]">Invoices Settled</span>
        <div className="text-3xl font-extrabold text-[#116D6E] mt-1">68 Bills</div>
        <span className="text-xs text-[#4E3636] mt-1 inline-block">Avg. Ticket: ₹630</span>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-[#4E3636]/15 shadow-soft">
        <span className="text-xs text-[#4E3636]">Top Category</span>
        <div className="text-3xl font-extrabold text-[#321E1E] mt-1">Pastries</div>
        <span className="text-xs text-[#4E3636] mt-1 inline-block">42% of revenue</span>
      </div>
    </div>
  </div>
);

export const SettingsView = ({ onBackToBilling }) => (
  <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FDFBF7]">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#321E1E]">POS &amp; Bakery Settings</h2>
        <p className="text-xs text-[#4E3636] mt-1">Store details, thermal printer configuration, taxes &amp; currency setup</p>
      </div>
      <button
        onClick={onBackToBilling}
        className="px-4 py-2 bg-[#116D6E] text-white rounded-xl text-xs font-semibold hover:bg-[#0e5859] transition-colors"
      >
        Go to POS Billing
      </button>
    </div>

    <div className="bg-white rounded-2xl border border-[#4E3636]/15 shadow-soft p-6 max-w-2xl space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-[#321E1E] mb-1">Bakery Name</label>
          <input type="text" defaultValue="SweetBite Artisan Bakery" className="w-full p-2.5 rounded-lg border border-[#4E3636]/20" />
        </div>
        <div>
          <label className="block font-bold text-[#321E1E] mb-1">Currency Symbol</label>
          <input type="text" defaultValue="₹ (INR)" className="w-full p-2.5 rounded-lg border border-[#4E3636]/20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-[#321E1E] mb-1">Default GST / Tax Rate (%)</label>
          <input type="number" defaultValue={5} className="w-full p-2.5 rounded-lg border border-[#4E3636]/20" />
        </div>
        <div>
          <label className="block font-bold text-[#321E1E] mb-1">Receipt Printer Paper Size</label>
          <select className="w-full p-2.5 rounded-lg border border-[#4E3636]/20 bg-white">
            <option>80mm Thermal (Standard POS)</option>
            <option>58mm Thermal Mini</option>
            <option>A4 Laser / PDF</option>
          </select>
        </div>
      </div>
      <div className="pt-4 border-t border-[#4E3636]/10 flex justify-end">
        <button className="px-5 py-2.5 bg-[#116D6E] text-white font-semibold rounded-xl hover:bg-[#0e5859] transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  </div>
);
