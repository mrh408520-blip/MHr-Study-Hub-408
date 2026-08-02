'use client';
import { motion } from 'framer-motion';

export default function Logo({ size = 40, showText = true, className = '' }){
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        initial={{ rotate: -20, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 via-blue-700 to-indigo-900 shadow-[0_0_40px_-8px_rgba(59,130,246,0.7)]" />
        <div className="absolute inset-[2px] rounded-[10px] bg-[#020617] flex items-center justify-center">
          <svg viewBox="0 0 40 40" width={size*0.65} height={size*0.65}>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
            </defs>
            <path d="M6 30 L6 10 L14 10 L20 20 L26 10 L34 10 L34 30 L28 30 L28 20 L22 30 L18 30 L12 20 L12 30 Z" fill="url(#lg)" stroke="#93c5fd" strokeWidth="0.4" />
            <circle cx="34" cy="30" r="2.2" fill="#38bdf8" />
          </svg>
        </div>
      </motion.div>
      {showText && (
        <div className="leading-tight">
          <div className="font-black text-white tracking-tight text-lg sm:text-xl">MR.H <span className="text-blue-400">Studio</span></div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-blue-300/70">Roorkee · India</div>
        </div>
      )}
    </div>
  );
}
