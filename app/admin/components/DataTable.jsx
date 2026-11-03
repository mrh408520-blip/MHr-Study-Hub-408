export default function DataTable({ columns = [], rows = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1323]">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-left text-sm text-slate-200">
          <thead className="bg-slate-900/90 text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium tracking-wide text-slate-300">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-slate-800 hover:bg-slate-900/60">
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.key}`} className="px-4 py-3 align-middle">
                      {typeof column.render === 'function' ? column.render(row[column.key], row) : row[column.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
