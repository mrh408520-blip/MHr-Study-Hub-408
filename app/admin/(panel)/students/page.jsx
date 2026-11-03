"use client";

import { useEffect, useState } from 'react';
import { Download, Plus, Search } from 'lucide-react';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';

const blankStudent = {
  name: '',
  phone: '',
  email: '',
  course: '',
  status: 'Active',
};

export default function StudentsPage() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankStudent);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const response = await fetch('/api/admin/students', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredRows = rows.filter((row) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [row.name, row.email, row.phone, row.studentId, row.course].some((value) => String(value || '').toLowerCase().includes(q));
  });

  const exportCsv = () => {
    const csvRows = [
      ['Student ID', 'Student Name', 'Contact Number', 'Email', 'Enrolled Course', 'Enrollment Date', 'Status'],
      ...filteredRows.map((row) => [row.studentId || '', row.name || '', row.phone || '', row.email || '', row.course || '', row.enrollmentDate ? new Date(row.enrollmentDate).toISOString() : '', row.status || ''])
    ];
    const content = csvRows.map((entry) => entry.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateStudent = async () => {
    if (!form.name || !form.phone || !form.email || !form.course) {
      alert('Name, phone, email and course are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.error || 'Failed to add student');
      setForm(blankStudent);
      setShowForm(false);
      await load();
    } catch (error) {
      alert(error.message || 'Unable to add student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (student, nextStatus) => {
    try {
      const response = await fetch('/api/admin/students', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: student._id, name: student.name, phone: student.phone, email: student.email, course: student.course, status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error('Update failed');
      await load();
    } catch (error) {
      alert('Unable to update student status.');
    }
  };

  const columns = [
    { key: 'studentId', label: 'Student ID' },
    { key: 'name', label: 'Student Name' },
    { key: 'phone', label: 'Contact Number' },
    { key: 'email', label: 'Email' },
    { key: 'course', label: 'Enrolled Course' },
    { key: 'enrollmentDate', label: 'Enrollment Date' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value || 'Active'} /> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button type="button" onClick={() => handleStatusUpdate(row, row.status === 'Active' ? 'Inactive' : 'Active')} className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800">{row.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
      </div>
    ) },
  ];

  const tableRows = filteredRows.map((row) => ({
    ...row,
    enrollmentDate: row.enrollmentDate ? new Date(row.enrollmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Students Management</h2>
          <p className="mt-1 text-sm text-slate-400">View and manage all enrolled students.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0d1323] px-3 py-2 text-sm font-medium text-white hover:bg-slate-900">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-3 py-2 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#0d1323] p-4 md:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-slate-400">
          <Search className="h-4 w-4" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email or phone" className="w-full border-0 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
        </div>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Add Student</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-300">Close</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Student name" className="rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone number" className="rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" className="rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white md:col-span-2" />
            <input value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })} placeholder="Course name" className="rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white md:col-span-2" />
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white md:col-span-2">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">Cancel</button>
            <button type="button" disabled={submitting} onClick={handleCreateStudent} className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Saving...' : 'Save Student'}</button>
          </div>
        </div>
      ) : null}

      <DataTable columns={columns} rows={tableRows} />
    </div>
  );
}
