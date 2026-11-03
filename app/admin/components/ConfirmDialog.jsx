"use client";

import { useEffect, useState } from 'react';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', onCancel, onConfirm }) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0d1323] p-5 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-3 py-2 text-sm font-semibold text-white hover:brightness-110">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
