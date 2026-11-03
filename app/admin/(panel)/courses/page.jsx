"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, Video } from 'lucide-react';

const courseIcons = {
  'Basic of Computer': '💻',
  'Basic of Microsoft Word': '📝',
  'Basic of Microsoft Excel': '📊',
  'Basic of Microsoft PowerPoint': '📽️',
  'Basic of C Programming': '💻',
  'Basic of Python': '🐍',
  'Basic of SQL': '🗃️',
  'Basic of Power BI': '📈',
};

const emptyCourse = {
  title: '',
  short: '',
  description: '',
  fee: 0,
  duration: '1 Month',
  status: 'active',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState(emptyCourse);
  const [creating, setCreating] = useState(false);

  async function loadCourses() {
    const response = await fetch('/api/admin/courses', { credentials: 'include' });
    if (!response.ok) return;
    const data = await response.json();
    setCourses(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSave = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: selectedCourse._id,
          fee: Number(selectedCourse.price ?? selectedCourse.fee ?? 0),
          title: selectedCourse.title,
          short: selectedCourse.short,
          description: selectedCourse.description || selectedCourse.short,
          duration: selectedCourse.duration,
          status: selectedCourse.status,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setMessage(data.error || 'Failed to update course');
        return;
      }

      setMessage('Course updated successfully');
      setCourses((current) => current.map((course) => course._id === selectedCourse._id ? { ...course, ...selectedCourse, price: Number(selectedCourse.price ?? selectedCourse.fee ?? 0), fee: Number(selectedCourse.price ?? selectedCourse.fee ?? 0) } : course));
    } catch (error) {
      setMessage('Unable to save changes right now');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) {
      setMessage('Course title is required');
      return;
    }
    setCreating(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCourse.title,
          short: newCourse.short,
          description: newCourse.description || newCourse.short,
          fee: Number(newCourse.fee || 0),
          duration: newCourse.duration,
          status: newCourse.status,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setMessage(data.error || 'Failed to create course');
        return;
      }
      setShowCreateForm(false);
      setNewCourse(emptyCourse);
      await loadCourses();
      setMessage('Course created successfully');
    } catch (error) {
      setMessage('Unable to create course');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold text-white">Course Management</h2>
          <p className="mt-1 text-sm text-slate-400">Manage your courses, pricing and content.</p>
        </div>
        <button type="button" onClick={() => setShowCreateForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" />
          Add New Course
        </button>
      </div>

      {showCreateForm ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1323] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Create New Course</h3>
            <button type="button" onClick={() => setShowCreateForm(false)} className="text-sm text-slate-300 hover:text-white">Close</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm text-slate-300">Course Title
                <input value={newCourse.title} onChange={(event) => setNewCourse({ ...newCourse, title: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">Short Description
                <textarea value={newCourse.short} onChange={(event) => setNewCourse({ ...newCourse, short: event.target.value })} className="mt-1 min-h-[90px] w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
              </label>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <label className="block text-sm text-slate-300">Price
                  <input type="number" min="0" value={newCourse.fee} onChange={(event) => setNewCourse({ ...newCourse, fee: Number(event.target.value) })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
                </label>
                <label className="block text-sm text-slate-300">Duration
                  <input value={newCourse.duration} onChange={(event) => setNewCourse({ ...newCourse, duration: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
                </label>
                <label className="block text-sm text-slate-300">Status
                  <select value={newCourse.status} onChange={(event) => setNewCourse({ ...newCourse, status: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateForm(false)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">Cancel</button>
                <button type="button" onClick={handleCreateCourse} disabled={creating} className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{creating ? 'Creating...' : 'Create Course'}</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedCourse ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1323] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Edit Course - {selectedCourse.title}</h3>
            <button type="button" onClick={() => setSelectedCourse(null)} className="text-sm text-slate-300 hover:text-white">Close</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm text-slate-300">Course Title
                <input value={selectedCourse.title || ''} onChange={(event) => setSelectedCourse({ ...selectedCourse, title: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
              </label>
              <label className="block text-sm text-slate-300">Short Description
                <textarea value={selectedCourse.short || ''} onChange={(event) => setSelectedCourse({ ...selectedCourse, short: event.target.value })} className="mt-1 min-h-[90px] w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
              </label>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <label className="block text-sm text-slate-300">Price
                  <input type="number" min="0" value={selectedCourse.price ?? selectedCourse.fee ?? 0} onChange={(event) => setSelectedCourse({ ...selectedCourse, price: Number(event.target.value) })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
                </label>
                <label className="block text-sm text-slate-300">Duration
                  <input value={selectedCourse.duration || ''} onChange={(event) => setSelectedCourse({ ...selectedCourse, duration: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white" />
                </label>
                <label className="block text-sm text-slate-300">Status
                  <select value={selectedCourse.status || 'active'} onChange={(event) => setSelectedCourse({ ...selectedCourse, status: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-700 bg-[#09101d] px-3 py-2 text-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSelectedCourse(null)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">Cancel</button>
                <button type="button" onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              {message ? <p className="text-sm text-indigo-300">{message}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => (
          <div key={course._id || course.slug} className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl">
                  {courseIcons[course.title] || '📚'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                </div>
              </div>
            </div>

            <p className="min-h-[68px] text-sm text-slate-400">{course.short}</p>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>{course.modules?.length || 0} modules</span>
              <span>{course.students || 0} students</span>
            </div>

            <div className="mt-4 flex items-center justify-between pb-2">
              <div className="text-2xl font-bold text-white">₹{Number(course.price ?? course.fee ?? 0).toLocaleString('en-IN')}</div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-300">{course.status || 'active'}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setSelectedCourse(course)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/20">
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <Link href={`/admin/courses/${course.slug || course._id}/videos`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
                <Video className="h-4 w-4" />
                Manage Videos
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
