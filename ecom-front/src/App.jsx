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
      </Routes>
    </Router>
    <Toaster position="bottom-center"/>
    </React.Fragment>
  );
}

export default App;
