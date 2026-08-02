'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function Preloader(){
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center"
        >
          <div className="absolute inset-0 opacity-40" style={{background:'radial-gradient(1200px circle at 50% 50%, rgba(59,130,246,0.25), transparent 40%)'}} />
          <div className="relative flex flex-col items-center gap-6">
            <Logo size={72} showText />
            <div className="w-52 h-[3px] rounded-full overflow-hidden bg-white/10">
              <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.4, ease: 'easeInOut' }} className="h-full w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            </div>
            <div className="text-xs uppercase tracking-[0.4em] text-blue-300/80">Loading experience</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
