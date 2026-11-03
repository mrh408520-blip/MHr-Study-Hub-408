"use client";

import { useEffect, useMemo, useState } from 'react';
import { Bell, Menu, Search, User, X } from 'lucide-react';

function getNotifications(data = {}) {
  const notifications = [];
  const pendingApplications = Number(data?.stats?.pendingApplications ?? 0);
  const pendingPayments = Number(data?.stats?.pendingPayments ?? 0);

  if (pendingApplications > 0) {
    notifications.push({
      id: 'pending-applications',
      title: 'Applications need review',
      message: `${pendingApplications} applicant${pendingApplications > 1 ? 's are' : ' is'} waiting for approval.`,
      time: 'Just now',
      accent: 'bg-amber-500/15 text-amber-300',
    });
  }

  if (pendingPayments > 0) {
    notifications.push({
      id: 'pending-payments',
      title: 'Payment follow-up',
      message: `${pendingPayments} payment${pendingPayments > 1 ? 's are' : ' is'} awaiting confirmation.`,
      time: '2 mins ago',
      accent: 'bg-indigo-500/15 text-indigo-300',
    });
  }

  const recentAdmissions = Array.isArray(data?.recentAdmissions) ? data.recentAdmissions : [];
  recentAdmissions.slice(0, 2).forEach((admission, index) => {
    if (!admission?.fullName) return;

    notifications.push({
      id: `admission-${admission._id || index}`,
      title: 'New admission',
      message: `${admission.fullName} enrolled for ${admission.course || 'a course'}.`,
      time: 'Today',
      accent: 'bg-emerald-500/15 text-emerald-300',
    });
  });

  return notifications.slice(0, 4);
}

export default function Topbar({ title, subtitle, searchValue, onSearchChange, searchPlaceholder = 'Search here...', onMenuToggle }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      try {
        const response = await fetch('/api/admin/dashboard', { credentials: 'include' });
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) setNotifications(getNotifications(data));
      } catch (error) {
        if (isMounted) setNotifications([]);
      }
    }

    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const unreadCount = useMemo(() => notifications.length, [notifications]);

  return (
    <header className="relative border-b border-slate-800 bg-[#0d1323]/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-xl border border-slate-700 bg-[#0b1220] p-2.5 text-slate-300 transition hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h1>
            {subtitle ? <p className="mt-1 text-xs text-slate-400 sm:text-sm">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-[#0b1220] px-3 py-2 text-slate-300 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchValue ?? ''}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-52 border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((current) => !current)}
              className="relative rounded-xl border border-slate-700 bg-[#0b1220] p-2.5 text-slate-300 transition hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-semibold text-white ring-2 ring-[#0d1323]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div className="absolute right-0 top-full z-50 mt-3 w-[320px] overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1323] shadow-2xl shadow-slate-950/60">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                  <div className="text-sm font-semibold text-white">Notifications</div>
                  {notifications.length > 0 ? (
                    <button type="button" onClick={() => setNotifications([])} className="text-[11px] font-medium text-indigo-300 hover:text-indigo-200">
                      Clear
                    </button>
                  ) : null}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className="flex gap-3 border-b border-slate-800 px-4 py-3 last:border-b-0">
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs ${notification.accent}`}>
                          •
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-white">{notification.title}</div>
                          <div className="mt-1 text-xs leading-5 text-slate-300">{notification.message}</div>
                          <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">{notification.time}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">No new notifications.</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0b1220] p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-400 text-white">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
