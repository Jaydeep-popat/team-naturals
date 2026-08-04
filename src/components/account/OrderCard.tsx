import React from 'react';
import { ChevronRightIcon, PackageIcon } from 'lucide-react';
import { StatusPill } from './StatusPill';

export interface OrderItem {
  id: string;
  orderId: string;
  name: string;
  variant: string;
  price: number;
  image: string | null;
  status: 'Delivered' | 'On the way' | 'Cancelled' | 'Returned';
  date: string;
  dateObj: Date;
}

interface OrderCardProps {
  item: OrderItem;
  onClick: () => void;
}

export function OrderCard({ item, onClick }: OrderCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-forest/10 rounded-[16px] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 hover:shadow-md hover:border-forest/40 transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Decorative left accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-forest opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Product Image Thumbnail */}
      <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl bg-forest/5 flex items-center justify-center overflow-hidden border border-forest/5">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <PackageIcon className="text-forest/20" size={32} />
        )}
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-forest truncate">{item.name}</h3>
            <p className="text-[13px] font-medium text-forest/70 truncate mt-0.5">
              {item.orderId} • {item.date}
            </p>
          </div>
          {/* Status Pill (Desktop) */}
          <div className="hidden sm:block">
            <StatusPill status={item.status} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[14px] text-muted">
          <span className="font-semibold text-forest">₹{item.price}</span>
          <span className="h-1 w-1 rounded-full bg-forest/20" />
          <span>{item.variant}</span>
        </div>

        {/* Status Pill (Mobile) */}
        <div className="mt-4 sm:hidden">
          <StatusPill status={item.status} />
        </div>
      </div>

      {/* Right Chevron Indicator */}
      <div className="hidden sm:flex items-center justify-center pl-2 shrink-0">
        <ChevronRightIcon size={20} className="text-forest/30 group-hover:text-forest transition-colors group-hover:translate-x-1" />
      </div>
    </div>
  );
}
