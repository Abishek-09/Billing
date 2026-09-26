import React, { useState } from 'react';
import { AlertTriangle, Plus, Check, RefreshCw } from 'lucide-react';
import { LOW_STOCK_ALERTS } from '../../data/adminMockData';

export const InventoryAlerts = () => {
  const [alerts, setAlerts] = useState(LOW_STOCK_ALERTS);
  const [restockedIds, setRestockedIds] = useState({});

  const handleRestock = (id) => {
    setRestockedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAlerts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stockLeft: item.stockLeft + 15 } : item
        )
      );
      setRestockedIds((prev) => ({ ...prev, [id]: false }));
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-[#4E3636]/10 p-5 flex flex-col justify-between">
      {/* Title Section with Warning Icon in #CD1818 */}
      <div className="flex items-center justify-between pb-3 border-b border-[#4E3636]/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#CD1818]/10 flex items-center justify-center text-[#CD1818]">
            <AlertTriangle className="w-4 h-4 text-[#CD1818] stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#321E1E]">
              Inventory Alerts
            </h2>
            <p className="text-xs text-[#4E3636]">
              {alerts.length} critical items below threshold
            </p>
          </div>
        </div>

        <span className="w-2.5 h-2.5 rounded-full bg-[#CD1818] animate-pulse" />
      </div>

      {/* Low Stock Item List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
        {alerts.map((item) => {
          const isRestocking = restockedIds[item.id];

          return (
            <div
              key={item.id}
              className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/10 flex items-center justify-between gap-3 hover:border-[#116D6E]/30 transition-all"
            >
              {/* Item Info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover border border-[#4E3636]/10 bg-white shrink-0"
                />
                <div className="min-w-0 text-left">
                  <h4 className="text-xs font-bold text-[#321E1E] truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs font-extrabold text-[#CD1818]">
                      {item.stockLeft} left
                    </span>
                    <span className="text-[10px] text-[#4E3636]/60">
                      &bull; min {item.minThreshold} {item.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Restock Button:
                  Outline style: border #116D6E, text #116D6E.
                  On hover: fill #116D6E, text white. */}
              <button
                type="button"
                onClick={() => handleRestock(item.id)}
                disabled={isRestocking}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#116D6E] text-[#116D6E] hover:bg-[#116D6E] hover:text-white active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1 select-none"
              >
                {isRestocking ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Restock</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Quick Order Alert */}
      <div className="mt-4 pt-3 border-t border-[#4E3636]/10 flex items-center justify-between text-xs text-[#4E3636]">
        <span>Auto-replenishment</span>
        <span className="font-semibold text-[#116D6E] cursor-pointer hover:underline">
          Supplier Dispatch &rarr;
        </span>
      </div>
    </div>
  );
};

export default InventoryAlerts;
