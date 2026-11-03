export default function StatCard({ label, value, change, tone = 'blue', icon: Icon, rightLabel }) {
  const toneClasses = {
    blue: 'from-blue-500/15 to-indigo-500/10 text-blue-200',
    green: 'from-green-500/15 to-emerald-500/10 text-green-200',
    amber: 'from-amber-500/15 to-yellow-500/10 text-amber-200',
    red: 'from-red-500/15 to-rose-500/10 text-red-200',
    purple: 'from-violet-500/15 to-fuchsia-500/10 text-violet-200',
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1323] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-400">{label}</div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</div>
        </div>
        {Icon ? (
          <div className={`rounded-xl bg-gradient-to-br p-2 ${toneClasses[tone] || toneClasses.blue}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-400">{rightLabel || 'Live'}</span>
        {change ? <span className="font-medium text-emerald-400">{change}</span> : null}
      </div>
    </div>
  );
}
