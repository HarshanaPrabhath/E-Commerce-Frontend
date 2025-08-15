import { FaShoppingCart, FaSignInAlt, FaStore } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Products from "./../products/Products";
import { Badge } from "@mui/material";
import { useState } from "react";
import { IoReorderThree } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";

const Navbar = () => {
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);
  const {cart} = useSelector((state) => state.carts)

  return (
    <div className="h-[70px] bg-pink-600 text-white z-50 flex items-center sticky top-0 ">
      <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between">
        <Link to="/" className="mr-5 flex items-center text-2xl font-bold text-nowrap ">
          <FaStore className="mr-2 text-3xl" />
          <span className="font-[poppins]">E-Shop</span>
        </Link>

        <ul
          className={`mb-4 p-5 text-[1.1rem] bg-pink-600 sm:gap-10 sm:items-center text-white sm:static absolute left-0 top-[70px] sm:shadow-none shadow-md  ${
            navbarOpen ? "h-fit sm:pb-0 pb-5 " : "h-0 overflow-hidden"
          } transition-all duration-300 sm:h-fit sm:w-fit w-full sm:flex flex-col sm:flex-row pt-4 sm:px-0`}
        >
          <li className="font-[500] hover:scale-105 transition-all duration-150">
            <Link
              to="/"
              className={`${path === "/" ? "text-gray-200" : "text-white"}`}
            >
              Home
            </Link>
          </li>
          <li className=" font-[500] hover:scale-110 transition-all duration-150">
            <Link
              to="/products"
              className={`${
                path === "/products" ? "text-gray-200" : "text-white"
              }`}
            >
              Products
            </Link>
          </li>
          <li className="font-[500] hover:scale-110 transition-all duration-150">
            <Link
              to="/about"
              className={`${
                path === "/about" ? "text-gray-200" : "text-white"
              }`}
            >
              About
            </Link>
          </li>
          <li className="font-[500] hover:scale-110 transition-all duration-150">
            <Link
              to="/contact"
              className={`${
                path === "/contact" ? "text-gray-200" : "text-white"
              }`}
            >
              Contact
            </Link>
          </li>

          <li className="font-[500] hover:scale-110 transition-all duration-150">
            <Link
              to="/cart"
              className={`${
                path === "/cart" ? "text-gray-200" : "text-white"
              }`}
            >
              <Badge
                showZero
                badgeContent={cart?.length || 0}
                color="primary"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <FaShoppingCart size={25} />
              </Badge>
            </Link>
          </li>
          <li className="font-[500] transition-all duration-150">
            <Link
              to="/login"
              className="flex items-center gap-2 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-md px-4 py-2 text-center"
            >
              <FaSignInAlt />
              Login
            </Link>
          </li>
        </ul>

        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="sm:hidden flex items-center mt-2"
        >
          {navbarOpen ? (
            <RxCross2 size={50} className="text-white text-3xl" />
          ) : (
            <IoReorderThree size={50} className="text-white text-3xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
