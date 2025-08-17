import { Home } from "lucide-react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full h-[300px] bg-gradient-to-r from-teal-800 to-teal-600 flex flex-col items-center justify-center text-white">
      <div className="text-white font-semibold text-3xl mb-3">E-Shop</div>
    <hr className="w-4/4 border-t border-gray-300 opacity-40 mb-4" />
      <div className="flex gap-2 md:gap-10 justify-center items-center md:flex-row sm:flex-col text-lg mb-5">
        <NavLink 
          to="/" 
          className="flex items-center gap-2 hover:text-yellow-300"
        >
          
          Home
        </NavLink>

        <NavLink 
          to="/products" 
          className="hover:text-yellow-300"
        >
          Products
        </NavLink>

        <NavLink 
          to="/about" 
          className="hover:text-yellow-300"
        >
          About
        </NavLink>

        <NavLink 
          to="/contact" 
          className="hover:text-yellow-300"
        >
          Contact
        </NavLink>
      </div>
     <hr className="w-4/4 border-t border-gray-300 opacity-40 mb-4" />
       <p className="text-sm">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
