import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface FilterBarProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string | undefined) => void;
  onClearFilters?: () => void;
}

export function FilterBar({
  onSearch,
  searchPlaceholder = 'Search...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (!onSearch) return;
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleFilterClick = (key: string) => {
    setOpenFilter(openFilter === key ? null : key);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {onSearch && (
          <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest/50" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-forest/15 rounded-xl text-[14px] text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/30 transition-all shadow-sm hover:border-forest/30"
              />
          </div>
        )}
        
        {filters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap relative">
            <div className="flex items-center gap-2 bg-white border border-forest/10 rounded-xl p-1 shadow-sm">
              <span className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-forest/60">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </span>
              <div className="w-px h-5 bg-forest/10 mx-1"></div>
              {filters.map((filter) => (
                <div key={filter.key} className="relative">
                  <button
                    onClick={() => handleFilterClick(filter.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                      activeFilters[filter.key] 
                        ? 'bg-forest/5 text-forest' 
                        : 'text-forest/70 hover:bg-forest/5 hover:text-forest'
                    }`}
                  >
                    {filter.label}
                    <ChevronDown className={`h-3 w-3 transition-transform ${openFilter === filter.key ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openFilter === filter.key && (
                    <>
                      <div 
                        className="fixed inset-0 z-20"
                        onClick={() => setOpenFilter(null)}
                      />
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-forest/10 py-2 z-30 overflow-hidden transform origin-top transition-all">
                        <button
                          onClick={() => {
                            onFilterChange?.(filter.key, undefined);
                            setOpenFilter(null);
                          }}
                          className={`w-full text-left px-4 py-2 text-[13px] hover:bg-forest/5 transition-colors ${!activeFilters[filter.key] ? 'font-semibold text-forest' : 'text-forest/70'}`}
                        >
                          Any {filter.label}
                        </button>
                        {filter.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              onFilterChange?.(filter.key, opt.value);
                              setOpenFilter(null);
                            }}
                            className={`w-full text-left px-4 py-2 text-[13px] hover:bg-forest/5 transition-colors ${activeFilters[filter.key] === opt.value ? 'font-semibold text-forest bg-forest/5' : 'text-forest/70'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[12px] text-forest/50 font-medium">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            const filterConfig = filters.find(f => f.key === key);
            const optionLabel = filterConfig?.options.find(o => o.value === value)?.label || value;
            
            return (
              <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B3A2B] text-white text-[12px] font-medium shadow-sm transition-transform hover:scale-105">
                <span>{filterConfig?.label}: <span className="font-bold text-cream">{optionLabel}</span></span>
                <button
                  onClick={() => onFilterChange?.(key, undefined)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}
          {Object.keys(activeFilters).length > 1 && (
            <button
              onClick={onClearFilters}
              className="text-[12px] text-forest/60 hover:text-forest underline underline-offset-2 ml-2 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
