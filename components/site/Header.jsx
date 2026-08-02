'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { Phone, MessageCircle, Menu, X } from 'lucide-react';
import { SITE } from '@/lib/coursesData';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/admission', label: 'Admission' },
  { href: '/verify', label: 'Verify Certificate' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header(){
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-[#020617]/70 border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/"><Logo size={40} /></Link>
        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition">{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${SITE.phone}`} className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-blue-100 border border-white/10 hover:bg-white/5"><Phone className="w-3.5 h-3.5" />{SITE.phone}</a>
          <a href={`https://wa.me/91${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-lg shadow-blue-900/40"><MessageCircle className="w-4 h-4" />WhatsApp</a>
          <button onClick={() => setOpen(v => !v)} className="lg:hidden p-2 text-white">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden bg-[#020617]/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-6 py-4 flex flex-col">
              {LINKS.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-white/90 border-b border-white/5">{l.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
