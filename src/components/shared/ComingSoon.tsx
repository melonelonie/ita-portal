import { motion } from 'framer-motion';
import { Construction, ArrowLeft, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  details?: string[];
}

/**
 * Professional placeholder for features that are designed on the frontend
 * but awaiting backend API integration before they can function.
 */
export default function ComingSoon({
  title,
  description,
  icon: Icon = Construction,
  details,
}: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="text-center max-w-lg px-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <Icon className="w-10 h-10 text-amber-400" />
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">{title}</h1>
        <p className="text-sm text-zinc-400 leading-relaxed mb-6">{description}</p>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-xs text-amber-400 font-medium">Backend Integration In Progress</span>
        </div>

        {/* Detail list */}
        {details && details.length > 0 && (
          <div className="text-left mx-auto max-w-sm mb-8 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-3">Planned Capabilities</p>
            <ul className="space-y-2">
              {details.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-300 hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </motion.div>
  );
}
