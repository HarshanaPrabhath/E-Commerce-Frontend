import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Tags,
  Store,
  LogOut,
  X,
  Zap,
  ChevronRight
} from "lucide-react";

const adminLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/manage-products", icon: Boxes },
  { name: "Categories", path: "/manage-categories", icon: Tags },
];

function SideBar({ mobile = false, onClose, onLogout }) {
  // Nexus Navigation Styling
  const linkStyle = ({ isActive }) =>
      `group flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
          isActive
              ? "bg-teal-600 text-white shadow-lg shadow-teal-900/40 italic"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`;

  return (
      <aside
          className={
            mobile
                ? "fixed inset-y-0 left-0 z-[100] w-72 bg-slate-950 text-white p-6 flex flex-col border-r border-white/5"
                : "hidden lg:flex w-72 shrink-0 flex-col bg-slate-950 text-white p-8 border-r border-white/5"
          }
      >
        {/* --- LOGO / BRANDING --- */}
        <div className={mobile ? "flex items-center justify-between mb-12" : "mb-12"}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Zap size={20} fill="white" className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">
                Admin Dashboard
              </h1>
            </div>
          </div>

          {mobile && (
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
          )}
        </div>

        {/* --- MAIN NAV --- */}
        <nav className="flex flex-col gap-3">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            return (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={linkStyle}
                    onClick={mobile ? onClose : undefined}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={18} className="group-hover:rotate-12 transition-transform" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
            );
          })}
        </nav>

        {/* --- BOTTOM ACTIONS --- */}
        <div className="mt-auto pt-8 space-y-4 border-t border-white/5">
          <Link
              to="/products"
              onClick={mobile ? onClose : undefined}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-teal-500/10 hover:text-teal-400 transition-all group"
          >
            <Store size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Store
          </Link>

          <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-400/70 hover:bg-rose-500 hover:text-white transition-all shadow-rose-900/20"
          >
            <LogOut size={18} />
            Terminate Session
          </button>
        </div>
      </aside>
  );
}

export default SideBar;