import { Leaf, Heart, ShieldCheck, Users } from 'lucide-react';
import SEO from '../components/SEO.jsx';
// import AboutImage from '../assets/About.png';

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: 'Pure & Natural',
      description: 'We source only the finest organic ingredients, ensuring every product is free from harmful chemicals.',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Each product is handcrafted in small batches with intention and care.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Assured',
      description: 'Rigorous testing at every stage ensures excellence in purity and efficacy.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We work directly with farming communities in India, ensuring fair wages.',
    },
  ];

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Divyam Ayurvedha Pvt Ltd's journey to bring authentic, pure Ayurvedic wellness products to the world."
      />

      <div className="bg-primary pt-28 pb-14">
        <div className="section-padding text-center">
          <h1 className="heading-lg text-white mb-3">Our Story</h1>
          <p className="text-white/70 max-w-3xl mx-auto text-sm">
            Empowering healthier lives through authentic Ayurvedic wellness, inspired by nature and trusted for quality.
          </p>
          {/* <p className="text-white/70 max-w-3xl mx-auto text-sm mt-4">
            At Divyam Ayurveda, quality, purity, and customer satisfaction are at the heart of everything we do. We work with trusted manufacturing partners and follow stringent quality standards to ensure that every product delivers excellence and authenticity.
          </p>
          <p className="text-white/70 max-w-3xl mx-auto text-sm mt-4">
            Our vision is to bridge the gap between traditional Ayurvedic wisdom and the modern consumer by providing high-quality herbal products through a seamless online shopping experience. From wellness supplements to herbal essentials, we strive to inspire healthier lifestyles and help people embrace the power of nature.
          </p> */}
          {/* <p className="text-white/70 max-w-3xl mx-auto text-sm mt-4 font-semibold">
            Divyam Ayurveda – Ancient Wisdom, Modern Wellness, Delivered to Your Doorstep.
          </p> */}
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Ayurvedic herbs"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">The Beginning</span>
              <h2 className="heading-md text-text mt-2 mb-4">From Grandmother's Kitchen to the World</h2>
              <p className="text-body text-sm mb-4">
                What started as generations of family wisdom has grown into a mission to make authentic Ayurveda accessible worldwide. Every product reflects the care, knowledge, and natural ingredients that were once the foundation of our grandmother's kitchen. By combining traditional practices with modern quality standards, we deliver trusted Ayurvedic wellness solutions to every home.
              </p>
              <p className="text-body text-sm mb-4">
                What started as sharing these precious formulations with friends and family soon blossomed into something greater. 
                Today, we bring the same authentic, time-tested recipes to discerning customers worldwide.
              </p>
              <p className="text-body text-sm">
                Every product tells a story of heritage, sustainability, and the healing power of nature.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Different page */}
      <div className="py-16 bg-white">
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Discover the Power of Pure Ayurvedic Living</span>
              <h2 className="heading-md text-text mt-2 mb-4">Pure Ayurveda. Trusted Quality. Worldwide Deliver</h2>
              <p className="text-body text-sm mb-4">
                Divyam Ayurveda is a premium e-commerce wellness brand committed to making authentic Ayurvedic products accessible across the globe. Rooted in the ancient science of Ayurveda and driven by modern innovation, 
                we offer carefully curated natural wellness solutions that promote holistic health and everyday well-being.
              </p>
              <p className="text-body text-sm mb-4">
                At Divyam Ayurveda, quality, purity, and customer satisfaction are at the heart of everything we do. We work with trusted manufacturing partners and follow stringent quality standards to ensure that every product delivers excellence and authenticity.
              </p>
              <p className="text-body text-sm">
                Our vision is to bridge the gap between traditional Ayurvedic wisdom and the modern consumer by providing high-quality herbal products through a seamless online shopping experience. From wellness supplements to herbal essentials, we strive to inspire healthier lifestyles and help people embrace the power of nature.
              </p>
              <p className="text-body text-sm">
                Divyam Ayurveda – Ancient Wisdom, Modern Wellness, Delivered to Your Doorstep.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Ayurvedic herbs"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

{/* Another Div */}
      <div className="py-16 bg-warm">
        <div className="section-padding">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">What We Stand For</span>
            <h2 className="heading-md text-text mt-2">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="text-center bg-white p-6 rounded-xl border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-sm text-text mb-2">{value.title}</h3>
                <p className="text-body text-xs">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 bg-primary text-white">
        <div className="section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '100%', label: 'Natural Ingredients' },
              { number: '25+', label: 'Products' },
              { number: '15', label: 'Countries Served' },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="text-3xl sm:text-4xl font-bold text-secondary">{stat.number}</span>
                <p className="text-white/70 mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
