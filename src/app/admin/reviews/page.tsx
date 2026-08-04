'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Star } from 'lucide-react';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

type Review = {
  id: string; productName: string; customer: string;
  rating: number; text: string; date: string; status: ReviewStatus;
};

const MOCK_REVIEWS: Review[] = [
  { id: '1', productName: 'Neem & Tulsi Face Wash 100ml', customer: 'Priya S.', rating: 5, text: 'Absolutely love this face wash! My skin feels so clean and fresh. Will definitely buy again.', date: '03 Aug 2026', status: 'pending' },
  { id: '2', productName: 'Charcoal Detox Soap 75g', customer: 'Raj P.', rating: 4, text: 'Good product, lathers well. Took a little while to get used to the scent.', date: '02 Aug 2026', status: 'pending' },
  { id: '3', productName: 'Rose & Honey Soap 100g', customer: 'Sneha K.', rating: 5, text: 'My skin has never felt so moisturized. Smells heavenly!', date: '01 Aug 2026', status: 'approved' },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} className={i <= rating ? 'text-[#D99A3D] fill-[#D99A3D]' : 'text-forest/20'} />
      ))}
    </div>
  );
}

const STATUS_BADGE: Record<ReviewStatus, string> = {
  pending:  'bg-gold/10 text-[#7A5E1A]',
  approved: 'bg-[#3F7D4C]/10 text-[#3F7D4C]',
  rejected: 'bg-terracotta/10 text-terracotta',
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending');
  const [rejectTarget, setRejectTarget] = useState<Review | null>(null);

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter);

  const approve = (id: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' } : r));
  };
  const reject = () => {
    if (!rejectTarget) return;
    setReviews((prev) => prev.map((r) => r.id === rejectTarget.id ? { ...r, status: 'rejected' } : r));
    setRejectTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest">Reviews Moderation</h1>
        <p className="text-sm text-forest/60 mt-1">{reviews.filter(r => r.status === 'pending').length} pending reviews</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white border border-forest/10 rounded-xl p-1 shadow-sm w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${filter === tab ? 'bg-forest text-white shadow-sm' : 'text-forest/60 hover:text-forest'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-forest/10 bg-white p-12 text-center text-forest/50">
            No {filter === 'all' ? '' : filter} reviews to show.
          </div>
        )}
        {filtered.map((review) => (
          <div key={review.id} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-forest">{review.productName}</p>
                <p className="text-sm text-forest/60 mt-0.5">{review.customer} · {review.date}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-semibold capitalize ${STATUS_BADGE[review.status]}`}>
                  {review.status}
                </span>
              </div>
            </div>

            <Stars rating={review.rating} />
            <p className="text-sm text-forest/80 leading-relaxed">{review.text}</p>

            {review.status === 'pending' && (
              <div className="flex items-center gap-2 pt-2 border-t border-forest/5">
                <button onClick={() => approve(review.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3F7D4C]/10 text-[#3F7D4C] text-sm font-semibold hover:bg-[#3F7D4C]/20 transition-colors">
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button onClick={() => setRejectTarget(review)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta/10 text-terracotta text-sm font-semibold hover:bg-terracotta/20 transition-colors">
                  <XCircle size={14} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={reject}
        title="Reject Review" message={`Are you sure you want to reject this review by ${rejectTarget?.customer}?`}
        confirmText="Yes, Reject" isDestructive
      />
    </div>
  );
}
