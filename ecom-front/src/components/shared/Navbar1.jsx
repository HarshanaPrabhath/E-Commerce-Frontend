import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  Home,
  HelpCircle,
  User,
  BarChart3,
  PlusCircle,
  PieChart,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Badge } from "@mui/material";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import UserMenu from "../UserMenu";

function Navbar1() {

      const path = useLocation().pathname;
  
  const {cart} = useSelector((state) => state.carts)
  const {user} = useSelector((state)=>state.auth);
  
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const user = sessionStorage.getItem("currentUser");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/signout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Clear tokens and user info from storage
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("currentUser");

        // Update app state
        setIsLoggedIn(false);
        setLogoutSuccess(true);
        setError(null);

        // Navigate to login page
        navigate("/");
      } else {
        const errorData = await response.json();
        setError("Logout failed: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Logout Error:", error);
      setError("An error occurred during logout.");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };


  return (
    <>
      {/* Navbar */}
{/* Dark Teal Single Color */}
<nav className="sticky top-0 bg-gradient-to-r from-teal-800 to-teal-700 backdrop-blur-md text-white px-6 py-5 shadow-lg fixed w-full top-0 z-50">

        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
             E-Shop
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 text-lg font-medium items-center">
            <NavLink label="Home" to="/" icon={<Home size={22} />} />
            <NavLink label="Products" to="/products"/>
            <NavLink label="About" to="/about"/>
            <NavLink label="Contact" to="/contact"/>
              <NavLink label={<Badge
                showZero
                badgeContent={cart?.length || 0}
                color="primary"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <FaShoppingCart size={25} />
              </Badge>} to="/cart" onClick={toggleMenu} mobile />
            
            {/* <NavLink label="Profile" to="/user-dashboard" icon={<User size={18} />} /> */}

            {(user && user.userId )? (
              <button
                // onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-lg px-4 py-2 rounded font-medium transition duration-200 shadow-sm hover:shadow-md"
              >
                <UserMenu/>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-lg px-4 py-2 rounded font-medium transition duration-200 shadow-sm hover:shadow-md"
              >
                <LogIn size={20} /> Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-In Menu */}
      <div
       className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-teal-700 to-teal-900 p-6 transform transition-transform duration-300 ease-in-out shadow-2xl z-40 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}


      >
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-white">
          <X size={28} />
        </button>

        <div className="mt-20 text-md flex flex-col gap-5 text-white text-base font-medium">
          <NavLink label="Home" to="/" onClick={toggleMenu} mobile icon={<Home size={18} />} />
          <NavLink label="Products" to="/products" onClick={toggleMenu} mobile  />
          <NavLink label="About" to="/about" onClick={toggleMenu} mobile  />
          <NavLink label="Contact" to="/contact" onClick={toggleMenu} mobile />
                 <NavLink label={<Badge
                showZero
                badgeContent={cart?.length || 0}
                color="primary"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <FaShoppingCart size={25} />
              </Badge>} to="/cart" onClick={toggleMenu} mobile />

          {user && user.userId ? (
            <button
              onClick={() => {
                toggleMenu();
                // handleLogout();
              }}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded font-medium transition shadow"
            >
              <UserMenu/>
            </button>
          ) : (
            <button
              onClick={() => {
                toggleMenu();
                handleLogin();
              }}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded font-medium transition shadow"
            >
              <LogIn size={18} /> Login
            </button>
          )}
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog
        open={!!error}
        onClose={() => setError(null)}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center space-y-5">
          <Dialog.Title className="text-2xl font-bold text-red-600">Error</Dialog.Title>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-6 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold transition"
          >
            Close
          </button>
        </Dialog.Panel>
      </Dialog>

      {/* Logout Success Dialog */}
      <Dialog
        open={logoutSuccess}
        onClose={() => setLogoutSuccess(false)}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-5 text-center">
          <Dialog.Title className="text-2xl font-bold text-emerald-600">Logout Successful</Dialog.Title>
          <p className="text-gray-700">You have successfully logged out.</p>
          <button
            onClick={() => setLogoutSuccess(false)}
            className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold shadow-lg transition-all"
          >
            Continue
          </button>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

function NavLink({ label, to, onClick, mobile, icon }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${mobile
        ? "flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10"
        : "flex items-center gap-2"
        } text-white hover:text-yellow-300 transition duration-200`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default Navbar1;