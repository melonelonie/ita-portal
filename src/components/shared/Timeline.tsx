import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

export interface TimelineItem {
  id: string;
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  details?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-[19px] top-3 bottom-3 w-px bg-[#27272a]" />

      <div className="flex flex-col gap-0">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="relative flex gap-4 py-3"
            >
              {/* Icon */}
              <div
                className={`
                  relative z-10 w-10 h-10 rounded-full shrink-0
                  flex items-center justify-center
                  bg-[#0f0f14] border border-[#27272a]
                  ${item.iconColor || 'text-[#6366f1]'}
                `}
              >
                <Icon size={16} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-[#fafafa] font-medium">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-[#a1a1aa] mt-0.5">{item.description}</p>
                    )}
                  </div>
                  <span className="text-[11px] text-[#52525b] whitespace-nowrap shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                {/* User */}
                {item.user && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[8px] text-white font-bold">
                      {item.user.avatar ? (
                        <img src={item.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        getInitials(item.user.name)
                      )}
                    </div>
                    <span className="text-[11px] text-[#71717a]">{item.user.name}</span>
                  </div>
                )}

                {/* Expandable details */}
                {item.details && (
                  <div className="mt-2 text-xs text-[#71717a] bg-[#18181f] border border-[#27272a] rounded-lg p-3">
                    {item.details}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

Timeline.displayName = 'Timeline';

export { Timeline };
export default Timeline;
