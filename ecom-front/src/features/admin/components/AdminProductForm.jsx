function AdminProductForm({
  editingId,
  form,
  categories,
  saving,
  uploadingImage,
  uploadError,
  onChange,
  onImageFileSelect,
  onSubmit,
  onReset,
}) {
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    onImageFileSelect(file);
  };

  const handleFilePick = (event) => {
    const file = event.target.files?.[0];
    onImageFileSelect(file);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-slate-900">
          {editingId ? "Update Product" : "Add Product"}
        </h2>
        {editingId ? (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 text-slate-700"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm font-semibold text-slate-700 space-y-2">
          <span className="block">Product Name</span>
          <input
            name="productName"
            value={form.productName}
            onChange={onChange}
            placeholder="Product name"
            className="h-11 w-full px-4 rounded-xl border border-slate-200"
            required
          />
        </label>
        <label className="text-sm font-semibold text-slate-700 space-y-2">
          <span className="block">Category</span>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            className="h-11 w-full px-4 rounded-xl border border-slate-200 bg-white"
            required
            disabled={Boolean(editingId)}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700 space-y-2">
          <span className="block">Quantity</span>
          <input
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={onChange}
            placeholder="Quantity"
            className="h-11 w-full px-4 rounded-xl border border-slate-200"
            required
          />
        </label>
        <label className="text-sm font-semibold text-slate-700 space-y-2">
          <span className="block">Price</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={onChange}
            placeholder="Price"
            className="h-11 w-full px-4 rounded-xl border border-slate-200"
            required
          />
        </label>
        <label className="text-sm font-semibold text-slate-700 space-y-2">
          <span className="block">Discount</span>
          <input
            name="discount"
            type="number"
            min="0"
            step="0.01"
            value={form.discount}
            onChange={onChange}
            placeholder="Discount"
            className="h-11 w-full px-4 rounded-xl border border-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-700 space-y-2">
          <span className="block">Image URL</span>
          <input
            name="image"
            value={form.image}
            onChange={onChange}
            placeholder="Image URL"
            className="h-11 w-full px-4 rounded-xl border border-slate-200"
            required
          />
        </label>
      </div>

      <label className="text-sm font-semibold text-slate-700 space-y-2 block">
        <span className="block">Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Description"
          className="w-full min-h-24 p-4 rounded-xl border border-slate-200"
          required
        />
      </label>

      <label
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="block border border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50"
      >
        <p className="text-sm font-semibold text-slate-700">
          Drag & drop image here or choose file
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFilePick}
          className="mt-3 block w-full text-sm text-slate-600"
        />
        <p className="text-xs text-slate-500 mt-2">
          {uploadingImage ? "Uploading image..." : "Cloudinary upload enabled"}
        </p>
      </label>

      {uploadError ? <p className="text-sm text-rose-600">{uploadError}</p> : null}
      {form.image ? (
        <img
          src={form.image}
          alt="Uploaded product"
          className="w-28 h-28 object-cover rounded-xl border border-slate-200"
        />
      ) : null}

      <button
        type="submit"
        disabled={saving || uploadingImage}
        className="h-11 px-6 rounded-xl bg-teal-600 text-white font-bold disabled:opacity-60"
      >
        {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}

export default AdminProductForm;
