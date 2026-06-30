import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, type LucideIcon } from 'lucide-react';

export type InputVariant = 'default' | 'search';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: InputVariant;
  prefixIcon?: LucideIcon;
  suffixIcon?: LucideIcon;
  onSuffixClick?: () => void;
  className?: string;
  wrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      variant = 'default',
      prefixIcon: PrefixIcon,
      suffixIcon: SuffixIcon,
      onSuffixClick,
      className = '',
      wrapperClassName = '',
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isSearch = variant === 'search';
    const ActualPrefixIcon = isSearch ? Search : PrefixIcon;

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#fafafa]"
          >
            {label}
          </label>
        )}
        <div
          className={`
            relative flex items-center rounded-lg border transition-all duration-200
            bg-[#0f0f14]
            ${focused ? 'border-[#6366f1] ring-1 ring-[#6366f1]/30' : 'border-[#27272a]'}
            ${error ? 'border-red-500 ring-1 ring-red-500/30' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {ActualPrefixIcon && (
            <span className="pl-3 text-[#a1a1aa]">
              <ActualPrefixIcon size={16} />
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              flex-1 bg-transparent px-3 py-2.5 text-sm text-[#fafafa]
              placeholder:text-[#52525b] outline-none
              disabled:cursor-not-allowed
              ${ActualPrefixIcon ? 'pl-2' : ''}
              ${SuffixIcon ? 'pr-2' : ''}
              ${className}
            `}
            {...props}
          />
          {SuffixIcon && (
            <button
              type="button"
              onClick={onSuffixClick}
              className="pr-3 text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
              tabIndex={-1}
            >
              <SuffixIcon size={16} />
            </button>
          )}
          {error && !SuffixIcon && (
            <span className="pr-3 text-red-400">
              <AlertCircle size={16} />
            </span>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-red-400"
            >
              {error}
            </motion.p>
          )}
          {helperText && !error && (
            <p className="text-xs text-[#71717a]">{helperText}</p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export default Input;
