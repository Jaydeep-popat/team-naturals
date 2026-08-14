import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  placeholder?: string;
  value: string[];
  onChange: (val: string[]) => void;
  fetchOptions: (query: string) => Promise<{ id: string; name: string }[]>;
}

export function MultiSelect({ label, placeholder, value, onChange, fetchOptions }: MultiSelectProps) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!isOpen) return;
      setIsLoading(true);
      try {
        const res = await fetchOptions(query);
        setOptions(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isOpen]);

  const handleSelect = (id: string) => {
    if (!value.includes(id)) {
      onChange([...value, id]);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(v => v !== id));
  };

  return (
    <div className="space-y-1.5 relative">
      <label className="text-sm font-semibold text-forest/80">{label}</label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(id => (
          <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest/10 text-forest text-xs font-medium">
            {id}
            <button type="button" onClick={() => handleRemove(id)} className="hover:text-terracotta">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <input 
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full rounded-xl border border-forest/20 px-3.5 py-2.5 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-1 focus:ring-forest bg-white" 
        placeholder={placeholder || "Search..."} 
      />

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-forest/10 shadow-lg rounded-xl max-h-48 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 flex justify-center"><Loader2 size={16} className="animate-spin text-forest" /></div>
          ) : options.length > 0 ? (
            <ul className="py-1">
              {options.map(opt => (
                <li 
                  key={opt.id}
                  className="px-3 py-2 text-sm text-forest hover:bg-forest/5 cursor-pointer"
                  onClick={() => handleSelect(opt.id)}
                >
                  {opt.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-forest/40 text-center flex flex-col gap-1 items-center">
              <span>No results found</span>
              <button 
                type="button"
                className="text-xs text-forest hover:underline"
                onClick={() => {
                  if (query && !value.includes(query)) {
                    handleSelect(query);
                  }
                }}
              >
                Add &quot;{query}&quot; directly
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
