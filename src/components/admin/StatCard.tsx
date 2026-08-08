import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon?: React.ElementType;
}

export function StatCard({ title, value, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white/60 backdrop-blur-md rounded-[24px] p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      {/* Decorative gradient orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-forest/5 rounded-full blur-3xl group-hover:bg-forest/10 transition-colors duration-500"></div>
      
      <div className="relative z-10 flex items-start justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-forest/70 uppercase tracking-widest">{title}</h3>
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-forest/5 text-forest group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
            <Icon size={22} strokeWidth={1.8} />
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-4xl font-display font-bold text-forest tracking-tight">{value}</p>
        
        {trend && (
          <div className="mt-3 flex items-center gap-2 bg-white/50 w-fit px-3 py-1.5 rounded-full border border-white/60">
            <span 
              className={`flex items-center gap-1 text-[13px] font-bold ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp size={16} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={16} strokeWidth={2.5} />
              )}
              {Math.abs(trend.value)}%
            </span>
            {trend.label && (
              <span className="text-[12px] text-forest/60 font-medium">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
