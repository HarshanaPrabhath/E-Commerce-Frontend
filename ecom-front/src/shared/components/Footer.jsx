import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaStore } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-teal-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Top Section: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Branding */}
          <div className="flex flex-col items-start space-y-5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-orange-500 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <FaStore className="text-white text-xl" />
              </div>
              <span className="text-2xl font-black tracking-tighter font-[poppins]">
                E<span className="text-orange-400">SHOP</span>
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed max-w-xs">
              Your one-stop premium shop for high-quality electronics and accessories. Elevate your lifestyle today.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {[<FaFacebookF />, <FaTwitter />, <FaInstagram />, <FaLinkedinIn />].map((icon, index) => (
                <a key={index} href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-orange-500 hover:scale-110 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-orange-400 font-black tracking-widest uppercase text-sm">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-white/70 font-semibold">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/cart" className="hover:text-white transition-colors">Your Cart</Link>
              <Link to="/login" className="hover:text-white transition-colors">My Account</Link>
            </div>
          </div>

          {/* Column 3: Newsletter/Contact */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-orange-400 font-black tracking-widest uppercase text-sm">Join Our Newsletter</h4>
            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10 focus-within:border-orange-500/50 transition-all">
              <input 
                type="email" 
                placeholder="Enter email..." 
                className="bg-transparent border-none outline-none px-4 py-2 w-full text-sm"
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-white/40">No spam, just exclusive deals and updates.</p>
          </div>
        </div>

        {/* Bottom Section: Divider & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-sm">
          <p>© {new Date().getFullYear()} E-SHOP Premium. All rights reserved.</p>
          <div className="flex gap-6 uppercase tracking-tighter font-bold text-[10px]">
            <a href="#" className="hover:text-orange-400">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400">Terms of Service</a>
            <a href="#" className="hover:text-orange-400">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
