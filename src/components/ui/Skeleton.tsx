import React from 'react';

export type SkeletonShape = 'text' | 'circle' | 'rect' | 'card' | 'table-row';

export interface SkeletonProps {
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

const baseClasses = 'bg-[#27272a] animate-pulse rounded';

const Skeleton: React.FC<SkeletonProps> = ({
  shape = 'text',
  width,
  height,
  lines = 1,
  className = '',
}) => {
  const style: React.CSSProperties = {
    width: width ?? undefined,
    height: height ?? undefined,
  };

  if (shape === 'text') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} h-4 rounded-md`}
            style={{
              ...style,
              width: width ?? (i === lines - 1 && lines > 1 ? '70%' : '100%'),
            }}
          />
        ))}
      </div>
    );
  }

  if (shape === 'circle') {
    const size = width ?? height ?? 40;
    return (
      <div
        className={`${baseClasses} rounded-full shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (shape === 'rect') {
    return (
      <div
        className={`${baseClasses} rounded-lg ${className}`}
        style={{ width: width ?? '100%', height: height ?? 100 }}
      />
    );
  }

  if (shape === 'card') {
    return (
      <div className={`rounded-xl border border-[#27272a] bg-[#0f0f14] p-5 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`${baseClasses} rounded-full w-10 h-10`} />
          <div className="flex-1">
            <div className={`${baseClasses} h-4 rounded-md w-2/3 mb-2`} />
            <div className={`${baseClasses} h-3 rounded-md w-1/3`} />
          </div>
        </div>
        <div className={`${baseClasses} h-4 rounded-md w-full mb-2`} />
        <div className={`${baseClasses} h-4 rounded-md w-5/6 mb-2`} />
        <div className={`${baseClasses} h-4 rounded-md w-3/4`} />
      </div>
    );
  }

  if (shape === 'table-row') {
    return (
      <div className={`flex items-center gap-4 px-4 py-3 ${className}`}>
        <div className={`${baseClasses} w-4 h-4 rounded`} />
        <div className={`${baseClasses} h-4 rounded-md flex-1`} />
        <div className={`${baseClasses} h-4 rounded-md w-20`} />
        <div className={`${baseClasses} h-4 rounded-md w-24`} />
        <div className={`${baseClasses} h-4 rounded-md w-16`} />
      </div>
    );
  }

  return null;
};

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export default Skeleton;
