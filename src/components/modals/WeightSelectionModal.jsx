import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Scale,
  Check,
  Percent,
  Receipt,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  calculateWeightPricing,
  formatWeight,
  formatINR,
  normalizeWeightToGrams,
  round2
} from '../../services/weightCalculationService';

export const WeightSelectionModal = ({
  isOpen,
  onClose,
  product,
  onConfirmWeight,
}) => {
  if (!isOpen || !product) return null;

  const sellingPricePerKg = Number(product.sellingPrice || product.price || 0);
  const purchasePricePerKg = Number(product.purchasePrice || product.buyPrice || 0);
  const gstRate = Number(product.gstRate ?? 5);
  const presets = product.weightOptions && product.weightOptions.length > 0
    ? product.weightOptions
    : [250, 500, 750, 1000];

  // State: selectedPreset (number in grams, or null if custom), customInput (string), customUnit ('g' | 'kg')
  const defaultGram = product.defaultWeight || presets[1] || 500;
  const [selectedPreset, setSelectedPreset] = useState(defaultGram);
  const [customInput, setCustomInput] = useState(defaultGram.toString());
  const [customUnit, setCustomUnit] = useState('g');
  const [inputError, setInputError] = useState('');
  const customInputRef = useRef(null);

  // Focus custom input on open
  useEffect(() => {
    setSelectedPreset(defaultGram);
    setCustomInput(defaultGram.toString());
    setCustomUnit('g');
    setInputError('');
    setTimeout(() => {
      customInputRef.current?.focus();
      customInputRef.current?.select();
    }, 50);
  }, [product, defaultGram]);

  // Derived current weight in grams
  const currentGrams = useMemo(() => {
    return normalizeWeightToGrams(customInput, customUnit);
  }, [customInput, customUnit]);

  // Live Pricing Calculation
  const pricing = useMemo(() => {
    return calculateWeightPricing({
      sellingPricePerKg,
      purchasePricePerKg,
      gstRate,
      grams: currentGrams,
    });
  }, [sellingPricePerKg, purchasePricePerKg, gstRate, currentGrams]);

  // Handle Preset Click
  const handleSelectPreset = (gramVal) => {
    setSelectedPreset(gramVal);
    setInputError('');
    if (customUnit === 'kg') {
      setCustomInput((gramVal / 1000).toString());
    } else {
      setCustomInput(gramVal.toString());
    }
  };

  // Handle Custom Input Change
  const handleCustomInputChange = (e) => {
    const val = e.target.value;
    // Allow empty or positive float/integer numbers
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setCustomInput(val);

      const parsedGrams = normalizeWeightToGrams(val, customUnit);

      // Check presets match
      const matchingPreset = presets.find((p) => p === parsedGrams);
      setSelectedPreset(matchingPreset || null);

      if (parsedGrams > 50000) {
        setInputError('Maximum weight limit is 50 kg (50,000 g)');
      } else {
        setInputError('');
      }
    }
  };

  // Toggle Custom Unit (g <-> kg)
  const handleToggleUnit = (newUnit) => {
    if (newUnit === customUnit) return;
    const g = normalizeWeightToGrams(customInput, customUnit);
    setCustomUnit(newUnit);
    if (newUnit === 'kg') {
      setCustomInput(g === 0 ? '' : (g / 1000).toString());
    } else {
      setCustomInput(g === 0 ? '' : g.toString());
    }
  };

  // Confirm and Add to Bill
  const handleConfirm = () => {
    if (currentGrams <= 0 || currentGrams > 50000) {
      setInputError('Please enter a valid weight between 1g and 50 kg.');
      return;
    }

    onConfirmWeight(product, {
      grams: currentGrams,
      displayWeight: pricing.displayWeight,
      sellingAmountBeforeGst: pricing.sellingAmountBeforeGst,
      gstRate: pricing.gstRate,
      gstAmount: pricing.gstAmount,
      customerAmount: pricing.customerAmount,
      profit: pricing.profit,
      marginPercent: pricing.marginPercent,
      ratePerKg: sellingPricePerKg,
      purchaseRatePerKg: purchasePricePerKg,
    });
    onClose();
  };

  // Global Keyboard Navigation (Enter to submit, Escape to close)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const isAddDisabled = currentGrams <= 0 || currentGrams > 50000;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#321E1E]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-soft-lg border border-[#4E3636]/15 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* 1. Modal Header */}
        <div className="p-4 sm:p-5 bg-[#116D6E] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/20">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg leading-tight">
                Select Portion Weight
              </h3>
              <p className="text-[11px] text-white/80 mt-0.5">
                {product.name} &bull; <span className="font-semibold">{product.category}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Close dialog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Rate Card Banner */}
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E3636]">
                Catalog Rate:
              </span>
              <span className="text-sm font-extrabold text-[#321E1E]">
                {formatINR(sellingPricePerKg)} <span className="text-xs font-normal text-[#4E3636]">/ kg</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-[#CD1818]/10 text-[#CD1818] border border-[#CD1818]/20">
                {gstRate}% GST Applicable
              </span>
            </div>
          </div>

          {/* 3. Predefined Weight Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#4E3636]">
                Predefined Portions
              </label>
              <span className="text-[10px] text-[#4E3636]/70">
                Click preset or type custom below
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {presets.map((gramVal) => {
                const isSelected = selectedPreset === gramVal;
                const presetPricing = calculateWeightPricing({
                  sellingPricePerKg,
                  purchasePricePerKg,
                  gstRate,
                  grams: gramVal,
                });

                return (
                  <button
                    key={gramVal}
                    type="button"
                    onClick={() => handleSelectPreset(gramVal)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#116D6E]/10 border-[#116D6E] shadow-xs ring-1 ring-[#116D6E]'
                        : 'bg-white border-[#4E3636]/15 hover:border-[#116D6E]/50 hover:bg-[#FDFBF7]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#321E1E]">
                        {formatWeight(gramVal)}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#116D6E] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] font-extrabold text-[#116D6E]">
                      {formatINR(presetPricing.customerAmount)}
                    </div>
                    <div className="text-[9px] text-[#4E3636]/70 mt-0.5">
                      Inc. GST
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Custom Weight Input */}
          <div className="p-3.5 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#4E3636]">
                Custom Weight Entry
              </label>

              {/* Unit Toggle: Grams vs Kg */}
              <div className="bg-white p-0.5 rounded-lg border border-[#4E3636]/20 flex items-center">
                <button
                  type="button"
                  onClick={() => handleToggleUnit('g')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    customUnit === 'g'
                      ? 'bg-[#116D6E] text-white shadow-2xs'
                      : 'text-[#4E3636] hover:text-[#321E1E]'
                  }`}
                >
                  Grams (g)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleUnit('kg')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    customUnit === 'kg'
                      ? 'bg-[#116D6E] text-white shadow-2xs'
                      : 'text-[#4E3636] hover:text-[#321E1E]'
                  }`}
                >
                  Kilograms (kg)
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                ref={customInputRef}
                type="text"
                value={customInput}
                onChange={handleCustomInputChange}
                placeholder={customUnit === 'g' ? 'e.g. 750' : 'e.g. 0.75'}
                className="w-full pl-3.5 pr-14 py-2 bg-white rounded-xl border border-[#4E3636]/20 focus:border-[#116D6E] text-sm font-bold text-[#321E1E] outline-none transition-all shadow-inner-soft placeholder:font-normal placeholder:text-[#4E3636]/40"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4E3636]/70">
                {customUnit}
              </span>
            </div>

            {/* Helper Text & Error Guard */}
            <div className="flex items-center justify-between text-[11px]">
              {inputError ? (
                <span className="text-[#CD1818] font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{inputError}</span>
                </span>
              ) : (
                <span className="text-[#4E3636]/70">
                  Equivalent to: <strong className="text-[#116D6E] font-bold">{formatWeight(currentGrams)}</strong> {currentGrams > 0 && `(${(currentGrams / 1000).toFixed(3)} kg)`}
                </span>
              )}
            </div>
          </div>

          {/* 5. Live Calculation & Tax Breakdown Card */}
          <div className="p-3.5 bg-white rounded-xl border border-[#4E3636]/15 shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#4E3636]/10 pb-2">
              <span className="text-[11px] font-bold text-[#4E3636] uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-[#116D6E]" />
                <span>Portion Ledger Breakdown</span>
              </span>
              <span className="font-mono text-[10px] text-[#4E3636] font-bold">
                {pricing.displayWeight} portion
              </span>
            </div>

            <div className="space-y-1.5 pt-1 text-xs text-[#4E3636]">
              {/* Pre-GST Amount */}
              <div className="flex items-center justify-between">
                <span>Base Amount (Pre-GST):</span>
                <span className="font-semibold text-[#321E1E]">
                  {formatINR(pricing.sellingAmountBeforeGst)}
                </span>
              </div>

              {/* GST Tax Amount */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>GST Output Tax ({gstRate}%):</span>
                </span>
                <span className="font-semibold text-[#CD1818]">
                  +{formatINR(pricing.gstAmount)}
                </span>
              </div>

              {/* Estimated Margin Preview */}
              <div className="flex items-center justify-between text-[11px] text-[#116D6E] pt-1 border-t border-dashed border-[#4E3636]/15">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Gross Margin Preview:</span>
                </span>
                <span className="font-bold">
                  {formatINR(pricing.profit)} ({pricing.marginPercent}%)
                </span>
              </div>

              {/* Total Customer Price */}
              <div className="flex items-center justify-between font-bold text-sm text-[#321E1E] pt-2 border-t border-[#4E3636]/20">
                <span>CUSTOMER TOTAL:</span>
                <span className="text-base text-[#116D6E] font-extrabold">
                  {formatINR(pricing.customerAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Modal Footer Actions */}
        <div className="p-4 bg-[#FDFBF7] border-t border-[#4E3636]/15 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-[#FDFBF7] text-[#4E3636] hover:text-[#321E1E] rounded-xl text-xs font-semibold border border-[#4E3636]/20 transition-all cursor-pointer active:scale-95 shadow-2xs"
          >
            Cancel (Esc)
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isAddDisabled}
            className="flex-1 max-w-[280px] py-2.5 px-4 bg-[#116D6E] hover:bg-[#0e5859] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-teal transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Add to Bill &bull; {formatINR(pricing.customerAmount)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightSelectionModal;
