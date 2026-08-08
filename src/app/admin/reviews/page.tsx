'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Star, Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/src/components/admin/ConfirmDialog';
import { reviews as reviewsApi } from '@/src/lib/api';
import toast from 'react-hot-toast';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

type Review = {
  reviewId: string;
  product: { name: string };
  user: { firstName: string; lastName: string };
  rating: number; comment: string; createdAt: string; status: ReviewStatus;
};

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('pending');
  const [rejectTarget, setRejectTarget] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await reviewsApi.adminList();
      setReviews(res.data?.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter);

  const approve = async (id: string) => {
    try {
      await reviewsApi.adminUpdateStatus(id, 'approved');
      setReviews((prev) => prev.map((r) => r.reviewId === id ? { ...r, status: 'approved' } : r));
      toast.success('Review approved');
    } catch (error) {
      console.error('Failed to approve:', error);
      toast.error('Failed to approve review');
    }
  };

  const reject = async () => {
    if (!rejectTarget) return;
    try {
      await reviewsApi.adminUpdateStatus(rejectTarget.reviewId, 'rejected');
      setReviews((prev) => prev.map((r) => r.reviewId === rejectTarget.reviewId ? { ...r, status: 'rejected' } : r));
      toast.success('Review rejected');
    } catch (error) {
      console.error('Failed to reject:', error);
      toast.error('Failed to reject review');
    } finally {
      setRejectTarget(null);
    }
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
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 size={24} className="animate-spin text-forest" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-forest/10 bg-white p-12 text-center text-forest/50">
            No {filter === 'all' ? '' : filter} reviews to show.
          </div>
        ) : (
        filtered.map((review) => (
          <div key={review.reviewId} className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-forest">{review.product?.name}</p>
                <p className="text-sm text-forest/60 mt-0.5">{review.user?.firstName} {review.user?.lastName} · {new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-semibold capitalize ${STATUS_BADGE[review.status]}`}>
                  {review.status}
                </span>
              </div>
            </div>

            <Stars rating={review.rating} />
            <p className="text-sm text-forest/80 leading-relaxed">{review.comment}</p>

            {review.status === 'pending' && (
              <div className="flex items-center gap-2 pt-2 border-t border-forest/5">
                <button onClick={() => approve(review.reviewId)}
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
        )))}
      </div>

      <ConfirmDialog
        isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={reject}
        title="Reject Review" message={`Are you sure you want to reject this review by ${rejectTarget?.user?.firstName}?`}
        confirmText="Yes, Reject" isDestructive
      />
    </div>
  );
}
