import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Newsletter */}
      <div className="bg-primary-dark py-14">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3">Join Our Wellness Journey</h3>
            <p className="text-white/70 mb-6 text-sm max-w-md mx-auto">
              Subscribe for exclusive offers, Ayurvedic wellness tips, and new product updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-secondary transition-colors text-sm"
              />
              <button className="btn-secondary text-sm whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14 section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="Divyam Ayurveda" className="h-10 w-auto" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Divyam Ayurveda</span>
                {/* <span className="text-[9px] uppercase tracking-wider text-secondary font-semibold">Pvt Ltd</span> */}
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              Authentic Ayurvedic wellness products crafted with pure, natural ingredients. Embrace the ancient wisdom of Ayurveda.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/divyamayurveda_official/" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {['Shop All', 'Hair Care', 'Skin Care', 'Wellness', 'Essential Oils', 'About Us'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Shop All' ? '/shop' : item === 'About Us' ? '/about' : `/shop?category=${item.toLowerCase().replace(' ', '-')}`} className="text-white/70 hover:text-secondary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-sm mb-5 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5">
              {['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'FAQ', 'Privacy Policy', 'Terms & Conditions'].map((item) => (
                <li key={item}>
                  <Link
                    to={
                      item === 'Contact Us'
                        ? '/contact'
                        : item === 'Shipping Info'
                        ? '/shipping'
                        : item === 'Returns & Exchanges'
                        ? '/returns'
                        : item === 'FAQ'
                        ? '/faq'
                        : item === 'Privacy Policy'
                        ? '/privacy-policy'
                        : item === 'Terms & Conditions'
                        ? '/terms'
                        : '#'
                    }
                    className="text-white/70 hover:text-secondary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm mb-5 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">A-142 Transport Nagar, Noida<br/>Uttar Pradesh, India 201301</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="tel:+919217872866" className="text-white/70 text-sm hover:text-secondary transition-colors">+91 92178 72866</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href="mailto:care@divyamayurveda.com" className="text-white/70 text-sm hover:text-secondary transition-colors">care@divyamayurveda.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 section-padding">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Divyam Ayurveda. All rights reserved.
          </p>
          <div className="flex items-center gap-4"> 
            <span className="text-white/50 text-xs">Secure Payments</span>
            <div className="flex items-center gap-2">
              {[
                { name: 'Visa', src: '/images/products/Visa.png' },
                { name: 'MasterCard', src: '/images/products/Card.png' },
                { name: 'UPI', src: '/images/products/UPI.png' },
              ].map((card) => (
                <img
                  key={card.name}
                  src={card.src}
                  alt={card.name}
                  className="h-5 w-auto object-contain rounded-xl bg-white/5 p-1"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
