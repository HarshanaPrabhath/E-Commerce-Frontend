function AdminProductTable({ loading, products, onEdit, onDelete }) {
  if (loading) {
    return (
      <section className="bg-white border border-slate-100 rounded-3xl p-10 text-center">
        <p className="font-bold text-slate-600">Loading products...</p>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="bg-white border border-slate-100 rounded-3xl p-10 text-center">
        <p className="font-bold text-slate-600">No products found.</p>
      </section>
    );
  }

  return (
    <section className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 font-black text-slate-600">Image</th>
              <th className="text-left px-4 py-3 font-black text-slate-600">Name</th>
              <th className="text-left px-4 py-3 font-black text-slate-600">Price</th>
              <th className="text-left px-4 py-3 font-black text-slate-600">Qty</th>
              <th className="text-left px-4 py-3 font-black text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                  />
                </td>
                <td className="px-4 py-3 font-semibold text-slate-700">{product.productName}</td>
                <td className="px-4 py-3 text-slate-600">Rs.{Number(product.price || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-600">{Number(product.quantity || 0)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="h-9 px-3 rounded-lg bg-slate-100 text-slate-700 font-bold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="h-9 px-3 rounded-lg bg-rose-100 text-rose-700 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminProductTable;
