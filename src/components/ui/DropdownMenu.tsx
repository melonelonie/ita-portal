import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

export interface DropdownMenuItem {
  type?: 'item' | 'divider';
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  shortcut?: string;
}

export interface DropdownMenuProps {
  trigger: React.ReactElement;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    item.onClick?.();
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-flex ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 top-full mt-1 min-w-[180px]
              ${align === 'right' ? 'right-0' : 'left-0'}
              bg-[#0f0f14] border border-[#27272a] rounded-lg
              shadow-xl shadow-black/30 overflow-hidden py-1
            `}
          >
            {items.map((item, idx) => {
              if (item.type === 'divider') {
                return <div key={idx} className="my-1 border-t border-[#27272a]" />;
              }

              const Icon = item.icon;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left
                    transition-colors duration-100
                    ${item.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : item.danger
                        ? 'text-red-400 hover:bg-red-500/10 cursor-pointer'
                        : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 cursor-pointer'}
                    focus-visible:outline-none focus-visible:bg-white/5
                  `}
                >
                  {Icon && <Icon size={15} className="shrink-0" />}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <span className="text-[10px] text-[#52525b] font-mono ml-auto pl-4">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export { DropdownMenu };
export default DropdownMenu;
