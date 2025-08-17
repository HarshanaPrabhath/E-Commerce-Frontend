import "./App.css";
import Products from "./components/products/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
// import Navbar from "./components/shared/navbar";
import About from "./components/About";
import Contact from "./components/Contact";
import React from "react";
import { Toaster } from "react-hot-toast";
import Cart from "./components/cart/cart";
import Navbar1 from "./components/shared/Navbar1";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/auth/Register";
import Footer from "./components/shared/Footer";
import AddProduct from "./components/products/AddProduct";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Navbar1 />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-product" element={<AddProduct/>} />
          <Route path="/" element={<PrivateRoute publicPage />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
      <Toaster position="bottom-center" />
    </React.Fragment>
  );
}

export default App;
