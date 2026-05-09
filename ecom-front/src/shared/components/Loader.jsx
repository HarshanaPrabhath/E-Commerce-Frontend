import { PropagateLoader } from "react-spinners";

const Loader = ({ text }) => {
  return (
    /* h-screen ensures it takes the full height of the device to center perfectly */
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-white/30 backdrop-blur-md z-[999]">
      
      <div className="relative flex flex-col items-center gap-10">
        
        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-400/20 blur-[60px] rounded-full" />

        {/* The Loader - Using Teal to match your Navbar */}
        <div className="relative z-10">
          <PropagateLoader 
            color="#0f766e" 
            size={15} 
            speedMultiplier={0.8}
          />
        </div>

        {/* Text Section */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <h2 className="text-2xl font-black text-teal-900 tracking-tighter font-[poppins] uppercase">
            {text ? text : "Loading"}
            <span className="text-orange-500 animate-bounce inline-block ml-1">.</span>
            <span className="text-orange-500 animate-bounce inline-block [animation-delay:0.2s]">.</span>
            <span className="text-orange-500 animate-bounce inline-block [animation-delay:0.4s]">.</span>
          </h2>
          
          <div className="h-1 w-12 bg-gradient-to-r from-teal-600 to-orange-500 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Loader;