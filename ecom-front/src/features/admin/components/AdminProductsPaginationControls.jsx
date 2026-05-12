function AdminProductsPaginationControls({
  pageSize,
  setPageSize,
  page,
  totalPages,
  onPrev,
  onNext,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-600">Rows per page</span>
        <select
          value={pageSize}
          onChange={(event) => setPageSize(Number(event.target.value))}
          className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm"
        >
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className="h-10 px-4 rounded-lg bg-slate-100 text-slate-700 font-bold disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm font-semibold text-slate-700">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="h-10 px-4 rounded-lg bg-slate-100 text-slate-700 font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminProductsPaginationControls;
