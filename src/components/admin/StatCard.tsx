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
    <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-[14px] font-medium text-forest/70">{title}</h3>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/5 text-forest">
            <Icon size={20} strokeWidth={1.8} />
          </div>
        )}
      </div>
      
      <div>
        <p className="text-3xl font-display font-bold text-forest">{value}</p>
        
        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <span 
              className={`flex items-center gap-1 text-[13px] font-semibold ${
                trend.isPositive ? 'text-[#3F7D4C]' : 'text-[#C1493D]'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp size={14} strokeWidth={2.5} />
              ) : (
                <TrendingDown size={14} strokeWidth={2.5} />
              )}
              {Math.abs(trend.value)}%
            </span>
            {trend.label && (
              <span className="text-[13px] text-forest/50">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
