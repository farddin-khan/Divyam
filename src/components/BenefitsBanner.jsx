import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export default function BenefitsBanner() {
  const benefits = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders above ₹499',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '7-day return policy',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      description: '100% secure checkout',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: '+91 92178 72866',
    },
  ];

  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="section-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-text text-xs">{benefit.title}</h4>
                <p className="text-text-muted text-[10px]">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
