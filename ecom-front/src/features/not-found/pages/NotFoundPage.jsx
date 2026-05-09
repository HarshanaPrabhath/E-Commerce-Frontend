import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Page not found</h1>
        <p className="text-slate-600 mb-4">The page you requested does not exist.</p>
        <Link
          to="/"
          className="inline-block bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
