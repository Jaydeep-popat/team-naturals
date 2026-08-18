import React, { useState } from 'react';
import { ChevronUp, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  
  // Sorting (can be uncontrolled or controlled)
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  defaultSortKey?: string;
  
  // Pagination
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  
  // Selection
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  
  // Clickable rows
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load data',
  emptyMessage = 'No records found',
  onSort,
  defaultSortKey,
  page,
  totalPages,
  totalRecords,
  limit,
  onPageChange,
  onLimitChange,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    const isAsc = sortKey === key && sortDir === 'asc';
    const nextDir = isAsc ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(nextDir);
    if (onSort) onSort(key, nextDir);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      onSelectionChange(new Set(data.map(keyExtractor)));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleSelectRow = (key: string, checked: boolean) => {
    if (!onSelectionChange) return;
    const newSet = new Set(selectedKeys);
    if (checked) {
      newSet.add(key);
    } else {
      newSet.delete(key);
    }
    onSelectionChange(newSet);
  };

  const allSelected = data.length > 0 && data.every(item => selectedKeys.has(keyExtractor(item)));
  const someSelected = data.length > 0 && data.some(item => selectedKeys.has(keyExtractor(item))) && !allSelected;

  return (
    <div className="flex flex-col rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-forest">
          <thead className="bg-white/40 backdrop-blur-md border-b border-forest/5 sticky top-0 z-10">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-forest/20 text-forest focus:ring-forest/30"
                    checked={allSelected}
                    ref={input => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-4 py-3 font-semibold text-forest/70 ${col.width || ''}`}
                >
                  {col.sortable ? (
                    <button
                      className="flex items-center gap-1 hover:text-forest transition-colors"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      <span className="flex flex-col">
                        <ChevronUp className={`h-2.5 w-2.5 -mb-0.5 ${sortKey === col.key && sortDir === 'asc' ? 'text-forest' : 'text-forest/30'}`} />
                        <ChevronDown className={`h-2.5 w-2.5 ${sortKey === col.key && sortDir === 'desc' ? 'text-forest' : 'text-forest/30'}`} />
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/5 relative">
            {isLoading && data.length === 0 ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="animate-pulse border-b border-forest/5 last:border-0">
                  {selectable && (
                    <td className="px-4 py-4 w-12 text-center">
                      <div className="h-4 w-4 rounded bg-forest/10 inline-block" />
                    </td>
                  )}
                  {columns.map((col, i) => (
                    <td key={`skel-col-${i}`} className="px-4 py-4">
                      <div className={`h-4 rounded bg-forest/10 ${i === 0 ? 'w-2/3' : 'w-1/2'}`} />
                    </td>
                  ))}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="h-48 text-center bg-terracotta/5">
                  <div className="flex flex-col items-center justify-center text-terracotta">
                    <AlertCircle className="h-6 w-6 mb-2" />
                    <span>{errorMessage}</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="h-48 text-center text-forest/50">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const key = keyExtractor(item);
                const isSelected = selectedKeys.has(key);
                return (
                  <tr 
                    key={key} 
                    className={`transition-all duration-200 border-b border-forest/5 last:border-0 ${isSelected ? 'bg-forest/5' : 'hover:bg-white/90 hover:shadow-sm'} ${onRowClick ? 'cursor-pointer group' : ''}`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
                      onRowClick?.(item);
                    }}
                  >
                    {selectable && (
                      <td className="px-4 py-3 text-center w-12" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded border-forest/20 text-forest focus:ring-forest/30"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(key, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-4 whitespace-nowrap text-sm ${onRowClick ? 'group-hover:text-forest' : ''}`}>
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {(totalPages !== undefined || totalRecords !== undefined) && (
        <div className="flex items-center justify-between border-t border-forest/10 px-4 py-3 bg-[#FDFBF9]">
          <div className="flex items-center gap-4 text-sm text-forest/60">
            {totalRecords !== undefined && limit !== undefined && page !== undefined ? (
              totalRecords > 0 ? (
                <span>
                  Showing <span className="font-medium text-forest">{Math.min((page - 1) * limit + 1, totalRecords)}</span> to <span className="font-medium text-forest">{Math.min(page * limit, totalRecords)}</span> of <span className="font-medium text-forest">{totalRecords}</span> results
                </span>
              ) : (
                <span>No results</span>
              )
            ) : (
              <span>
                Page {page} of {totalPages || 1}
              </span>
            )}
            
            {onLimitChange && (
              <div className="flex items-center gap-2">
                <span className="text-forest/60">Rows per page:</span>
                <select 
                  value={limit} 
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="bg-transparent border border-forest/10 rounded-md text-forest py-0.5 px-1 focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1 || !page}
              onClick={() => onPageChange?.(page! - 1)}
              className="rounded-lg border border-forest/10 px-3 py-1.5 text-sm font-medium text-forest disabled:opacity-50 hover:bg-forest/5 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages || totalPages === 0 || !page}
              onClick={() => onPageChange?.(page! + 1)}
              className="rounded-lg border border-forest/10 px-3 py-1.5 text-sm font-medium text-forest disabled:opacity-50 hover:bg-forest/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
