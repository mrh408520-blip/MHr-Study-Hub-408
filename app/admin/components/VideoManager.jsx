"use client";

import { useRef } from 'react';
import { Plus, Upload, PlayCircle } from 'lucide-react';

export default function VideoManager({ course, modules = [], onAddModule, onUploadVideo }) {
  const fileInputRef = useRef(null);

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Modules</h3>
          <p className="text-sm text-slate-400">{course?.title || 'Course'} videos</p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-3 py-2 text-sm font-semibold text-white"
        >
          <span className="inline-flex items-center gap-2"><Upload className="h-4 w-4" />Upload Video</span>
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => onUploadVideo?.(event.target.files?.[0])} />
      </div>

      <div className="mb-4 flex justify-end">
        <button type="button" onClick={onAddModule} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
          <Plus className="h-4 w-4" />Add Module
        </button>
      </div>

      <div className="space-y-3">
        {modules.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-400">
            No video lessons available for this course.
          </div>
        ) : (
          modules.map((module, index) => (
            <div key={`${module.title}-${index}`} className="rounded-xl border border-slate-800 bg-[#0b1220] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-white">{module.title}</div>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                  {module.videos?.length || 0} videos
                </span>
              </div>

              <div className="mt-2 space-y-2">
                {(module.videos || []).map((video, videoIndex) => (
                  <div key={`${module.title}-${videoIndex}`} className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0d1323] p-2 text-sm text-slate-300 gap-3">
                    <span className="flex items-center gap-2"><PlayCircle className="h-3.5 w-3.5 text-indigo-300" />{video.title}</span>
                    <span>{video.duration || '00:00'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
