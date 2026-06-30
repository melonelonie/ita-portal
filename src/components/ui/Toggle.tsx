import React from 'react';
import { motion } from 'framer-motion';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      className={`
        inline-flex items-start gap-3 select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]
          ${checked ? 'bg-[#6366f1]' : 'bg-[#27272a]'}
        `}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          className={`
            absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm
            ${checked ? 'left-5' : 'left-1'}
          `}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col pt-0.5">
          {label && <span className="text-sm font-medium text-[#fafafa]">{label}</span>}
          {description && <span className="text-xs text-[#a1a1aa] mt-0.5">{description}</span>}
        </div>
      )}
    </label>
  );
};

Toggle.displayName = 'Toggle';

export { Toggle };
export default Toggle;
