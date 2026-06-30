import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  ChevronDown,
  X,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  dateRange?: { from: string; to: string };
  onDateRangeChange?: (range: { from: string; to: string }) => void;
  statusOptions?: FilterOption[];
  selectedStatuses?: string[];
  onStatusChange?: (statuses: string[]) => void;
  clientOptions?: FilterOption[];
  selectedClients?: string[];
  onClientChange?: (clients: string[]) => void;
  onClearAll?: () => void;
  className?: string;
}

// Self-contained multi-select dropdown for filters
const FilterDropdown: React.FC<{
  label: string;
  icon: React.ReactNode;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}> = ({ label, icon, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val],
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
          transition-all duration-200 whitespace-nowrap
          ${selected.length > 0
            ? 'border-[#6366f1]/40 bg-[#6366f1]/5 text-[#a5b4fc]'
            : 'border-[#27272a] bg-[#0f0f14] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46]'}
        `}
      >
        {icon}
        {label}
        {selected.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#6366f1] text-white text-[10px] flex items-center justify-center font-bold">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 top-full mt-1 left-0 min-w-[200px] bg-[#0f0f14] border border-[#27272a] rounded-lg shadow-xl shadow-black/30 py-1 overflow-hidden"
          >
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                    transition-colors cursor-pointer
                    ${isSelected ? 'text-[#a5b4fc] bg-[#6366f1]/5' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5'}
                  `}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-[#6366f1] border-[#6366f1]' : 'border-[#3f3f46]'}`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  dateRange,
  onDateRangeChange,
  statusOptions = [],
  selectedStatuses = [],
  onStatusChange,
  clientOptions = [],
  selectedClients = [],
  onClientChange,
  onClearAll,
  className = '',
}) => {
  const hasActiveFilters =
    searchValue || selectedStatuses.length > 0 || selectedClients.length > 0 || (dateRange?.from || dateRange?.to);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Search */}
      <div className="relative flex items-center flex-1 min-w-[200px] max-w-sm">
        <Search size={16} className="absolute left-3 text-[#52525b]" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#27272a] bg-[#0f0f14] text-sm text-[#fafafa] placeholder:text-[#52525b] outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30 transition-all"
        />
      </div>

      {/* Date Range */}
      {onDateRangeChange && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input
              type="date"
              value={dateRange?.from || ''}
              onChange={(e) => onDateRangeChange({ from: e.target.value, to: dateRange?.to || '' })}
              className="pl-8 pr-3 py-2 rounded-lg border border-[#27272a] bg-[#0f0f14] text-xs text-[#a1a1aa] outline-none focus:border-[#6366f1] transition-all"
            />
          </div>
          <span className="text-[#52525b] text-xs">to</span>
          <input
            type="date"
            value={dateRange?.to || ''}
            onChange={(e) => onDateRangeChange({ from: dateRange?.from || '', to: e.target.value })}
            className="px-3 py-2 rounded-lg border border-[#27272a] bg-[#0f0f14] text-xs text-[#a1a1aa] outline-none focus:border-[#6366f1] transition-all"
          />
        </div>
      )}

      {/* Status Filter */}
      {statusOptions.length > 0 && onStatusChange && (
        <FilterDropdown
          label="Status"
          icon={<SlidersHorizontal size={14} />}
          options={statusOptions}
          selected={selectedStatuses}
          onChange={onStatusChange}
        />
      )}

      {/* Client Filter */}
      {clientOptions.length > 0 && onClientChange && (
        <FilterDropdown
          label="Client"
          icon={<SlidersHorizontal size={14} />}
          options={clientOptions}
          selected={selectedClients}
          onChange={onClientChange}
        />
      )}

      {/* Clear All */}
      {hasActiveFilters && onClearAll && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onClearAll}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors"
        >
          <X size={14} />
          Clear all
        </motion.button>
      )}
    </div>
  );
};

FilterBar.displayName = 'FilterBar';

export { FilterBar };
export default FilterBar;
