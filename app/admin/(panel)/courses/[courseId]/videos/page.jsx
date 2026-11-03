"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Upload, Play, Video } from 'lucide-react';
import VideoManager from '../../../../components/VideoManager';

export default function CourseVideoManagementPage() {
  const params = useParams();
  const courseId = params?.courseId;
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  async function loadCourseModules() {
    if (!courseId) return;

    const response = await fetch(`/api/admin/courses/${courseId}/videos`, { credentials: 'include' });
    if (!response.ok) return;
    const data = await response.json();
    const nextModules = Array.isArray(data?.modules) ? data.modules : [];
    setModules(nextModules);
    if (nextModules.length > 0 && !selectedModule) {
      setSelectedModule(nextModules[0].title);
    }
  }

  useEffect(() => {
    async function load() {
      const response = await fetch('/api/admin/courses', { credentials: 'include' });
      if (!response.ok) return;
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    }
    load();
  }, []);

  useEffect(() => {
    const matchedCourse = courses.find((item) => item.slug === courseId || item._id === courseId) || courses[0] || null;
    setCourse(matchedCourse);
  }, [courseId, courses]);

  useEffect(() => {
    if (courseId) {
      loadCourseModules();
    }
  }, [courseId]);

  const activeModule = modules.find((module) => module.title === selectedModule) || modules[0];

  const addModule = () => {
    const nextTitle = `Module ${modules.length + 1}`;
    setModules((current) => [...current, { title: nextTitle, videos: [] }]);
    setSelectedModule(nextTitle);
  };

  const uploadVideo = async (file) => {
    if (!file || !courseId) {
      return;
    }

    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, '') || 'Uploaded lesson');
      formData.append('moduleTitle', selectedModule || activeModule?.title || 'Module 1');

      const response = await fetch(`/api/admin/courses/${courseId}/videos`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to upload the video.');
      }

      await loadCourseModules();
      setSelectedModule(data?.module || selectedModule || activeModule?.title || 'Module 1');
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload the video.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Manage Videos - {course?.title || 'Course'}</h2>
          <p className="mt-1 text-sm text-slate-400">Upload, edit and manage course video lessons.</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadVideo(file);
              event.target.value = '';
            }}
          />
          <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div> : null}

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4">
          <h3 className="mb-3 text-lg font-semibold text-white">Modules</h3>
          <div className="space-y-2">
            {modules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-3 text-sm text-slate-400">No modules yet.</div>
            ) : (
              modules.map((module, index) => (
                <button key={`${module.title}-${index}`} type="button" onClick={() => setSelectedModule(module.title)} className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${selectedModule === module.title ? 'border-indigo-500/60 bg-indigo-500/10 text-white' : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:bg-slate-800'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span>{module.title}</span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] uppercase text-slate-300">{module.videos?.length || 0} videos</span>
                  </div>
                </button>
              ))
            )}
          </div>
          <button type="button" onClick={addModule} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" />
            Add Module
          </button>
        </aside>

        <section className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Module: {activeModule?.title || 'Untitled'}</h3>
            <button type="button" onClick={() => setModules([...modules])} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">Save Module</button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-900/90 text-slate-300">
                <tr>
                  <th className="px-4 py-3">Video Title</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Upload Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(activeModule?.videos || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">No lessons in this module yet.</td>
                  </tr>
                ) : (
                  (activeModule?.videos || []).map((video, index) => (
                    <tr key={`${video.title}-${index}`} className="border-t border-slate-800">
                      <td className="px-4 py-3 font-medium text-white">
                        {video.source ? (
                          <a href={video.source} target="_blank" rel="noreferrer" className="text-indigo-300 hover:text-indigo-200">{video.title}</a>
                        ) : (
                          video.title
                        )}
                      </td>
                      <td className="px-4 py-3">{video.duration}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wide ${video.status === 'Published' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{video.status}</span></td>
                      <td className="px-4 py-3">{video.uploadedAt ? new Date(video.uploadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not uploaded'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {video.source ? (
                            <a href={video.source} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white">
                              <Play className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Play className="h-3.5 w-3.5" /></button>
                          )}
                          <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white"><Video className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <VideoManager course={course} modules={modules} onAddModule={addModule} onUploadVideo={uploadVideo} />
    </div>
  );
}
