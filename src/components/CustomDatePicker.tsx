import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon } from 'lucide-react';

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CustomDatePicker({ value, onChange, placeholder = 'Select Date', disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial date
  const initialDate = value ? new Date(value) : new Date(2000, 0, 1);
  
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handleDayClick = (day: number) => {
    // Correct timezone issues by formatting local date string manually
    const y = currentYear;
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const displayValue = value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className={`relative w-full ${isOpen ? 'z-50' : ''}`} ref={containerRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-transparent px-3.5 py-2.5 text-[14px] font-semibold flex items-center justify-between outline-none cursor-pointer ${displayValue ? 'text-forest' : 'text-muted/50'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <CalendarIcon size={16} className="text-forest/60 shrink-0 ml-2" />
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+8px)] left-0 w-[280px] bg-white rounded-2xl shadow-xl border border-forest/10 p-4 z-50 overflow-hidden"
          >
            {/* Header: Month & Year Toggles */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <button 
                onClick={() => setView(view === 'months' ? 'days' : 'months')}
                className={`flex-1 bg-forest/5 hover:bg-forest/10 transition-colors font-semibold rounded-lg px-2 py-1.5 text-[13px] outline-none text-center border border-forest/10 ${view === 'months' ? 'bg-forest/15 text-forest-deep' : 'text-forest'}`}
              >
                {months[currentMonth]}
              </button>
              
              <button 
                onClick={() => setView(view === 'years' ? 'days' : 'years')}
                className={`w-[85px] bg-forest/5 hover:bg-forest/10 transition-colors font-semibold rounded-lg px-2 py-1.5 text-[13px] outline-none text-center border border-forest/10 ${view === 'years' ? 'bg-forest/15 text-forest-deep' : 'text-forest'}`}
              >
                {currentYear}
              </button>
            </div>

            {/* Views */}
            {view === 'months' && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => { setCurrentMonth(i); setView('days'); }}
                    className={`py-2 text-[12px] font-semibold rounded-lg transition-colors ${currentMonth === i ? 'bg-forest text-white shadow-sm' : 'text-forest hover:bg-forest/10'}`}
                  >
                    {m.substring(0, 3)}
                  </button>
                ))}
              </div>
            )}

            {view === 'years' && (
              <div className="grid grid-cols-4 gap-2 mt-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-forest/20 scrollbar-track-transparent pr-1">
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => { setCurrentYear(y); setView('days'); }}
                    className={`py-2 text-[12px] font-semibold rounded-lg transition-colors ${currentYear === y ? 'bg-forest text-white shadow-sm' : 'text-forest hover:bg-forest/10'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            {view === 'days' && (
              <>
                {/* Days Header */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[10px] font-bold text-forest/40 uppercase tracking-wider">{day}</div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = value && new Date(value).getDate() === day && new Date(value).getMonth() === currentMonth && new Date(value).getFullYear() === currentYear;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayClick(day)}
                        className={`h-8 w-8 mx-auto rounded-full text-[13px] font-semibold flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-forest text-white shadow-sm' : 'text-forest hover:bg-forest/10'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
