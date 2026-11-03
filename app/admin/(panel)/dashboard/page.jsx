"use client";

import { useEffect, useState } from 'react';
import { ArrowUpRight, Banknote, BookOpen, BriefcaseBusiness, FileText, GraduationCap, IndianRupee, Users } from 'lucide-react';
import StatCard from '../../components/StatCard';

export default function DashboardPage() {
  const [data, setData] = useState({ stats: {}, recentAdmissions: [], recentPayments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/admin/dashboard', { credentials: 'include' });
        if (!response.ok) throw new Error('Unauthorized');
        const json = await response.json();
        setData(json);
      } catch (error) {
        setData({ stats: {}, recentAdmissions: [], recentPayments: [] });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = [
    { label: 'Total Applications', value: data?.stats?.totalApplications ?? 0, change: '+12%', tone: 'blue', icon: FileText },
    { label: 'Pending Applications', value: data?.stats?.pendingApplications ?? 0, change: '4 today', tone: 'amber', icon: BriefcaseBusiness },
    { label: 'Confirmed Admissions', value: data?.stats?.confirmedAdmissions ?? 0, change: '+8%', tone: 'green', icon: GraduationCap },
    { label: 'Total Students', value: data?.stats?.totalStudents ?? 0, change: '+2.1%', tone: 'purple', icon: Users },
    { label: 'Total Courses', value: data?.stats?.totalCourses ?? 0, change: '8 live', tone: 'blue', icon: BookOpen },
    { label: 'Total Payments', value: `₹${Number(data?.stats?.totalPayments ?? 0).toLocaleString('en-IN')}`, change: '+18%', tone: 'green', icon: IndianRupee },
    { label: 'Successful Payments', value: data?.stats?.successfulPayments ?? 0, change: '92% success', tone: 'green', icon: Banknote },
    { label: 'Pending Payments', value: data?.stats?.pendingPayments ?? 0, change: '8% pending', tone: 'amber', icon: ArrowUpRight },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
          <p className="mt-1 text-sm text-slate-400">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1323] p-6 text-slate-300">Loading dashboard…</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent Admissions</h3>
                <a href="/admin/admissions" className="text-sm text-indigo-400 hover:text-indigo-300">View all</a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="pb-3 pr-4">#</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Course</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentAdmissions.length === 0 ? (
                      <tr><td colSpan={5} className="py-6 text-center text-slate-400">No admissions available.</td></tr>
                    ) : (
                      data.recentAdmissions.map((item, index) => (
                        <tr key={item._id || index} className="border-t border-slate-800 text-slate-200">
                          <td className="py-3 pr-4">#{index + 1}</td>
                          <td className="py-3 pr-4">{item.fullName}</td>
                          <td className="py-3 pr-4">{item.course}</td>
                          <td className="py-3 pr-4">₹{Number(item.amount || 0).toLocaleString('en-IN')}</td>
                          <td className="py-3 pr-4"><span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] uppercase tracking-wide text-emerald-300">{item.admissionStatus}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Recent Payments</h3>
                <a href="/admin/admissions" className="text-sm text-indigo-400 hover:text-indigo-300">View all</a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Course</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentPayments.length === 0 ? (
                      <tr><td colSpan={4} className="py-6 text-center text-slate-400">No payments available.</td></tr>
                    ) : (
                      data.recentPayments.map((item, index) => (
                        <tr key={item._id || index} className="border-t border-slate-800 text-slate-200">
                          <td className="py-3 pr-4">{item.name}</td>
                          <td className="py-3 pr-4">{item.course}</td>
                          <td className="py-3 pr-4">₹{Number(item.amount || 0).toLocaleString('en-IN')}</td>
                          <td className="py-3 pr-4">{item.method}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
