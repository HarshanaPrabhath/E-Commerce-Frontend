import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  Info,
  Phone,
  ShoppingBag,
  User,
  LayoutDashboard,
} from "lucide-react";
import { Badge } from "@mui/material";
import { FaShoppingCart, FaStore } from "react-icons/fa";
import { hasRole } from "../utils/authRoles";
import { useAppData } from "../../app/context/AppDataContext";

function Navbar1() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { cart, user, signOut } = useAppData();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLogin = () => navigate("/login");
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const loggedUser = user?.user || user;

  const isAdminUser = hasRole(loggedUser, "ROLE_ADMIN");

  const baseNavLinks = [
    { name: "Home", link: "/", icon: <Home size={20} /> },
    { name: "Products", link: "/products", icon: <ShoppingBag size={20} /> },
    { name: "About", link: "/about", icon: <Info size={20} /> },
    { name: "Contact", link: "/contact", icon: <Phone size={20} /> },
  ];
  const navLinks = isAdminUser
    ? [...baseNavLinks, { name: "Dashboard", link: "/dashboard", icon: <LayoutDashboard size={20} /> }]
    : baseNavLinks;

  return (
    <>
      {/* HEADER: Modern Blur (Glassmorphism) Effect */}
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          scrolled 
            ? "h-[70px] bg-teal-900/40 backdrop-blur-xl border-b border-white/10 shadow-2xl p-13" 
            : "h-[85px] bg-teal-800/80 backdrop-blur-md p-13"
        } text-white`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <FaStore className="text-white text-xl" />
            </div>
            <span className="text-2xl font-black tracking-tighter hidden sm:block">
              E<span className="text-orange-400">SHOP</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 items-center">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-orange-400 ${
                      path === item.link ? "text-orange-400" : "text-white/90"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6 ml-4 border-l border-white/20 pl-8">
              <Link to="/cart" className="transition-transform hover:scale-110 active:scale-90">
                <Badge
                  badgeContent={cart?.length || 0}
                  sx={{ "& .MuiBadge-badge": { backgroundColor: "#f59e0b", color: "white" } }}
                >
                  <FaShoppingCart className="text-white text-2xl" />
                </Badge>
              </Link>

              {loggedUser && (loggedUser.userId || loggedUser.id) ? (
                <>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl font-bold text-sm transition-all"
                  >
                    <User size={16} />
                    <span>{loggedUser?.username || "Profile"}</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500/90 hover:bg-red-600 px-4 py-2 rounded-xl font-bold text-sm transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Hamburger (Menu Trigger) */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden p-2 rounded-lg bg-white/10 active:scale-90 transition-all"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* BACKDROP: Darkens screen when sidebar is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] md:hidden transition-opacity"
          onClick={toggleMenu}
        />
      )}

      {/* SIDEBAR: Opens from the RIGHT side */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-[300px] bg-teal-950/90 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[150] transition-transform duration-500 ease-out border-l border-white/10 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            <span className="font-black text-2xl text-orange-400">MENU</span>
            <button onClick={toggleMenu} className="text-white/50 hover:text-white p-2 bg-white/5 rounded-full">
              <X size={24} />
            </button>
          </div>

          <ul className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <li key={item.name}>
                <Link
                  onClick={toggleMenu}
                  to={item.link}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                    path === item.link 
                      ? "bg-orange-500 text-white shadow-xl" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-4">
            <Link 
              to="/cart" 
              onClick={toggleMenu} 
              className="flex items-center justify-between px-6 py-5 rounded-2xl bg-white/5 text-white font-bold border border-white/10"
            >
              <div className="flex items-center gap-4">
                <FaShoppingCart size={22} className="text-orange-400" />
                Cart
              </div>
              <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-black">
                {cart?.length || 0}
              </span>
            </Link>

            {loggedUser && (loggedUser.userId || loggedUser.id) ? (
              <>
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="w-full flex items-center gap-3 px-6 py-5 rounded-2xl bg-white/5 text-white font-bold border border-white/10"
                >
                  <User size={20} className="text-orange-400" />
                  <span className="truncate">{loggedUser?.username || "Profile"}</span>
                </Link>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleSignOut();
                  }}
                  className="w-full py-5 bg-red-500 hover:bg-red-600 rounded-2xl font-black text-white shadow-2xl active:scale-95 transition-all"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <button
                onClick={() => { toggleMenu(); handleLogin(); }}
                className="w-full py-5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl font-black text-white shadow-2xl active:scale-95 transition-all"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Keep your Dialog components below exactly as they were */}
    </>
  );
}

export default Navbar1;
