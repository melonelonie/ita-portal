import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight,
  Search, Download, MoreHorizontal,
  Inbox, Check, X,
} from 'lucide-react';

// --- Types ---

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
  danger?: boolean;
  icon?: React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  rowActions?: RowAction<T>[];
  selectable?: boolean;
  onSelectionChange?: (selectedKeys: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  exportable?: boolean;
  onExport?: (selectedKeys: string[]) => void;
  pageSize?: number;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

// --- Helper Components ---

function RowActionsMenu<T>({ row, actions }: { row: T; actions: RowAction<T>[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-[#52525b] hover:text-[#a1a1aa] hover:bg-white/5 transition-colors"
      >
        <MoreHorizontal size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            className="absolute z-50 right-0 top-full mt-1 min-w-[150px] bg-[#0f0f14] border border-[#27272a] rounded-lg shadow-xl py-1"
          >
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={() => { action.onClick(row); setOpen(false); }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors cursor-pointer
                  ${action.danger
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5'}
                `}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Component ---

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  rowActions,
  selectable = false,
  onSelectionChange,
  searchable = false,
  searchPlaceholder = 'Search...',
  exportable = false,
  onExport,
  pageSize = 10,
  emptyMessage = 'No data found',
  loading = false,
  className = '',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Filter data
  const filteredData = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        return val && String(val).toLowerCase().includes(q);
      }),
    );
  }, [data, search, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] as string | number;
      const bVal = b[sortKey] as string | number;
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelect = useCallback(
    (key: string) => {
      const next = new Set(selectedKeys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      setSelectedKeys(next);
      onSelectionChange?.(Array.from(next));
    },
    [selectedKeys, onSelectionChange],
  );

  const toggleSelectAll = useCallback(() => {
    if (selectedKeys.size === paginatedData.length) {
      setSelectedKeys(new Set());
      onSelectionChange?.([]);
    } else {
      const allKeys = new Set(paginatedData.map(keyExtractor));
      setSelectedKeys(allKeys);
      onSelectionChange?.(Array.from(allKeys));
    }
  }, [selectedKeys, paginatedData, keyExtractor, onSelectionChange]);

  const allSelected = paginatedData.length > 0 && paginatedData.every((r) => selectedKeys.has(keyExtractor(r)));

  const alignClass = (align?: string) => {
    if (align === 'center') return 'text-center';
    if (align === 'right') return 'text-right';
    return 'text-left';
  };

  return (
    <div className={`rounded-xl border border-[#27272a] bg-[#0f0f14] overflow-hidden ${className}`}>
      {/* Toolbar */}
      {(searchable || exportable || selectedKeys.size > 0) && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#27272a]">
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#18181f] border border-[#27272a] text-[#fafafa] placeholder:text-[#52525b] outline-none focus:border-[#6366f1] transition-all"
              />
            </div>
          )}
          <div className="flex-1" />
          {selectedKeys.size > 0 && (
            <span className="text-xs text-[#a1a1aa]">{selectedKeys.size} selected</span>
          )}
          {exportable && (
            <button
              onClick={() => onExport?.(Array.from(selectedKeys))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-[#fafafa] bg-[#18181f] border border-[#27272a] rounded-lg hover:bg-[#27272a] transition-colors"
            >
              <Download size={13} /> Export
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#27272a]">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-[#3f3f46] bg-transparent accent-[#6366f1] cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-medium text-[#a1a1aa] text-xs ${alignClass(col.align)} ${col.sortable ? 'cursor-pointer select-none hover:text-[#fafafa]' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'flex-row-reverse' : ''}`}>
                    {col.header}
                    {col.sortable && (
                      <span className="text-[#3f3f46]">
                        {sortKey === col.key ? (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className="w-12 px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#27272a]/50">
                  {selectable && <td className="px-4 py-3"><div className="w-3.5 h-3.5 rounded bg-[#27272a] animate-pulse" /></td>}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-3.5 rounded bg-[#27272a] animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                  {rowActions && <td className="px-4 py-3" />}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="px-4 py-16 text-center">
                  <Inbox size={32} className="mx-auto text-[#3f3f46] mb-3" />
                  <p className="text-sm text-[#52525b]">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const key = keyExtractor(row);
                const isSelected = selectedKeys.has(key);
                return (
                  <tr
                    key={key}
                    className={`border-b border-[#27272a]/50 transition-colors ${isSelected ? 'bg-[#6366f1]/5' : 'hover:bg-white/[0.015]'}`}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(key)}
                          className="w-3.5 h-3.5 rounded border-[#3f3f46] bg-transparent accent-[#6366f1] cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 text-[#fafafa] text-xs ${alignClass(col.align)}`}>
                        {col.render ? col.render(row, idx) : (row[col.key] as React.ReactNode) ?? '—'}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-3">
                        <RowActionsMenu row={row} actions={rowActions} />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#27272a]">
        <p className="text-xs text-[#52525b]">
          {sortedData.length > 0
            ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sortedData.length)} of ${sortedData.length}`
            : '0 results'}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded-lg text-[#52525b] hover:text-[#a1a1aa] hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let p: number;
            if (totalPages <= 5) p = i + 1;
            else if (page <= 3) p = i + 1;
            else if (page >= totalPages - 2) p = totalPages - 4 + i;
            else p = page - 2 + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${page === p ? 'bg-[#6366f1] text-white' : 'text-[#52525b] hover:text-[#a1a1aa] hover:bg-white/5'}`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg text-[#52525b] hover:text-[#a1a1aa] hover:bg-white/5 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

DataTable.displayName = 'DataTable';

export { DataTable };
export default DataTable;
