import React, { useState } from 'react';
import { XIcon, Loader2, StarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviews as reviewsApi } from '@/src/lib/api';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | number;
  productName: string;
}

export function ReviewModal({ isOpen, onClose, productId, productName }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0) {
      toast.error('Please provide a rating and a comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.add(String(productId), { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(0);
      onClose();
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoveredRating || rating;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-forest/10"
        >
          {/* Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-forest/5 to-transparent pointer-events-none" />
          
          {/* Header */}
          <div className="relative flex items-start justify-between px-8 pt-8 pb-4">
            <div>
              <p className="text-[13px] font-bold tracking-widest uppercase text-terracotta mb-2">Leave a Review</p>
              <h2 className="font-display text-2xl font-bold text-forest leading-tight pr-4">
                {productName}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 -mr-2 -mt-2 rounded-full hover:bg-forest/5 text-forest/40 hover:text-forest transition-colors bg-white shadow-sm border border-forest/5"
            >
              <XIcon size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Form */}
          <div className="relative p-8 pt-2 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Interactive Stars */}
              <div className="flex flex-col items-center justify-center p-6 bg-forest/5 rounded-2xl border border-forest/10">
                <label className="block text-[14px] font-bold text-forest/70 mb-4 uppercase tracking-wider">Tap to Rate</label>
                <div className="flex gap-2 sm:gap-3" onMouseLeave={() => setHoveredRating(0)}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button 
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      className="focus:outline-none relative"
                    >
                      <StarIcon 
                        size={42} 
                        strokeWidth={1.5}
                        className={`transition-all duration-300 ${
                          activeRating >= star 
                            ? 'text-gold fill-gold drop-shadow-md' 
                            : 'text-forest/20 fill-transparent'
                        }`} 
                      />
                      {activeRating === star && (
                        <motion.div 
                          layoutId="star-highlight"
                          className="absolute inset-0 bg-gold/20 rounded-full blur-md -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
                <div className="h-6 mt-3">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={activeRating}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[14px] font-bold text-forest/80"
                    >
                      {activeRating === 1 && "Poor"}
                      {activeRating === 2 && "Fair"}
                      {activeRating === 3 && "Good"}
                      {activeRating === 4 && "Very Good"}
                      {activeRating === 5 && "Excellent!"}
                      {activeRating === 0 && " "}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              
              <div>
                <label className="block text-[14px] font-bold text-forest mb-3">Share your experience</label>
                <div className="relative">
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-2xl border-2 border-forest/10 px-5 py-4 text-[15px] text-forest placeholder:text-forest/30 focus:outline-none focus:border-forest/30 focus:ring-4 focus:ring-forest/5 bg-white transition-all resize-none shadow-sm"
                    rows={4}
                    placeholder="What did you like or dislike? How did you use the product?"
                  />
                  <div className="absolute bottom-3 right-4 text-[12px] font-bold text-forest/30">
                    {comment.length}/2000
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-forest/10">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-4 rounded-xl text-[15px] font-bold text-forest bg-forest/5 hover:bg-forest/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim() || rating === 0}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-4 text-[15px] font-bold text-white hover:bg-[#16301F] transition-all disabled:opacity-50 disabled:hover:bg-forest hover:shadow-lg hover:shadow-forest/20"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
          
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
