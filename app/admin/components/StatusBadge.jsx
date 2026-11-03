export default function StatusBadge({ status = 'Pending' }) {
  const normalized = status.toString().toLowerCase();

  const config = {
    approved: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40',
    paid: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40',
    successful: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40',
    active: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40',
    pending: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40',
    under_review: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40',
    'under review': 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40',
    rejected: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40',
    failed: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40',
    inactive: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/40',
    draft: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40',
    default: 'bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/40',
  };

  const classes = config[normalized] || config.default;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${classes}`}>
      {status}
    </span>
  );
}
