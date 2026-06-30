import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, type LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#18181f] border border-[#27272a] flex items-center justify-center mb-5">
        <Icon size={28} className="text-[#3f3f46]" />
      </div>
      <h3 className="text-lg font-semibold text-[#fafafa] mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-[#a1a1aa] max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="px-4 py-2.5 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#5558e6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export default EmptyState;
