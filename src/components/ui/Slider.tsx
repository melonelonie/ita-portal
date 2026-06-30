import React, { useRef, useCallback, useState, useEffect } from 'react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  disabled = false,
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + ratio * (max - min);
      const stepped = Math.round(rawValue / step) * step;
      const clamped = Math.max(min, Math.min(max, stepped));
      onChange(parseFloat(clamped.toFixed(10)));
    },
    [min, max, step, onChange, disabled],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      setDragging(true);
      updateValue(e.clientX);
    },
    [disabled, updateValue],
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
    const handleMouseUp = () => setDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, updateValue]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium text-[#fafafa]">{label}</span>}
          {showValue && (
            <span className="text-sm font-mono text-[#6366f1]">{value}</span>
          )}
        </div>
      )}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        className={`
          relative h-2 rounded-full cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          bg-[#27272a]
        `}
      >
        {/* Fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-[#6366f1] transition-[width] duration-75"
          style={{ width: `${percentage}%` }}
        />
        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            w-4 h-4 rounded-full bg-white border-2 border-[#6366f1]
            shadow-lg shadow-[#6366f1]/30
            transition-shadow duration-200
            ${dragging ? 'scale-110 shadow-xl shadow-[#6366f1]/40' : 'hover:scale-110'}
          `}
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[#52525b]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

Slider.displayName = 'Slider';

export { Slider };
export default Slider;
