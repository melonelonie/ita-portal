import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  XCircle,
  Sparkles,
  MessageSquare,
  Send,
} from 'lucide-react';

export interface ApprovalItem {
  id: string;
  title: string;
  subtitle?: string;
  details: Array<{ label: string; value: string }>;
  aiReasoning?: string;
  aiConfidence?: number;
}

export interface ApprovalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ApprovalItem;
  onApprove?: (id: string, comment: string) => void;
  onReject?: (id: string, comment: string) => void;
  className?: string;
}

const ApprovalDrawer: React.FC<ApprovalDrawerProps> = ({
  isOpen,
  onClose,
  item,
  onApprove,
  onReject,
  className = '',
}) => {
  const [comment, setComment] = useState('');

  const handleApprove = () => {
    if (item) {
      onApprove?.(item.id, comment);
      setComment('');
    }
  };

  const handleReject = () => {
    if (item) {
      onReject?.(item.id, comment);
      setComment('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`
              relative h-full w-full max-w-lg
              bg-[#0f0f14] border-l border-[#27272a]
              shadow-2xl flex flex-col
              ${className}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#27272a]">
              <div>
                <h2 className="text-lg font-semibold text-[#fafafa]">Approval Review</h2>
                <p className="text-sm text-[#a1a1aa] mt-0.5">Review and take action</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {item ? (
              <>
                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                  {/* Item Header */}
                  <div>
                    <h3 className="text-base font-semibold text-[#fafafa]">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-[#a1a1aa] mt-1">{item.subtitle}</p>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                      Details
                    </h4>
                    <div className="space-y-2">
                      {item.details.map((detail, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-[#27272a]/50"
                        >
                          <span className="text-xs text-[#71717a]">{detail.label}</span>
                          <span className="text-sm text-[#fafafa] font-medium">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  {item.aiReasoning && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-[#6366f1]" />
                        <h4 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                          AI Reasoning
                        </h4>
                      </div>
                      <div className="p-4 rounded-lg bg-[#6366f1]/5 border border-[#6366f1]/10">
                        <p className="text-sm text-[#a1a1aa] leading-relaxed">{item.aiReasoning}</p>
                        {item.aiConfidence !== undefined && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] text-[#71717a]">Confidence</span>
                              <span className="text-xs font-semibold text-[#6366f1]">
                                {item.aiConfidence}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#27272a] overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.aiConfidence}%` }}
                                transition={{ duration: 0.6 }}
                                className="h-full rounded-full bg-[#6366f1]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Comment */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} className="text-[#a1a1aa]" />
                      <h4 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                        Comment
                      </h4>
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment (optional)..."
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#18181f] border border-[#27272a] text-sm text-[#fafafa] placeholder:text-[#52525b] outline-none resize-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#27272a] flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReject}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/10 text-red-400 border border-red-600/20 text-sm font-medium hover:bg-red-600/20 transition-colors"
                  >
                    <XCircle size={16} />
                    Reject
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApprove}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#5558e6] transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-[#52525b]">No item selected</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

ApprovalDrawer.displayName = 'ApprovalDrawer';

export { ApprovalDrawer };
export default ApprovalDrawer;
