import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import SideBar from "../../features/admin/components/SideBar";

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useAppData();
  const navigate = useNavigate();

  const logOutHandler = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <SideBar onLogout={logOutHandler} />

        <div className="flex-1 min-w-0 relative">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-[120] p-2 rounded-md bg-slate-900 text-white shadow-lg"
            aria-label="Open admin menu"
          >
            <Menu size={20} />
          </button>

          <main className="min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[200]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <SideBar mobile onClose={() => setMenuOpen(false)} onLogout={logOutHandler} />
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
