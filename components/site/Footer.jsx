import Link from 'next/link';
import Logo from './Logo';
import { SITE } from '@/lib/siteData';
import { Phone, Mail, MapPin, MessageCircle, Youtube, Instagram, Facebook } from 'lucide-react';

export default function Footer(){
  return (
    <footer className="relative border-t border-white/10 bg-[#020617]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Logo size={44} />
          <p className="mt-4 text-sm text-white/60 leading-relaxed">A premium coaching studio in Roorkee helping learners master computers, coding and data — one confident step at a time.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/courses">All Courses</Link></li>
            <li><Link href="/admission">Admission</Link></li>
            <li><Link href="/verify">Verify Certificate</Link></li>
            <li><Link href="/#contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-400" /><a href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>
            <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-blue-400" /><a href={`https://wa.me/91${SITE.whatsapp}`}>{SITE.whatsapp}</a></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-400" /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" />{SITE.address}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Follow</h4>
          <div className="flex gap-3">
            <a href={SITE.social.youtube} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/5"><Youtube className="w-4 h-4" /></a>
            <a href={SITE.social.instagram} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/5"><Instagram className="w-4 h-4" /></a>
            <a href={SITE.social.whatsapp} className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/5"><MessageCircle className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">© {new Date().getFullYear()} MR.H Studio · Roorkee, India · All rights reserved.</div>
    </footer>
  );
}
