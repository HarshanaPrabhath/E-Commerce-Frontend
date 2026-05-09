import { Layers, Tags, FolderKanban } from "lucide-react";

const sections = [
  { id: "SEC-01", name: "Electronics", products: 124, status: "Active" },
  { id: "SEC-02", name: "Fashion", products: 89, status: "Active" },
  { id: "SEC-03", name: "Home & Kitchen", products: 57, status: "Active" },
  { id: "SEC-04", name: "Sports", products: 31, status: "Draft" },
];

function SectionsPage() {
  return (
    <section className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Layers className="text-indigo-700" size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sections</h1>
            <p className="text-slate-600 text-sm">Manage product sections with dummy data.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <article className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-slate-500 text-sm">Total Sections</p>
            <p className="text-2xl font-semibold text-slate-900 mt-2">{sections.length}</p>
          </article>
          <article className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-slate-500 text-sm">Active Sections</p>
            <p className="text-2xl font-semibold text-slate-900 mt-2">
              {sections.filter((item) => item.status === "Active").length}
            </p>
          </article>
          <article className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-slate-500 text-sm">Total Products</p>
            <p className="text-2xl font-semibold text-slate-900 mt-2">
              {sections.reduce((sum, item) => sum + item.products, 0)}
            </p>
          </article>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-100 px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
            <div className="col-span-3">Section ID</div>
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Products</div>
            <div className="col-span-2">Status</div>
          </div>

          {sections.map((section) => (
            <div
              key={section.id}
              className="grid grid-cols-12 px-5 py-4 text-sm border-t border-slate-200 items-center"
            >
              <div className="col-span-3 text-slate-700">{section.id}</div>
              <div className="col-span-4 flex items-center gap-2 text-slate-800 font-medium">
                <FolderKanban size={16} className="text-slate-400" />
                {section.name}
              </div>
              <div className="col-span-3 flex items-center gap-2 text-slate-700">
                <Tags size={14} className="text-slate-400" />
                {section.products}
              </div>
              <div className="col-span-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    section.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {section.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SectionsPage;
