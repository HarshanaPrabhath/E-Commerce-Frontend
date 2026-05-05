import { FaMapMarkedAlt, FaPhone, FaRegEnvelope, FaTwitter, FaLinkedinIn, FaGithub, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 md:p-10 relative overflow-hidden">
      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 items-stretch relative z-10">

        {/* LEFT SIDE: The Main Form Card */}
        <div className="flex-[1.5] bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-14 border border-white/20 relative overflow-hidden">
        
          <div className="mb-12">
            <span className="text-orange-500 font-bold uppercase tracking-[0.2em] text-xs">Let's Talk</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mt-2">Get in touch<span className="text-teal-500">.</span></h1>
            <p className="text-slate-500 mt-4 text-lg max-w-md">Have a project in mind? Fill out the form and our team will get back to you shortly.</p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <input type="text" required id="name" placeholder=" " className="peer w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:border-teal-500 outline-none transition-all" />
                <label htmlFor="name" className="absolute left-0 top-3 text-slate-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-teal-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">Full Name</label>
              </div>
              <div className="relative group">
                <input type="email" required id="email" placeholder=" " className="peer w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:border-teal-500 outline-none transition-all" />
                <label htmlFor="email" className="absolute left-0 top-3 text-slate-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-teal-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">Email Address</label>
              </div>
            </div>

            <div className="relative group">
              <textarea rows="4" required id="message" placeholder=" " className="peer w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:border-teal-500 outline-none transition-all resize-none" />
              <label htmlFor="message" className="absolute left-0 top-3 text-slate-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:font-bold peer-focus:text-teal-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">Your Message</label>
            </div>

            <button className="group relative w-full md:w-max px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl overflow-hidden transition-all hover:pr-14 active:scale-95 shadow-xl">
              <span className="relative z-10">Send Message</span>
              <div className="absolute inset-0 bg-orange-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
              <FaPaperPlane className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all z-20" />
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: Information Cards */}
        <div className="w-full lg:w-[380px] flex flex-col gap-5">

          {/* Info Card Component */}
          {[
            { icon: <FaPhone />, label: "Call us", val: "+94 763384586", color: "text-teal-600", bg: "bg-teal-50" },
            { icon: <FaRegEnvelope />, label: "Email us", val: "harshana@gmail.com", color: "text-orange-600", bg: "bg-orange-50" },
            { icon: <FaMapMarkedAlt />, label: "Visit us", val: "Galgamuwa, Sri Lanka", color: "text-teal-600", bg: "bg-teal-50" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-7 rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-6 hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <div className={`w-16 h-16 ${item.bg} rounded-3xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{item.label}</p>
                <p className="text-slate-900 font-bold text-sm mt-0.5">{item.val}</p>
              </div>
            </div>
          ))}

          {/* Premium Social Card */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-10 rounded-[2.5rem] shadow-2xl shadow-teal-200 text-white mt-auto relative overflow-hidden group">
            {/* Decorative pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            
            <h3 className="font-extrabold text-2xl mb-2 relative z-10">Connect</h3>
            <p className="text-teal-100/80 text-sm mb-8 relative z-10 leading-relaxed">Follow our journey on social media for daily updates.</p>
            
            <div className="flex gap-4 relative z-10">
              {[FaTwitter, FaLinkedinIn, FaGithub].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-orange-500 rounded-2xl flex items-center justify-center transition-all duration-300 hover:rotate-6">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;