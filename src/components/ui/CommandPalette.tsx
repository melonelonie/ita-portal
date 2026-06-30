import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hash, ArrowRight, Command, type LucideIcon } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  shortcut?: string;
  group: string;
  onSelect: () => void;
  keywords?: string[];
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.keywords?.some((kw) => kw.toLowerCase().includes(q)) ||
        item.group.toLowerCase().includes(q),
    );
  }, [items, query]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  }, [filteredItems]);

  const flatItems = useMemo(() => filteredItems, [filteredItems]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % Math.max(flatItems.length, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + flatItems.length) % Math.max(flatItems.length, 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatItems[activeIndex]) {
            flatItems[activeIndex].onSelect();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [flatItems, activeIndex, onClose],
  );

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  let globalIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`
              relative w-full max-w-xl
              bg-[#0f0f14] border border-[#27272a] rounded-xl
              shadow-2xl shadow-black/50
              overflow-hidden
              ${className}
            `}
            onKeyDown={handleKeyDown}
          >
            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#27272a]">
              <Search size={18} className="text-[#52525b] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-[#fafafa] text-sm placeholder:text-[#52525b] outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#18181f] border border-[#27272a] text-[10px] text-[#52525b]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[400px] overflow-y-auto py-2">
              {flatItems.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-sm text-[#52525b]">No results found</p>
                  <p className="text-xs text-[#3f3f46] mt-1">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedItems).map(([group, groupItems]) => (
                  <div key={group} className="mb-2">
                    <div className="flex items-center gap-2 px-4 py-1.5">
                      <Hash size={12} className="text-[#3f3f46]" />
                      <span className="text-[11px] font-medium text-[#52525b] uppercase tracking-wider">
                        {group}
                      </span>
                    </div>
                    {groupItems.map((item) => {
                      const currentIndex = globalIndex++;
                      const isActive = currentIndex === activeIndex;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          data-active={isActive}
                          onClick={() => {
                            item.onSelect();
                            onClose();
                          }}
                          onMouseEnter={() => setActiveIndex(currentIndex)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-left
                            transition-colors duration-75 cursor-pointer
                            ${isActive ? 'bg-[#6366f1]/10 text-[#fafafa]' : 'text-[#a1a1aa]'}
                          `}
                        >
                          {Icon && (
                            <Icon
                              size={16}
                              className={isActive ? 'text-[#6366f1]' : 'text-[#52525b]'}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{item.label}</p>
                            {item.description && (
                              <p className="text-xs text-[#52525b] truncate mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {item.shortcut && (
                            <kbd className="flex items-center gap-1 text-[10px] text-[#52525b] font-mono">
                              {item.shortcut}
                            </kbd>
                          )}
                          {isActive && (
                            <ArrowRight size={14} className="text-[#6366f1] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[#27272a] text-[11px] text-[#3f3f46]">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[#18181f] border border-[#27272a] font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[#18181f] border border-[#27272a] font-mono">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-[#18181f] border border-[#27272a] font-mono">esc</kbd>
                Close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

CommandPalette.displayName = 'CommandPalette';

export { CommandPalette };
export default CommandPalette;
