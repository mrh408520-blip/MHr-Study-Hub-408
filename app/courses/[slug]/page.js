'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { getCourse, COURSES } from '@/lib/coursesData';
import { CheckCircle2, GraduationCap, BookOpen, Award, ArrowRight, Sparkles, Users, Clock, IndianRupee, ShieldCheck } from 'lucide-react';

export default function CoursePage(){
  const { slug } = useParams();
  const router = useRouter();
  const c = getCourse(slug);
  if (!c) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-40 text-center">
          <h1 className="text-3xl font-bold">Course not found</h1>
          <Link href="/courses" className="mt-4 inline-block text-blue-300">Back to courses</Link>
        </div>
      </main>
    );
  }
  const related = COURSES.filter(x => x.slug !== c.slug).slice(0,3);
  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-28 sm:pt-32 pb-10 relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-10`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.35),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/courses" className="text-sm text-white/60 hover:text-white">← All Courses</Link>
          <div className="mt-5 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest bg-gradient-to-r ${c.color} text-white font-bold`}>{c.level} · Certificate Included</div>
              <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-gradient">{c.title}</h1>
              <p className="mt-4 text-white/70 text-lg max-w-2xl">{c.short}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/admission?course=${c.slug}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-700 hover:from-blue-400 hover:to-indigo-600 glow">Apply for this course <ArrowRight className="w-4 h-4" /></Link>
                <a href="https://wa.me/917668944271" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium glass hover:bg-white/10">Ask a question</a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 self-start">
              {[
                {i:Clock,l:'Duration',v:c.duration},
                {i:IndianRupee,l:'Fee',v:`₹${c.fee}`},
                {i:Users,l:'For',v:c.level},
                {i:Award,l:'Certificate',v:'Yes'},
              ].map((x,idx)=>(
                <div key={idx} className="rounded-2xl p-5 glass">
                  <x.i className="w-5 h-5 text-blue-400" />
                  <div className="mt-3 text-[10px] uppercase tracking-widest text-white/50">{x.l}</div>
                  <div className="text-white font-bold">{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-blue-200"><Sparkles className="w-3 h-3" /> Curriculum</div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black text-gradient">Full Syllabus · {c.syllabus.length} modules</h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {c.syllabus.map((s,idx)=>(
                <motion.div key={idx} initial={{opacity:0,x:-10}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:idx*0.02}} className="flex items-center gap-3 p-3.5 rounded-xl glass hover:border-blue-500/30">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-200">{String(idx+1).padStart(2,'0')}</div>
                  <div className="text-sm text-white/90">{s}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <aside className="space-y-5">
            <div className="rounded-2xl p-6 glass">
              <div className="text-xs uppercase tracking-widest text-blue-300">Learning Outcomes</div>
              <ul className="mt-4 space-y-3">
                {c.outcomes.map((o,idx)=>(
                  <li key={idx} className="flex gap-2 text-sm text-white/80"><CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />{o}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl p-6 glass">
              <div className="text-xs uppercase tracking-widest text-blue-300">Who is this for</div>
              <p className="mt-3 text-sm text-white/80">{c.who}</p>
            </div>
            <div className="rounded-2xl p-6 glass">
              <div className="flex items-center gap-2 text-emerald-300"><ShieldCheck className="w-4 h-4" /> <span className="text-xs uppercase tracking-widest">Verified Certificate</span></div>
              <p className="mt-3 text-sm text-white/80">Every certificate is issued with a unique ID that can be verified online.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h3 className="text-2xl font-black text-gradient">Related courses</h3>
          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            {related.map(r => (
              <Link key={r.slug} href={`/courses/${r.slug}`} className="group rounded-2xl p-5 glass hover:border-blue-500/30 transition">
                <div className="text-white font-semibold">{r.title}</div>
                <div className="mt-1 text-sm text-white/60 line-clamp-2">{r.short}</div>
                <div className="mt-4 flex items-center gap-1 text-sm text-blue-300 group-hover:gap-2 transition-all">Explore <ArrowRight className="w-4 h-4" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
