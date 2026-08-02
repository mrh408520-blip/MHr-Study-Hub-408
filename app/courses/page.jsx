'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { COURSES } from '@/lib/coursesData';
import { ArrowRight, GraduationCap, BookOpen, Sparkles } from 'lucide-react';

export default function CoursesPage(){
  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-32 sm:pt-40 pb-14 relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.25),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-blue-200"><Sparkles className="w-3 h-3" /> All Programs</div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-gradient">Our Courses</h1>
          <p className="mt-4 text-white/60 max-w-2xl">Every course is designed for beginners and includes a verified certificate on completion.</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((c,idx) => (
            <motion.div key={c.slug} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:idx*0.05}}>
              <Link href={`/courses/${c.slug}`} className="group relative block h-full rounded-2xl border border-white/10 p-7 overflow-hidden bg-gradient-to-b from-white/[0.03] to-transparent hover:from-white/[0.06] transition">
                <div className={`absolute -top-16 -right-16 w-52 h-52 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-3xl group-hover:opacity-40 transition`} />
                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest bg-gradient-to-r ${c.color} text-white font-bold`}>{c.level}</div>
                <h3 className="mt-4 text-2xl font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-white/60">{c.short}</p>
                <div className="mt-6 flex items-center gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {c.duration}</div>
                  <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {c.syllabus.length} modules</div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div><div className="text-xs text-white/50">Course Fee</div><div className="text-2xl font-black">₹{c.fee}</div></div>
                  <div className="flex items-center gap-1 text-sm text-blue-300 group-hover:gap-3 transition-all">Explore <ArrowRight className="w-4 h-4" /></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
