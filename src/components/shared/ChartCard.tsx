import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  legendItems?: Array<{ label: string; color: string }>;
  action?: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  legendItems,
  action,
  className = '',
}) => {
  const [showLegend, setShowLegend] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-xl border border-white/10
        bg-white/[0.03] backdrop-blur-xl
        overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#fafafa]">{title}</h3>
          {subtitle && (
            <p className="text-xs text-[#a1a1aa] mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {legendItems && legendItems.length > 0 && (
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="text-xs text-[#52525b] hover:text-[#a1a1aa] transition-colors"
            >
              {showLegend ? 'Hide' : 'Show'} legend
            </button>
          )}
          {action}
        </div>
      </div>

      {/* Legend */}
      {showLegend && legendItems && legendItems.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-5 pb-2">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] text-[#71717a]">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Chart Body */}
      <div className="px-5 pb-5 pt-2">
        {children}
      </div>
    </motion.div>
  );
};

ChartCard.displayName = 'ChartCard';

export { ChartCard };
export default ChartCard;
