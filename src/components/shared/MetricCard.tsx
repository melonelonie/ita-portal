import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  sparklineData?: number[];
  className?: string;
}

const MiniSparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#sparkGradient)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#6366f1"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  sparklineData,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-xl border border-white/10
        bg-white/[0.03] backdrop-blur-xl
        p-5 overflow-hidden
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
              <Icon size={18} className="text-[#6366f1]" />
            </div>
            <span className="text-sm text-[#a1a1aa] font-medium">{label}</span>
          </div>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-bold text-[#fafafa] tracking-tight">{value}</p>
            {trend && (
              <span
                className={`
                  inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md mb-1
                  ${trend.direction === 'up'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-red-400 bg-red-500/10'}
                `}
              >
                {trend.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        {sparklineData && (
          <div className="mt-4">
            <MiniSparkline data={sparklineData} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

MetricCard.displayName = 'MetricCard';

export { MetricCard };
export default MetricCard;
