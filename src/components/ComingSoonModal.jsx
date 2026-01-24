import React from "react";
import { X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ComingSoonModal = ({ isOpen, featureName, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-primary-darker)] p-8 text-center border border-white/10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition text-white"
        >
          <X size={24} />
        </button>

        {/* Sparkles Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-6"
        >
          <Sparkles size={48} className="text-[var(--color-warm)]" />
        </motion.div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-4">
          {featureName}
        </h2>

        {/* Coming Soon Text */}
        <p className="text-white/80 text-lg mb-2">Coming Soon</p>
        <p className="text-white/60 text-sm mb-8">
          We're working hard to bring this feature to you. Stay tuned!
        </p>

        {/* Progress Bar Animation */}
        <div className="mb-8">
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute h-full bg-gradient-to-r from-[var(--color-warm)] to-[#FF6B35] rounded-full"
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-[var(--color-warm)] text-[var(--color-primary-darker)] font-semibold rounded-xl hover:bg-opacity-90 transition shadow-lg"
        >
          Understood, Let's Go Back
        </button>

        {/* Footer Text */}
        <p className="text-white/50 text-xs mt-6">
          Check back soon for updates
        </p>
      </motion.div>
    </div>
  );
};

export default ComingSoonModal;
