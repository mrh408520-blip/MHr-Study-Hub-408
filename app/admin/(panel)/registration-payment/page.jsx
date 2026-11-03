"use client";

import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, CircleDollarSign, IndianRupee, RefreshCcw, ShieldCheck, Upload, X } from 'lucide-react';
import { SITE } from '@/lib/siteData';

const DEFAULT_SEAT_LOCK_FEE = Number(SITE.seatLockFee ?? 20);

function formatLastUpdated(value) {
  if (!value) return 'Not available yet';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available yet';

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function RegistrationPaymentSettingsPage() {
  const [settings, setSettings] = useState({
    registrationPrice: DEFAULT_SEAT_LOCK_FEE,
    paymentQrUrl: '',
    lastUpdatedAt: new Date().toISOString(),
  });
  const [priceInput, setPriceInput] = useState(String(DEFAULT_SEAT_LOCK_FEE));
  const [priceMessage, setPriceMessage] = useState('');
  const [qrPreview, setQrPreview] = useState('');
  const [qrFile, setQrFile] = useState(null);
  const [qrMessage, setQrMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/admin/settings', { credentials: 'include', cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
        if (!response.ok) throw new Error('Unauthorized');

        const data = await response.json();
        const activePrice = Number(data.registrationPrice ?? DEFAULT_SEAT_LOCK_FEE);
        const activeQr = data.paymentQrUrl || '';

        setSettings({
          registrationPrice: activePrice,
          paymentQrUrl: activeQr,
          lastUpdatedAt: data.lastUpdatedAt || data.updatedAt || new Date().toISOString(),
        });
        setPriceInput(String(activePrice));
        setQrPreview(activeQr);
      } catch (error) {
        setPriceMessage('Unable to load current settings.');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handlePriceSubmit = async (event) => {
    event.preventDefault();
    const parsedPrice = Number(priceInput);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setPriceMessage('Enter a valid registration amount in INR (₹).');
      return;
    }

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'price',
          registrationPrice: parsedPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to update registration price.');
      }

      const nextPrice = Number(data.registrationPrice ?? parsedPrice);
      const nextQrUrl = data.paymentQrUrl || settings.paymentQrUrl || '';
      setSettings((current) => ({
        ...current,
        registrationPrice: nextPrice,
        paymentQrUrl: nextQrUrl,
        lastUpdatedAt: data.lastUpdated || current.lastUpdatedAt,
      }));
      setQrPreview(nextQrUrl);
      setPriceInput(String(nextPrice));
      setPriceMessage('Registration price updated successfully.');
    } catch (error) {
      setPriceMessage(error.message || 'Unable to update registration price.');
    }
  };

  const handleQrChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
    setQrMessage('');
  };

  const handleQrUpload = async () => {
    if (!qrFile) {
      setQrMessage('Please choose a QR code image before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('action', 'qr');
    formData.append('file', qrFile);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to replace QR code.');
      }

      setSettings((current) => ({
        ...current,
        paymentQrUrl: data.paymentQrUrl || current.paymentQrUrl,
        lastUpdatedAt: data.lastUpdated || current.lastUpdatedAt,
      }));
      setQrPreview(data.paymentQrUrl || qrPreview);
      setQrMessage('Payment QR code updated successfully.');
      setQrFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setQrMessage(error.message || 'Unable to replace QR code.');
    }
  };

  const handleQrCancel = () => {
    setQrFile(null);
    setQrPreview(settings.paymentQrUrl || '');
    setQrMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const activeQrUrl = qrPreview || settings.paymentQrUrl || '';

  return (
    <div className="space-y-9 p-0">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="bg-gradient-to-r from-[#d99dff] via-[#b27dff] to-[#8d8dff] bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl">
            Registration &amp; Payment Settings
          </h2>
          <p className="text-sm text-slate-400 md:text-base">
            Manage registration price and payment QR code for your platform.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 rounded-2xl border border-violet-500/30 bg-[#120d2a]/80 px-4 py-3 shadow-[0_0_24px_rgba(139,92,246,0.12)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/40 bg-[#22123c] text-violet-200">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-violet-200/80">Last Updated</div>
            <div className="mt-1 text-sm font-semibold text-white">
              {formatLastUpdated(settings.lastUpdatedAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[26px] border border-violet-500/40 bg-[#12192d]/90 p-4 shadow-[0_0_30px_rgba(104,84,196,0.12)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-violet-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white md:text-[2rem]">Registration Price Management</h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Active
            </span>
          </div>

          <div className="mb-5 rounded-2xl border border-violet-400/30 bg-gradient-to-r from-[#1d2447] to-[#161d33] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/50 bg-violet-500/10 text-violet-200">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-200">Current Registration Price</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                <Check className="h-3.5 w-3.5" />
                Active Price
              </span>
            </div>

            <div className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
              ₹{Number(settings.registrationPrice || 0).toFixed(2).replace(/\.00$/, '.00')}
            </div>
          </div>

          <form onSubmit={handlePriceSubmit} className="space-y-4">
            <div>
              <label htmlFor="registration-price" className="mb-2 block text-lg font-semibold text-white">
                New Registration Price <span className="text-violet-300">*</span>
              </label>
              <div className="flex items-center overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1323] shadow-inner shadow-slate-950/50">
                <div className="flex h-[58px] w-[58px] items-center justify-center border-r border-slate-700 bg-[#141d31] text-xl font-semibold text-violet-200">
                  ₹
                </div>
                <input
                  id="registration-price"
                  type="number"
                  min="1"
                  step="1"
                  value={priceInput}
                  onChange={(event) => setPriceInput(event.target.value)}
                  placeholder="Enter new amount (e.g., 20, 50, 100)"
                  className="h-[58px] w-full border-0 bg-transparent px-4 text-lg text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {priceMessage ? (
              <p className="text-sm text-slate-300">{priceMessage}</p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-violet-400/50 text-[10px] text-violet-200">i</span>
                Enter the new registration amount in INR (₹).
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-violet-400/70 bg-gradient-to-r from-violet-500 to-indigo-600 px-5 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              <RefreshCcw className="h-5 w-5" />
              Update Registration Price
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3 border-t border-violet-500/20 pt-4 text-base text-slate-300">
            <CalendarDays className="h-5 w-5 text-violet-200" />
            <span className="font-medium text-white">Last Updated:</span>
            <span>{formatLastUpdated(settings.lastUpdatedAt)}</span>
          </div>
        </section>

        <section className="rounded-[26px] border border-violet-500/40 bg-[#12192d]/90 p-4 shadow-[0_0_30px_rgba(104,84,196,0.12)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-violet-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white md:text-[2rem]">Payment QR Code Management</h3>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Active
            </span>
          </div>

          <div className="mb-5 rounded-[22px] border border-violet-400/30 bg-[#181f38] p-4">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="text-lg font-semibold text-white">Current Payment QR</div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                <Check className="h-3.5 w-3.5" />
                Active
              </span>
            </div>

            <div className="flex items-center justify-center rounded-[24px] border border-violet-500/30 bg-white p-2 shadow-[0_0_25px_rgba(255,255,255,0.12)]">
              {activeQrUrl ? (
                <img src={activeQrUrl} alt="Current payment QR code" className="h-[250px] w-[250px] rounded-[18px] object-cover" />
              ) : (
                <div className="flex h-[250px] w-[250px] items-center justify-center rounded-[18px] bg-slate-100 text-sm text-slate-500">
                  No QR code yet
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-[54px] flex-1 items-center gap-3 overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1323] px-3">
                <Upload className="h-5 w-5 text-violet-200" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleQrChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-left text-base font-medium text-slate-300 hover:text-white"
                >
                  {qrFile ? qrFile.name : 'Choose QR Code (PNG, JPG, WebP)'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border border-violet-500/50 bg-violet-500/15 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/25"
              >
                Browse
              </button>
            </div>

            {qrPreview && qrPreview !== settings.paymentQrUrl ? (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-violet-500/40 bg-[#1a1b33] p-3">
                <img src={qrPreview} alt="QR preview" className="h-[180px] w-[180px] rounded-xl bg-white p-2" />
              </div>
            ) : null}

            {qrMessage ? <p className="text-sm text-slate-300">{qrMessage}</p> : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleQrUpload}
                className="flex items-center justify-center gap-2 rounded-2xl border border-violet-500/50 bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-3 text-base font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.28)] transition hover:brightness-110"
              >
                <Upload className="h-5 w-5" />
                Replace QR Code
              </button>
              <button
                type="button"
                onClick={handleQrCancel}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-[#0d1323] px-4 py-3 text-base font-semibold text-slate-200 transition hover:bg-[#131d2f]"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-violet-500/20 pt-4 text-base text-slate-300">
            <CalendarDays className="h-5 w-5 text-violet-200" />
            <span className="font-medium text-white">Last Updated:</span>
            <span>{formatLastUpdated(settings.lastUpdatedAt)}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
