import React from 'react';

type Status = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'Delivered' | 'On the way' | 'Cancelled' | 'Returned';

export function StatusPill({ status }: { status: Status }) {
  const normalized = String(status).toLowerCase();
  let bg = 'bg-gray-100';
  let text = 'text-gray-700';
  let dot = 'bg-gray-400';
  let label = String(status);

  switch (normalized) {
    case 'delivered':
      bg = 'bg-[#E8F3EB]';
      text = 'text-[#1B4D2E]';
      dot = 'bg-[#3F7D4C]';
      label = 'Delivered';
      break;
    case 'shipped':
    case 'on the way':
      bg = 'bg-[#FFF3E0]';
      text = 'text-[#B87A1E]';
      dot = 'bg-[#D99A3D]';
      label = normalized === 'shipped' ? 'Shipped' : 'On the way';
      break;
    case 'confirmed':
      bg = 'bg-forest/10';
      text = 'text-forest';
      dot = 'bg-forest';
      label = 'Confirmed';
      break;
    case 'pending':
      bg = 'bg-gold/10';
      text = 'text-[#7A5E1A]';
      dot = 'bg-gold';
      label = 'Pending';
      break;
    case 'cancelled':
      bg = 'bg-red-50';
      text = 'text-red-700';
      dot = 'bg-red-500';
      label = 'Cancelled';
      break;
    case 'returned':
      bg = 'bg-slate-100';
      text = 'text-slate-700';
      dot = 'bg-slate-500';
      label = 'Returned';
      break;
  }

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${bg} ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
