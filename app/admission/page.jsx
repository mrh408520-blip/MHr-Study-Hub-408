'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { COURSES, SITE } from '@/lib/coursesData';
import { ArrowRight, CheckCircle2, Copy, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

function AdmissionInner(){
  const params = useSearchParams();
  const preselected = params.get('course') || '';
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName:'', phone:'', whatsapp:'', email:'', age:'', gender:'', education:'', address:'', course: preselected, message:''
  });
  const [submitting, setSubmitting] = useState(false);
  const [admission, setAdmission] = useState(null);
  const [txnId, setTxnId] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { if (preselected) setForm(f => ({...f, course: preselected})); }, [preselected]);

  const upiUrl = `upi://pay?pa=${encodeURIComponent(SITE.upiId)}&pn=${encodeURIComponent(SITE.upiName)}&am=${SITE.seatLockFee}&cu=INR&tn=${encodeURIComponent('MRH Seat Lock')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=6&data=${encodeURIComponent(upiUrl)}`;

  const submitForm = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.phone || !form.email || !form.course) { setError('Please fill in all required fields.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admissions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setAdmission(data);
      setStep(2);
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    setError('');
    if (!txnId) { setError('Enter your UPI transaction/reference ID.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admissions/${admission.id}/payment`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ transactionId: txnId, paymentNote }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setConfirmed(data);
      setStep(3);
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  const copy = (t) => navigator.clipboard?.writeText(t);

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-32 sm:pt-40 pb-10 relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.25),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-blue-200"><Sparkles className="w-3 h-3" /> Admission Form</div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-gradient">Lock your seat for just ₹20</h1>
          <p className="mt-3 text-white/60">A small refundable seat-lock fee helps us confirm your batch. Fill the form, pay via UPI QR, and our team will verify within a few hours.</p>

          <div className="mt-8 flex items-center gap-2">
            {[1,2,3].map(n => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step>=n ? 'bg-gradient-to-br from-blue-500 to-indigo-700 border-transparent text-white' : 'border-white/20 text-white/50'}`}>{n}</div>
                {n<3 && <div className={`w-16 h-px ${step>n ? 'bg-blue-400' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form key="f1" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} onSubmit={submitForm} className="rounded-3xl p-6 sm:p-10 glass">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full Name*" value={form.fullName} onChange={v => setForm({...form, fullName:v})} />
                  <Field label="Phone*" value={form.phone} onChange={v => setForm({...form, phone:v})} />
                  <Field label="WhatsApp" value={form.whatsapp} onChange={v => setForm({...form, whatsapp:v})} />
                  <Field label="Email*" value={form.email} onChange={v => setForm({...form, email:v})} type="email" />
                  <Field label="Age" value={form.age} onChange={v => setForm({...form, age:v})} />
                  <SelectField label="Gender" value={form.gender} onChange={v => setForm({...form, gender:v})} options={['','Male','Female','Other']} />
                  <Field label="Education" value={form.education} onChange={v => setForm({...form, education:v})} />
                  <SelectField label="Choose Course*" value={form.course} onChange={v => setForm({...form, course:v})} options={['', ...COURSES.map(c=>c.slug)]} render={(v)=> v ? (COURSES.find(c=>c.slug===v)?.title || v) : 'Select a course'} />
                  <div className="sm:col-span-2"><Field label="Address" value={form.address} onChange={v => setForm({...form, address:v})} /></div>
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Message (optional)</label>
                    <textarea value={form.message} onChange={e => setForm({...form, message:e.target.value})} rows={3} className="mt-1 w-full rounded-xl bg-white/[0.04] border border-white/10 p-3 text-white outline-none focus:border-blue-500/50" />
                  </div>
                </div>
                {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-white/50">By continuing you agree to be contacted by MR.H Studio.</div>
                  <button disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-700 hover:from-blue-400 hover:to-indigo-600 glow disabled:opacity-60">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue to Payment <ArrowRight className="w-4 h-4" /></>}</button>
                </div>
              </motion.form>
            )}

            {step === 2 && admission && (
              <motion.div key="f2" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="grid md:grid-cols-2 gap-6">
                <div className="rounded-3xl p-6 sm:p-8 glass">
                  <div className="text-xs uppercase tracking-widest text-blue-300">Seat Lock Payment</div>
                  <div className="mt-1 text-2xl font-black">Pay ₹{SITE.seatLockFee} via UPI</div>
                  <div className="mt-4 rounded-2xl bg-white p-4 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt="UPI QR" className="w-72 h-72" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div><div className="text-white/50 text-xs">UPI ID</div><div className="font-mono">{SITE.upiId}</div></div>
                    <button onClick={() => copy(SITE.upiId)} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg glass hover:bg-white/10"><Copy className="w-3.5 h-3.5" /> Copy</button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div><div className="text-white/50 text-xs">Payee</div><div>{SITE.upiName}</div></div>
                    <a href={upiUrl} className="px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs">Open UPI App</a>
                  </div>
                  <div className="mt-4 rounded-xl p-3 bg-blue-500/10 border border-blue-500/20 text-xs text-blue-100">₹20 is a small seat-lock/registration fee. Once your batch is confirmed, this can be adjusted against your course fee — per admin’s policy.</div>
                </div>
                <form onSubmit={submitPayment} className="rounded-3xl p-6 sm:p-8 glass">
                  <div className="text-xs uppercase tracking-widest text-blue-300">Confirm Payment</div>
                  <div className="mt-1 text-2xl font-black">Submit transaction proof</div>
                  <div className="mt-6">
                    <label className="text-xs uppercase tracking-widest text-white/50">UPI Transaction / Reference ID*</label>
                    <input value={txnId} onChange={e => setTxnId(e.target.value)} className="mt-1 w-full rounded-xl bg-white/[0.04] border border-white/10 p-3 text-white outline-none focus:border-blue-500/50" placeholder="e.g. 4XXXXXXXXX" />
                  </div>
                  <div className="mt-4">
                    <label className="text-xs uppercase tracking-widest text-white/50">Note (optional)</label>
                    <textarea rows={4} value={paymentNote} onChange={e => setPaymentNote(e.target.value)} className="mt-1 w-full rounded-xl bg-white/[0.04] border border-white/10 p-3 text-white outline-none focus:border-blue-500/50" placeholder="Any info you want to share about the payment" />
                  </div>
                  {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xs text-white/50">Ref: <span className="font-mono text-white/70">{admission.id.slice(0,8)}</span></div>
                    <button disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-700 disabled:opacity-60">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Submit for Verification <ArrowRight className="w-4 h-4" /></>}</button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && confirmed && (
              <motion.div key="f3" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="rounded-3xl p-10 glass text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="mt-6 text-3xl sm:text-4xl font-black text-gradient">Application submitted!</h2>
                
                {/* YAHAN CHANGE KIYA HAI: confirmed.fullName -> form.fullName aur confirmed.phone -> form.phone */}
                <p className="mt-3 text-white/70 max-w-lg mx-auto">
                  Thank you, {form.fullName}. Our team will verify your payment and contact you shortly on <span className="text-white">{form.phone}</span>.
                </p>
                
                {/* YAHAN CHANGE KIYA HAI: confirmed.id -> admission.id */}
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> Reference ID: <span className="font-mono text-blue-200">{admission.id}</span>
                </div>
                
                <div className="mt-8 flex justify-center gap-3">
                  <Link href="/" className="px-5 py-3 rounded-xl glass hover:bg-white/10">Back to Home</Link>
                  <Link href="/courses" className="px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-700">Explore more courses</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Field({ label, value, onChange, type='text' }){
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-white/50">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full rounded-xl bg-white/[0.04] border border-white/10 p-3 text-white outline-none focus:border-blue-500/50" />
    </div>
  );
}
function SelectField({ label, value, onChange, options, render }){
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-white/50">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="mt-1 w-full rounded-xl bg-white/[0.04] border border-white/10 p-3 text-white outline-none focus:border-blue-500/50">
        {options.map((o,idx) => <option key={idx} value={o} className="bg-[#020617]">{render ? render(o) : (o || `Select ${label}`)}</option>)}
      </select>
    </div>
  );
}

export default function AdmissionPage(){
  return <Suspense fallback={<div className="pt-40 text-center text-white/60">Loading…</div>}><AdmissionInner /></Suspense>;
}
