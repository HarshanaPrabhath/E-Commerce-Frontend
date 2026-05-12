import { useMemo, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { getContactMessages } from "../../../shared/utils/contactMessages";

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function AdminMessagesPage() {
  const [messages, setMessages] = useState(() => getContactMessages());

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const handleDelete = (id) => {
    const next = messages.filter((item) => item.id !== id);
    setMessages(next);
    window.localStorage.setItem("contactMessages", JSON.stringify(next));
  };

  const handleClearAll = () => {
    setMessages([]);
    window.localStorage.setItem("contactMessages", JSON.stringify([]));
  };

  return (
    <section className="min-h-screen bg-[#fcfcfc] px-4 sm:px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Contact Messages</h1>
              <p className="text-slate-500 font-semibold text-sm">
                Messages sent from contact form
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={!hasMessages}
            onClick={handleClearAll}
            className="h-10 px-4 rounded-xl bg-rose-100 text-rose-700 font-bold disabled:opacity-40"
          >
            Clear All
          </button>
        </header>

        {!hasMessages ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center text-slate-600 font-semibold">
            No messages yet.
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-black text-slate-600">Name</th>
                    <th className="text-left px-4 py-3 font-black text-slate-600">Email</th>
                    <th className="text-left px-4 py-3 font-black text-slate-600">Message</th>
                    <th className="text-left px-4 py-3 font-black text-slate-600">Date</th>
                    <th className="text-left px-4 py-3 font-black text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600">{item.email}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[480px]">
                        <p className="line-clamp-3">{item.message}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="h-9 px-3 rounded-lg bg-rose-100 text-rose-700 font-bold inline-flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminMessagesPage;

