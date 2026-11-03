"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        setError(data?.message || 'Invalid credentials');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060913] px-4">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute left-1/2 top-[-60px] h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.25),_transparent_35%)]" />

      <div className="relative w-full max-w-[430px] rounded-[28px] border border-slate-700 bg-[#0d1323]/90 px-7 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.8)] backdrop-blur-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 text-4xl font-black text-white shadow-lg shadow-indigo-500/30">
            M
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Username</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#070d1a] px-3 py-3 text-slate-300">
              <User className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#070d1a] px-3 py-3 text-slate-300">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                required
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword((current) => !current)}
                className="text-slate-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-[#070d1a] text-indigo-500 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <button type="button" className="text-indigo-400 hover:text-indigo-300">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
