'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Award, BookOpen, CheckCircle2, GraduationCap, MessageCircle, Phone, Mail, Sparkles, ShieldCheck, Zap, Star, Trophy, Play } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import Preloader from '@/components/site/Preloader';
import Logo from '@/components/site/Logo';
import { COURSES, SITE } from '@/lib/coursesData';

const SLIDES = [
  { img: 'https://images.pexels.com/photos/5530484/pexels-photo-5530484.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', kicker: 'Roorkee • Est. Premium Studio', title: 'Learn. Build. Get Certified.', sub: 'Career-focused computer & coding coaching for the next generation of learners.' },
  { img: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNsYXNzfGVufDB8fHxibHVlfDE3ODU1OTE4NjB8MA&ixlib=rb-4.1.0&q=85', kicker: '8 Foundational Courses', title: 'From Computer Basics to Python & Power BI', sub: 'A structured path from your first click to your first dashboard.' },
  { img: 'https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', kicker: 'Just ₹20 to Lock Your Seat', title: 'Quick, transparent admissions.', sub: 'Pay a small refundable seat-lock fee via UPI and secure your batch instantly.' },
  { img: 'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHRyYWluaW5nfGVufDB8fHxibHVlfDE3ODU1OTE4NjV8MA&ixlib=rb-4.1.0&q=85', kicker: 'Verified Certificates', title: 'Prove what you’ve learned.', sub: 'Every certificate we issue is verifiable online with a unique ID.' },
];

function HeroSlider(){
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(v => (v+1)%SLIDES.length), 5500); return () => clearInterval(t); }, []);
  const s = SLIDES[i];
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden pt-24 sm:pt-28">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.25),transparent_60%)]" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-700/20 blur-3xl animate-float" style={{animationDelay:'2s'}} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center min-h-[calc(100svh-6rem)]">
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> {s.kicker}
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight text-gradient">{s.title}</h1>
              <p className="mt-5 text-base sm:text-lg text-white/70 max-w-xl">{s.sub}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admission" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-700 hover:from-blue-400 hover:to-indigo-600 shadow-[0_20px_60px_-20px_rgba(59,130,246,0.6)] transition-all">Apply Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" /></Link>
            <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white glass hover:bg-white/10 transition">Explore Courses</Link>
            <Link href="/verify" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-blue-200 border border-blue-500/30 hover:bg-blue-500/10 transition"><ShieldCheck className="w-4 h-4" /> Verify Certificate</Link>
          </div>

          <div className="mt-10 flex items-center gap-6">
            {SLIDES.map((_,idx) => (
              <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx===i ? 'w-10 bg-blue-400' : 'w-4 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[{n:'8',l:'Courses'},{n:'₹20',l:'Seat Lock'},{n:'100%',l:'Certified'}].map((k,idx)=>(
              <div key={idx} className="glass rounded-xl p-4">
                <div className="text-2xl font-black text-white">{k.n}</div>
                <div className="text-[11px] uppercase tracking-widest text-white/50 mt-1">{k.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div key={i}
              initial={{ opacity: 0, rotateY: 25, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -25, scale: 0.9 }}
              transition={{ duration: 0.9, ease: [0.22,1,0.36,1] }}
              style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-6 rounded-3xl overflow-hidden glow border border-white/10">
                <Image src={s.img} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-transparent" />
              </div>
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="absolute -left-4 bottom-16 glass rounded-2xl p-4 w-64">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center"><Award className="w-5 h-5 text-white" /></div>
                  <div><div className="text-sm font-semibold">Verified Certificate</div><div className="text-xs text-white/60">On successful completion</div></div>
                </div>
              </motion.div>
              <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }} className="absolute -right-2 top-14 glass rounded-2xl p-4 w-56">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
                  <div><div className="text-sm font-semibold">Batch starting soon</div><div className="text-xs text-white/60">Limited seats</div></div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Section({ id, kicker, title, subtitle, children }){
  return (
    <section id={id} className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }} className="max-w-3xl">
          {kicker && <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-blue-200"><Sparkles className="w-3 h-3" />{kicker}</div>}
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gradient">{title}</h2>
          {subtitle && <p className="mt-4 text-white/60 text-base sm:text-lg">{subtitle}</p>}
        </motion.div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function CourseCard({ c, idx }){
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx*0.05, duration: 0.5 }}>
      <Link href={`/courses/${c.slug}`} className="group relative block h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent hover:from-white/[0.06] p-6 overflow-hidden transition-all">
        <div className={`absolute -top-14 -right-14 w-40 h-40 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest bg-gradient-to-r ${c.color} text-white font-bold`}>{c.level}</div>
        <h3 className="mt-4 text-xl font-bold text-white group-hover:text-blue-200 transition">{c.title}</h3>
        <p className="mt-2 text-sm text-white/60 line-clamp-2">{c.short}</p>
        <div className="mt-6 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {c.duration}</div>
          <div className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {c.syllabus.length} modules</div>
        </div>
        <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
          <div className="text-white font-bold">₹{c.fee}</div>
          <div className="flex items-center gap-1 text-sm text-blue-300 group-hover:gap-2 transition-all">View <ArrowRight className="w-4 h-4" /></div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Page(){
  return (
    <main className="relative">
      <Preloader />
      <Header />
      <HeroSlider />

      <Section id="why" kicker="Why MR.H Studio" title="A different kind of coaching studio." subtitle="We combine premium mentorship, structured curriculum and modern tools — built for real career outcomes, not just attendance.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {i:GraduationCap,t:'Structured curriculum',d:'Carefully designed syllabus for beginners with real-world projects.'},
            {i:Award,t:'Verified certificates',d:'Every certificate has a unique ID that can be verified online.'},
            {i:ShieldCheck,t:'Transparent fees',d:'Just ₹20 to lock your seat via UPI. No hidden charges.'},
            {i:Trophy,t:'Career focused',d:'From Excel to Power BI to Python — skills that get you hired.'},
          ].map((f,idx)=>(
            <motion.div key={idx} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:idx*0.08}} className="relative rounded-2xl p-6 glass hover:border-blue-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center mb-4"><f.i className="w-5 h-5 text-white" /></div>
              <div className="font-semibold text-white">{f.t}</div>
              <p className="mt-2 text-sm text-white/60">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="courses" kicker="Our Programs" title="8 foundational courses. One clear path." subtitle="From your first Windows click to publishing a Power BI dashboard — pick a course and start today.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {COURSES.map((c,idx) => <CourseCard key={c.slug} c={c} idx={idx} />)}
        </div>
        <div className="mt-10 text-center">
          <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white glass hover:bg-white/10">See all courses <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </Section>

      <Section id="admission" kicker="Quick & Transparent" title="Lock your seat in 3 easy steps." subtitle="A simple, trustworthy admission flow with UPI seat-lock — nothing complicated.">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {n:'01',t:'Fill the admission form',d:'Share your details and pick a course.'},
            {n:'02',t:'Pay ₹20 via UPI QR',d:'Small refundable fee to confirm your seat.'},
            {n:'03',t:'Admin verifies & confirms',d:'You get a confirmation and your batch start date.'},
          ].map((step,idx)=>(
            <motion.div key={idx} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:idx*0.1}} className="relative rounded-2xl p-8 glass overflow-hidden">
              <div className="absolute -right-2 -top-6 text-[120px] font-black text-white/[0.04] leading-none">{step.n}</div>
              <div className="text-blue-400 font-semibold text-sm tracking-widest">STEP {step.n}</div>
              <div className="mt-3 text-xl font-bold text-white">{step.t}</div>
              <p className="mt-2 text-sm text-white/60">{step.d}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/admission" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-700 hover:from-blue-400 hover:to-indigo-600 glow">Start Admission <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </Section>

      <Section id="verify" kicker="Certificate Verification" title="Every certificate. Provably yours." subtitle="Employers and colleges can verify any MR.H Studio certificate instantly using its unique ID.">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            {['Enter your unique Certificate ID','Instant status check — valid, revoked or unknown','Shows student name, course & issue date','Publicly shareable verification link'].map((t,idx)=>(
              <div key={idx} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5" /><span className="text-white/80">{t}</span></div>
            ))}
            <Link href="/verify" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-700 glow">Verify a Certificate <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <motion.div initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} className="relative rounded-3xl border border-white/10 p-8 glass overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{background:'radial-gradient(600px circle at 20% 20%, rgba(59,130,246,0.5), transparent 40%)'}} />
            <div className="relative">
              <Logo size={44} />
              <div className="mt-6 text-xs uppercase tracking-widest text-blue-300">Certificate of Completion</div>
              <div className="mt-2 text-2xl font-black text-white">Student Name</div>
              <div className="mt-1 text-white/60">Basic of Python</div>
              <div className="mt-6 flex justify-between text-xs text-white/50">
                <div><div>Certificate ID</div><div className="text-white mt-1 font-mono">MRH-PY-2025-0001</div></div>
                <div><div>Issued</div><div className="text-white mt-1">Jun 2025</div></div>
              </div>
              <div className="mt-6 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm"><ShieldCheck className="w-4 h-4" /> Verified · mrhstudio.in/verify</div>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section id="contact" kicker="Contact" title="Talk to us. We reply fast." subtitle="Call, WhatsApp, or email us — or drop by our studio in Roorkee.">
        <div className="grid md:grid-cols-4 gap-5">
          <a href={`tel:${SITE.phone}`} className="group rounded-2xl p-6 glass hover:border-blue-500/30 transition">
            <Phone className="w-6 h-6 text-blue-400" />
            <div className="mt-4 text-xs uppercase tracking-widest text-white/50">Phone</div>
            <div className="mt-1 text-lg font-semibold">{SITE.phone}</div>
          </a>
          <a href={`https://wa.me/91${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="group rounded-2xl p-6 glass hover:border-blue-500/30 transition">
            <MessageCircle className="w-6 h-6 text-blue-400" />
            <div className="mt-4 text-xs uppercase tracking-widest text-white/50">WhatsApp</div>
            <div className="mt-1 text-lg font-semibold">{SITE.whatsapp}</div>
          </a>
          <a href={`mailto:${SITE.email}`} className="group rounded-2xl p-6 glass hover:border-blue-500/30 transition">
            <Mail className="w-6 h-6 text-blue-400" />
            <div className="mt-4 text-xs uppercase tracking-widest text-white/50">Email</div>
            <div className="mt-1 text-sm font-semibold break-all">{SITE.email}</div>
          </a>
          <div className="rounded-2xl p-6 glass">
            <div className="w-6 h-6 text-blue-400">📍</div>
            <div className="mt-4 text-xs uppercase tracking-widest text-white/50">Address</div>
            <div className="mt-1 text-lg font-semibold">{SITE.address}</div>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
