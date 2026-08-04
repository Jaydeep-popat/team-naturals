import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}: ConfirmDialogProps) {
  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => !isLoading && onClose()}
            className="absolute inset-0 bg-forest/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lift border border-forest/10 overflow-hidden"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-forest border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <div className="flex items-start gap-4">
              <div className={`flex shrink-0 h-12 w-12 items-center justify-center rounded-full ${isDestructive ? 'bg-terracotta/10 text-terracotta' : 'bg-forest/10 text-forest'}`}>
                <AlertTriangle size={24} strokeWidth={1.8} />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-forest">{title}</h3>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="rounded-full p-1 text-forest/40 hover:bg-forest/5 hover:text-forest transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-forest/70 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-forest hover:bg-forest/5 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 ${
                  isDestructive 
                    ? 'bg-terracotta hover:bg-[#A8382E]' 
                    : 'bg-forest hover:bg-[#16301F]'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
