import EmptyState from "@/components/admin/EmptyState";

export default function DataTable({
  columns,
  rows,
  rowKey = "id",
  emptyTitle = "No data found",
  emptyDescription = "Try adjusting your filters or add fresh content.",
}) {
  if (!rows?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-[0_28px_56px_-30px_rgba(31,78,121,0.45)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#edf2f7] text-left">
          <thead className="bg-[#f6fbff]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#68829b]"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2f7]">
            {rows.map((row) => (
              <tr key={row[rowKey] || row.id} className="align-top transition hover:bg-[#fcfdff]">
                {columns.map((column) => (
                  <td key={column.key} className={`px-5 py-4 text-sm text-[#32465a] ${column.className || ""}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
