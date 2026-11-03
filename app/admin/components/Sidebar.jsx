"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, ReceiptText, WalletCards, X } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/admissions', label: 'Admissions', icon: ReceiptText },
  { href: '/admin/students', label: 'Students', icon: GraduationCap },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/registration-payment', label: 'Registration & Payment', icon: WalletCards },
];

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      router.push('/admin');
    }
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/70 transition-opacity duration-200 lg:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] shrink-0 border-r border-slate-800 bg-[#0d1323] shadow-2xl shadow-slate-950/50 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[240px] lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
            <div className="flex items-center justify-center w-full">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 text-xl font-black text-white shadow-lg shadow-indigo-500/30">
                M
              </div>
            </div>

            <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-slate-300 transition hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-3 py-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={handleNavClick}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#1e3a8a]/40 text-white ring-1 ring-blue-500/50 shadow-inner shadow-blue-500/10'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
