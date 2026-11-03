import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Page not found</h1>
        <p className="mt-3 text-base text-slate-300">
          The page you requested could not be found or may have moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Return home
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Browse courses
          </Link>
        </div>
      </div>
    </main>
  );
}
