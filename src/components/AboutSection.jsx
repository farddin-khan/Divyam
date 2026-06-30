import { Link } from 'react-router-dom';
import { Leaf, Heart, ShieldCheck, Award } from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'Pure, organic ingredients sourced directly from Indian farms.',
    },
    {
      icon: Heart,
      title: 'Handcrafted',
      description: 'Traditional Ayurvedic methods passed down through generations.',
    },
    {
      icon: ShieldCheck,
      title: 'Certified Pure',
      description: 'Rigorous quality testing ensures purity and efficacy.',
    },
    {
      icon: Award,
      title: 'Trusted Brand',
      description: 'Over 50,000 happy customers across India and worldwide.',
    },
  ];

  return (
    <section className="py-16 bg-warm">
      <div className="section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Ayurvedic preparation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Story</span>
            <h2 className="heading-md text-text mt-2 mb-4">
              Rooted in Ancient Wisdom
            </h2>
            <p className="text-body mb-4">
              Divyam Ayurvedha Pvt Ltd was born from a deep reverence for India's ancient healing traditions. 
              Our founder, inspired by her grandmother's Ayurvedic remedies, set out to bring authentic, 
              pure formulations to the modern world.
            </p>
            <p className="text-body mb-6">
              Each product is a labor of love, handcrafted in small batches using time-honored methods 
              and the finest organic ingredients.
            </p>
            <Link to="/about" className="btn-primary inline-flex items-center gap-2 text-sm">
              Know More
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-sm text-text mb-1">{feature.title}</h3>
              <p className="text-body text-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
