"use client";

import { useEffect, useMemo, useState } from 'react';
import { Download, Search, FileText } from 'lucide-react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

export default function AdmissionsPage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [admissionFilter, setAdmissionFilter] = useState('All');
  const [selectedRow, setSelectedRow] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadRows() {
    const response = await fetch('/api/admin/admissions', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
    }
  }

  useEffect(() => {
    loadRows();
  }, []);

  const filteredRows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !trimmed || [row.fullName, row.phone, row.email, row.applicationId || row._id].some((value) => String(value || '').toLowerCase().includes(trimmed));
      const matchesCourse = courseFilter === 'All Courses' || row.course === courseFilter;
      const matchesPayment = paymentFilter === 'All' || row.paymentStatus === paymentFilter;
      const matchesAdmission = admissionFilter === 'All' || row.admissionStatus === admissionFilter;
      return matchesSearch && matchesCourse && matchesPayment && matchesAdmission;
    });
  }, [rows, query, courseFilter, paymentFilter, admissionFilter]);

  const courses = ['All Courses', ...new Set(rows.map((row) => row.course).filter(Boolean))];

  const exportCsv = () => {
    const csvRows = [
      ['Application ID', 'Student Name', 'Contact', 'Course', 'Amount', 'Payment Status', 'Admission Status', 'Date'],
      ...filteredRows.map((row) => [
        row.applicationId || row._id || '',
        row.fullName || '',
        row.phone || '',
        row.course || '',
        Number(row.amount || 0),
        row.paymentStatus || '',
        row.admissionStatus || '',
        row.createdAt ? new Date(row.createdAt).toISOString() : '',
      ])
    ];

    const content = csvRows.map((entry) => entry.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admissions-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateApplication = async (applicationId, admissionStatus, paymentStatus) => {
    if (!applicationId) return;
    setUpdatingId(applicationId);
    try {
      const response = await fetch('/api/admin/admissions', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: applicationId, admissionStatus, paymentStatus }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to update application');
      }
      await loadRows();
      setSelectedRow((current) => (current && (current._id === applicationId || current.id === applicationId) ? { ...current, admissionStatus, paymentStatus } : current));
    } catch (error) {
      alert(error.message || 'Failed to update application.');
    } finally {
      setUpdatingId(null);
    }
  };

  const tableColumns = [
    { key: 'applicationId', label: 'Application ID' },
    { key: 'fullName', label: 'Student Name' },
    { key: 'phone', label: 'Contact' },
    { key: 'course', label: 'Course' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentStatus', label: 'Payment Status', render: (value) => <StatusBadge status={value || 'Pending'} /> },
    { key: 'admissionStatus', label: 'Admission Status', render: (value) => <StatusBadge status={value || 'Pending'} /> },
    { key: 'createdAt', label: 'Application Date' },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setSelectedRow(row)} className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800">View</button>
        <button type="button" disabled={updatingId === row._id} onClick={() => updateApplication(row._id, 'Approved', row.paymentStatus || 'Paid')} className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50">Approve</button>
        <button type="button" disabled={updatingId === row._id} onClick={() => updateApplication(row._id, 'Rejected', 'Failed')} className="rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs text-red-200 hover:bg-red-500/20 disabled:opacity-50">Reject</button>
      </div>
    ) },
  ];

  const tableRows = filteredRows.map((row) => ({
    ...row,
    applicationId: row.applicationId || row._id?.slice(0, 8) || 'N/A',
    amount: `₹${Number(row.amount || 0).toLocaleString('en-IN')}`,
    createdAt: row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Admissions &amp; Payments</h2>
          <p className="mt-1 text-sm text-slate-400">Manage admission applications and payment records.</p>
        </div>
        <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0d1323] px-3 py-2 text-sm font-medium text-white hover:bg-slate-900">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#0d1323] p-4 lg:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-slate-400">
          <Search className="h-4 w-4" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, phone, email or application ID" className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
        </div>
        <select value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-sm text-white">
          {courses.map((course) => <option key={course} value={course}>{course}</option>)}
        </select>
        <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-sm text-white">
          <option value="All">All Payments</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
        </select>
        <select value={admissionFilter} onChange={(event) => setAdmissionFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-sm text-white">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="button" onClick={() => setQuery(query)} className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white">Search</button>
      </div>

      {selectedRow ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <FileText className="h-4 w-4 text-indigo-300" />
              <span className="font-semibold">Application details</span>
            </div>
            <button type="button" onClick={() => setSelectedRow(null)} className="text-sm text-slate-300">Close</button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div><p className="text-xs uppercase tracking-wide text-slate-400">Student</p><p className="text-white">{selectedRow.fullName}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-slate-400">Contact</p><p className="text-white">{selectedRow.phone} / {selectedRow.email}</p></div>
            <div><p className="text-xs uppercase tracking-wide text-slate-400">Course</p><p className="text-white">{selectedRow.course}</p></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={updatingId === selectedRow._id} onClick={() => updateApplication(selectedRow._id, 'Approved', selectedRow.paymentStatus || 'Paid')} className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50">Approve application</button>
            <button type="button" disabled={updatingId === selectedRow._id} onClick={() => updateApplication(selectedRow._id, 'Rejected', 'Failed')} className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20 disabled:opacity-50">Reject application</button>
          </div>
        </div>
      ) : null}

      <DataTable columns={tableColumns} rows={tableRows} />
    </div>
  );
}
