import { Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const BENEFITS = [
  { id: 1, title: "Fast Delivery", desc: "Island-wide shipping in 1-3 days.", icon: Truck },
  { id: 2, title: "Secure Payment", desc: "Protected checkout on every order.", icon: ShieldCheck },
  { id: 3, title: "Easy Returns", desc: "Simple returns with quick processing.", icon: RotateCcw },
  { id: 4, title: "24/7 Support", desc: "Support team is always available.", icon: Headset },
];

function HomeBenefitsSection() {
  return (
    <section className="bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {BENEFITS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-teal-600 flex items-center justify-center shadow-inner">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HomeBenefitsSection;
