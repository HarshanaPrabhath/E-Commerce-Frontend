import ProductCard from "../../../shared/components/ProductCard";
import { FaRocket, FaShieldAlt, FaHeadset, FaArrowRight, FaUsers, FaGlobe, FaAward, FaQuoteLeft } from "react-icons/fa";

const About = () => {
    // New Dummy Data Sections
    const stats = [
        { label: "Happy Customers", value: "50k+", icon: <FaUsers />, color: "text-orange-500" },
        { label: "Countries Reached", value: "120+", icon: <FaGlobe />, color: "text-teal-600" },
        { label: "Design Awards", value: "15", icon: <FaAward />, color: "text-orange-500" },
        { label: "Support Tickets", value: "24/7", icon: <FaHeadset />, color: "text-teal-600" },
    ];

    const milestones = [
        { year: "2022", title: "The Spark", desc: "A garage, three friends, and a dream to simplify tech." },
        { year: "2024", title: "Global Expansion", desc: "Opened our first international distribution hub." },
        { year: "2026", title: "Eco-Tech Initiative", desc: "Committed to 100% sustainable packaging across all lines." },
    ];

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">
            {/* Hero Section */}
            <div className="relative bg-teal-950 py-24 text-white overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px]" />

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-orange-400 text-sm font-bold mb-6 border border-white/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        ESTABLISHED 2026
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-6">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Story</span>
                    </h1>
                    <p className="text-teal-50/70 max-w-2xl mx-auto text-xl leading-relaxed">
                        We don't just sell gadgets; we curate the future. Our mission is to bridge the gap between premium innovation and everyday accessibility.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
                {/* Main Info Card */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-teal-900/10 p-8 md:p-16 border border-white flex flex-col lg:flex-row gap-16 items-center">
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]">
                                Redefining the <br />
                                <span className="text-teal-600">Digital Realm.</span>
                            </h2>
                            <div className="w-20 h-2 bg-orange-500 rounded-full" />
                        </div>

                        <p className="text-slate-600 leading-relaxed text-lg">
                            What started as a small team of tech enthusiasts has grown into a global destination for cutting-edge electronics. We believe technology should be human-centric—designed to empower, not complicate.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50 hover:border-teal-200 transition-colors">
                                <div className="bg-teal-600 p-3 rounded-xl text-white shadow-lg shadow-teal-200">
                                    <FaRocket />
                                </div>
                                <span className="font-bold text-slate-800">Fast Delivery</span>
                            </div>
                            <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50 hover:border-orange-200 transition-colors">
                                <div className="bg-orange-500 p-3 rounded-xl text-white shadow-lg shadow-orange-200">
                                    <FaShieldAlt />
                                </div>
                                <span className="font-bold text-slate-800">Secure Assets</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500 to-orange-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <img
                                className="relative w-full h-[500px] object-cover rounded-[2.5rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.01]"
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800"
                                alt="Our Team"
                            />
                        </div>
                    </div>
                </div>

                {/* --- NEW STATS SECTION --- */}
                <div className="py-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-slate-200">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center space-y-2">
                            <div className={`text-3xl flex justify-center ${stat.color}`}>{stat.icon}</div>
                            <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                            <div className="text-slate-500 font-medium uppercase tracking-widest text-xs">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Why Us Section */}
                <div className="py-24 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { icon: <FaRocket />, title: "Innovation", text: "Curating the latest tech from global pioneers.", color: "teal" },
                        { icon: <FaShieldAlt />, title: "Trust", text: "Official warranty and 100% authentic products.", color: "orange" },
                        { icon: <FaHeadset />, title: "Support", text: "Real humans. 24/7 assistance. No bots.", color: "teal" }
                    ].map((item, idx) => (
                        <div key={idx} className="group bg-white p-8 rounded-3xl border border-slate-100 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 text-center">
                            <div className={`w-16 h-16 ${item.color === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'} rounded-2xl flex items-center justify-center mx-auto text-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="font-black text-slate-900 text-xl mb-3">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                        </div>
                    ))}
                </div>

                {/* --- NEW QUOTE SECTION --- */}
                <div className="bg-teal-900 rounded-[3rem] p-12 relative overflow-hidden mb-24">
                    <FaQuoteLeft className="absolute top-8 left-8 text-white/10 text-8xl" />
                    <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                        <p className="text-2xl md:text-3xl text-teal-50 italic font-medium leading-relaxed">
                            "We didn't set out to build another store. We set out to build a gateway to the future where premium quality isn't a luxury, but a standard."
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 bg-orange-400 rounded-full border-2 border-white shadow-lg"></div>
                            <div className="text-left">
                                <p className="text-white font-bold">Alex Chen</p>
                                <p className="text-teal-300 text-sm uppercase tracking-widest">Founder & CEO</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- NEW MILESTONES SECTION --- */}
                <div className="pb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Our Journey</h2>
                        <p className="text-slate-500">How we reached where we are today.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {milestones.map((ms, i) => (
                            <div key={i} className="relative pl-10 border-l-2 border-teal-100 group">
                                <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-orange-500 border-4 border-white shadow-md group-hover:scale-125 transition-transform" />
                                <span className="text-orange-600 font-black text-xl">{ms.year}</span>
                                <h4 className="text-xl font-bold text-slate-900 mt-2">{ms.title}</h4>
                                <p className="text-slate-500 mt-2">{ms.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;