'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { ShieldCheck, XCircle, Loader2, Search, CheckCircle2, Sparkles, Award } from 'lucide-react';

export default function VerifyPage(){
  const [cid, setCid] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const search = async (e) => {
    e.preventDefault();
    setError(''); setResult(null);
    if (!cid.trim()) { setError('Please enter a Certificate ID.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/certificates/verify', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ certificateId: cid }) });
      const data = await res.json();
      setResult(data);
    } catch { setError('Something went wrong'); } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-32 sm:pt-40 pb-10 relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.25),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-blue-200"><Sparkles className="w-3 h-3" /> Certificate Verification</div>
          <h1 className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-gradient">Verify a certificate</h1>
          <p className="mt-4 text-white/60">Enter the unique Certificate ID printed on your MR.H Studio certificate to instantly verify its status.</p>
          <form onSubmit={search} className="mt-8 glass rounded-2xl p-2 flex items-center gap-2">
            <Search className="w-5 h-5 text-white/40 ml-3" />
            <input value={cid} onChange={e => setCid(e.target.value)} placeholder="e.g. MRH-1001" className="flex-1 bg-transparent p-3 text-white outline-none tracking-wider font-mono" />
            <button disabled={loading} className="px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-700 disabled:opacity-60">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}</button>
          </form>
          {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
          <div className="mt-3 text-xs text-white/40">Try sample: MRH-PY-2025-0001 · MRH-EX-2025-0007 · MRH-SQ-2024-0021</div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <AnimatePresence>
            {result && (
              <motion.div key="res" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="rounded-3xl overflow-hidden border border-white/10">
                {result.found && result.certificate?.status === 'valid' && (
                  <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
                    <div className="flex items-center gap-3"><CheckCircle2 className="w-8 h-8 text-emerald-400" /><div><div className="text-emerald-300 font-bold uppercase tracking-widest text-xs">Valid Certificate</div><div className="text-white text-2xl font-black">{result.certificate.studentName}</div></div></div>
                    <div className="mt-6 grid sm:grid-cols-3 gap-4">
                      <Info label="Course" value={result.certificate.courseName} />
                      <Info label="Issue Date" value={result.certificate.issueDate} />
                      <Info label="Certificate ID" value={result.certificate.certificateId} mono />
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs text-white/60"><Award className="w-4 h-4 text-blue-400" /> Issued by MR.H Studio, Roorkee.</div>
                  </div>
                )}
                {result.found && result.certificate?.status !== 'valid' && (
                  <div className="p-8 bg-gradient-to-br from-rose-500/10 to-orange-500/10">
                    <div className="flex items-center gap-3"><XCircle className="w-8 h-8 text-rose-400" /><div><div className="text-rose-300 font-bold uppercase tracking-widest text-xs">Certificate {result.certificate.status}</div><div className="text-white text-2xl font-black">{result.certificate.studentName}</div></div></div>
                    <div className="mt-6 grid sm:grid-cols-3 gap-4">
                      <Info label="Course" value={result.certificate.courseName} />
                      <Info label="Issue Date" value={result.certificate.issueDate} />
                      <Info label="Certificate ID" value={result.certificate.certificateId} mono />
                    </div>
                    <div className="mt-6 text-xs text-white/60">This certificate is no longer valid. Please contact MR.H Studio for details.</div>
                  </div>
                )}
                {!result.found && (
                  <div className="p-8 bg-gradient-to-br from-rose-500/10 to-slate-500/10">
                    <div className="flex items-center gap-3"><XCircle className="w-8 h-8 text-rose-400" /><div><div className="text-rose-300 font-bold uppercase tracking-widest text-xs">Not Found</div><div className="text-white text-2xl font-black">Unknown Certificate</div></div></div>
                    <div className="mt-3 text-sm text-white/70">We couldn’t find a certificate with that ID. Please double-check the ID or contact us.</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Info({ label, value, mono }){
  return (
    <div className="rounded-2xl p-4 glass">
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className={`mt-1 text-white ${mono ? 'font-mono' : 'font-semibold'}`}>{value}</div>
    </div>
  );
}
