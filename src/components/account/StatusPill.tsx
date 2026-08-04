import React from 'react';

type Status = 'Delivered' | 'On the way' | 'Cancelled' | 'Returned';

export function StatusPill({ status }: { status: Status }) {
  let bg = 'bg-gray-100';
  let text = 'text-gray-700';
  let dot = 'bg-gray-400';

  switch (status) {
    case 'Delivered':
      bg = 'bg-[#E8F3EB]';
      text = 'text-[#1B4D2E]';
      dot = 'bg-[#3F7D4C]';
      break;
    case 'On the way':
      bg = 'bg-[#FFF3E0]';
      text = 'text-[#B87A1E]';
      dot = 'bg-[#D99A3D]';
      break;
    case 'Cancelled':
      bg = 'bg-red-50';
      text = 'text-red-700';
      dot = 'bg-red-500';
      break;
    case 'Returned':
      bg = 'bg-slate-100';
      text = 'text-slate-700';
      dot = 'bg-slate-500';
      break;
  }

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${bg} ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
