import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  searchable?: boolean;
  multi?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  searchable = false,
  multi = false,
  clearable = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedValues = multi
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' ? [value] : []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = useCallback(
    (optValue: string) => {
      if (multi) {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(optValue)
          ? current.filter((v) => v !== optValue)
          : [...current, optValue];
        onChange?.(next);
      } else {
        onChange?.(optValue);
        setIsOpen(false);
      }
      setSearch('');
    },
    [multi, value, onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multi ? [] : '');
    },
    [multi, onChange],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const displayValue = () => {
    if (selectedValues.length === 0) return null;
    if (multi) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[#6366f1]/10 text-[#a5b4fc] rounded-md border border-[#6366f1]/20"
              >
                {opt?.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(v);
                  }}
                  className="hover:text-white"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      );
    }
    const opt = options.find((o) => o.value === selectedValues[0]);
    return <span className="text-[#fafafa] text-sm">{opt?.label}</span>;
  };

  const hasValue = selectedValues.length > 0;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-[#fafafa]">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left
            bg-[#0f0f14] transition-all duration-200
            ${isOpen ? 'border-[#6366f1] ring-1 ring-[#6366f1]/30' : 'border-[#27272a]'}
            ${error ? 'border-red-500 ring-1 ring-red-500/30' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]
          `}
        >
          <div className="flex-1 min-w-0">
            {hasValue ? displayValue() : (
              <span className="text-sm text-[#52525b]">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {clearable && hasValue && (
              <span
                role="button"
                onClick={handleClear}
                className="p-0.5 rounded hover:bg-white/10 text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
              >
                <X size={14} />
              </span>
            )}
            <ChevronDown
              size={16}
              className={`text-[#a1a1aa] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1 rounded-lg border border-[#27272a] bg-[#0f0f14] shadow-xl shadow-black/30 overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-[#27272a]">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#18181f]">
                    <Search size={14} className="text-[#52525b]" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      className="flex-1 bg-transparent text-sm text-[#fafafa] placeholder:text-[#52525b] outline-none"
                    />
                  </div>
                </div>
              )}
              <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-[#52525b]">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = selectedValues.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => handleSelect(opt.value)}
                        className={`
                          w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                          transition-colors duration-100
                          ${isSelected ? 'text-[#a5b4fc] bg-[#6366f1]/5' : 'text-[#a1a1aa]'}
                          ${opt.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5 hover:text-[#fafafa] cursor-pointer'}
                        `}
                      >
                        {multi && (
                          <span
                            className={`
                              flex items-center justify-center w-4 h-4 rounded border transition-all
                              ${isSelected ? 'bg-[#6366f1] border-[#6366f1]' : 'border-[#3f3f46]'}
                            `}
                          >
                            {isSelected && <Check size={12} className="text-white" />}
                          </span>
                        )}
                        <span className="flex-1">{opt.label}</span>
                        {!multi && isSelected && (
                          <Check size={14} className="text-[#6366f1]" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

Select.displayName = 'Select';

export { Select };
export default Select;
