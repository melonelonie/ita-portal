import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> & { Panel: React.FC<TabPanelProps> } = ({
  tabs,
  activeTab: controlledActive,
  defaultTab,
  onChange,
  children,
  className = '',
}) => {
  const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id || '');
  const activeTab = controlledActive ?? internalActive;

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current[activeTab];
    const container = containerRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  const handleTabClick = (tabId: string) => {
    if (!controlledActive) setInternalActive(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative flex items-center gap-1 border-b border-[#27272a]"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            role="tab"
            aria-selected={activeTab === tab.id}
            disabled={tab.disabled}
            onClick={() => handleTabClick(tab.id)}
            className={`
              relative px-4 py-2.5 text-sm font-medium transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] rounded-t
              ${activeTab === tab.id
                ? 'text-[#fafafa]'
                : 'text-[#a1a1aa] hover:text-[#fafafa]'}
              ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              flex items-center gap-2
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-[#6366f1] rounded-full"
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      </div>
      {children &&
        React.Children.map(children, (child) => {
          if (React.isValidElement<TabPanelProps>(child) && child.type === TabPanel) {
            return React.cloneElement(child, { activeTab });
          }
          return child;
        })}
    </div>
  );
};

const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  activeTab,
  children,
  className = '',
}) => {
  if (tabId !== activeTab) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      role="tabpanel"
      className={`pt-4 ${className}`}
    >
      {children}
    </motion.div>
  );
};

TabPanel.displayName = 'Tabs.Panel';
Tabs.Panel = TabPanel;
Tabs.displayName = 'Tabs';

export { Tabs };
export default Tabs;
