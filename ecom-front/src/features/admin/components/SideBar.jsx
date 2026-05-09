import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Tags,
  Store,
  LogOut,
  X,
} from "lucide-react";

const adminLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/manage-products", icon: Boxes },
  { name: "Categories", path: "/manage-categories", icon: Tags },
];

function SideBar({ mobile = false, onClose, onLogout }) {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? "bg-teal-600 text-white" : "text-slate-200 hover:bg-slate-800"
    }`;

  return (
    <aside
      className={
        mobile
          ? "absolute left-0 top-0 h-full w-72 bg-slate-900 text-white p-5 flex flex-col"
          : "hidden lg:flex w-72 shrink-0 flex-col bg-slate-900 text-white p-5"
      }
    >
      <div className={mobile ? "flex items-center justify-between mb-8" : "mb-8"}>
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">Admin</p>
          <h1 className="text-2xl font-bold mt-1">E-Shop Panel</h1>
        </div>
        {mobile ? (
          <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-800" aria-label="Close admin menu">
            <X size={18} />
          </button>
        ) : null}
      </div>

      <nav className="flex flex-col gap-2">
        {adminLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} className={linkStyle} onClick={mobile ? onClose : undefined}>
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <Link
          to="/products"
          onClick={mobile ? onClose : undefined}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          <Store size={18} />
          Back to Store
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-rose-200 hover:bg-rose-900/40"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
