import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function MetricsCard({ title, value, subtitle, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 metric-card border-l-4 border-l-blue-500"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</p>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            </motion.div>
          </div>
          <motion.h3
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2 }}
            className={`text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2 tracking-tight`}
          >
            {value}
          </motion.h3>
          {subtitle && (
            <p className="text-xs text-slate-500 font-semibold">{subtitle}</p>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className={`bg-gradient-to-br ${gradient} p-4 rounded-2xl shadow-2xl relative`}
        >
          <Icon className="w-7 h-7 text-white" />
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 rounded-2xl transition-opacity"></div>
        </motion.div>
      </div>
      <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-20 rounded-full"></div>
    </motion.div>
  );
}
