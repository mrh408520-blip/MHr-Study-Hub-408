"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function AdminPanelLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/admin/session', { credentials: 'include' });
        const data = await response.json();
        if (!response.ok || !data?.authenticated) {
          router.replace('/admin');
          return;
        }
      } catch (error) {
        router.replace('/admin');
        return;
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060913] text-slate-300">
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0d1323] px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-white">
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar title="Dashboard" subtitle="Admin panel" onMenuToggle={() => setSidebarOpen((current) => !current)} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
