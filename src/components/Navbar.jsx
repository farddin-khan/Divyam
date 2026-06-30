import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Phone, ChevronDown, MapPin } from 'lucide-react';
import { useCart } from '../hooks/useCart.jsx';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [pincode, setPincode] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationModal, setLocationModal] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  // const [loadingLocation, setLoadingLocation] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);

  const location = useLocation();
  const { cartCount } = useCart();


  useEffect(() => {
  const checkAdminAccess = () => {
    const adminUserId = localStorage.getItem('divyam_admin_user_id');
    const adminSecret = localStorage.getItem('divyam_admin_secret');

    setShowAdminLink(Boolean(adminUserId && adminSecret));
  };

  checkAdminAccess();

  window.addEventListener('focus', checkAdminAccess);
  window.addEventListener('storage', checkAdminAccess);

  return () => {
    window.removeEventListener('focus', checkAdminAccess);
    window.removeEventListener('storage', checkAdminAccess);
  };
}, [location.pathname]);

  useEffect(() => {
    const savedPin = localStorage.getItem('pincode');
    const savedLocation = localStorage.getItem('location');

    if (savedPin && savedLocation) {
      setPincode(savedPin);
      setLocationName(savedLocation);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setShopDropdown(false);
  }, [location]);

  const fetchLocation = async () => {
    if (pincode.length !== 6) {
      alert('Enter valid pincode');
      return;
    }

    setLoadingLocation(true);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const office = data[0].PostOffice[0];
        const city = office.District;
        const state = office.State;
        const formattedLocation = `${city}, ${state}`;

        setLocationName(formattedLocation);
        localStorage.setItem('pincode', pincode);
        localStorage.setItem('location', formattedLocation);
        setLocationModal(false);
      } else {
        alert('Invalid Pincode');
      }
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setLoadingLocation(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop', hasDropdown: true },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    ...(showAdminLink ? [{ to: '/admin/orders', label: 'Admin' }] : []),
  ];

  const shopCategories = [
    { to: '/shop?category=hair-care', label: 'Hair Care' },
    { to: '/shop?category=skin-care', label: 'Skin Care' },
    { to: '/shop?category=wellness', label: 'Wellness' },
    { to: '/shop?category=body-care', label: 'Body Care' },
    { to: '/shop?category=essential-oils', label: 'Essential Oils' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 text-xs">
        <div className="section-padding flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+919217872866" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
              <Phone className="w-3 h-3" />
              <span>+91 92178 72866</span>
            </a>
            <span className="hidden sm:inline text-white/60">|</span>
            <span className="hidden sm:inline text-white/80">Free shipping on orders above Rs. 499</span>
              <span className="hidden sm:inline font-bold bg-gradient-to-r from-green-400 via-lime-300  to-yellow-300 inline-block bg-clip-text text-transparent">
            ✨  We're building something amazing! Our website will be live soon. Stay tuned.
              </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/track-order"
              className="hover:text-primary transition"
            >
              Track Order
            </Link>
            <span className="text-white/60">|</span>
            <Link to="/contact" className="hover:text-secondary transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Divyam Ayurveda" className="h-10 w-auto" />
              <div className="hidden sm:flex flex-col">
                <span className="text-primary font-bold text-lg leading-tight">Divyam Ayurveda</span>
                {/* <span className="text-secondary text-[9px] uppercase tracking-wider font-semibold">Pvt Ltd</span> */}
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              {navLinks.map((link) => (
                <div key={link.to} className="relative">
                  {link.hasDropdown ? (
                    <button
                      onMouseEnter={() => setShopDropdown(true)}
                      onMouseLeave={() => setShopDropdown(false)}
                      className="flex items-center gap-1 text-sm font-medium text-text hover:text-primary transition-colors py-5"
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      to={link.to}
                      className={`text-sm font-medium transition-colors py-5 ${location.pathname === link.to ? 'text-primary' : 'text-text hover:text-primary'}`}
                    >
                      {link.label}
                    </Link>
                  )}
                  {link.hasDropdown && shopDropdown && (
                    <div
                      onMouseEnter={() => setShopDropdown(true)}
                      onMouseLeave={() => setShopDropdown(false)}
                      className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 min-w-[200px] border border-gray-100"
                    >
                      {shopCategories.map((cat) => (
                        <Link
                          key={cat.to}
                          to={cat.to}
                          className="block px-4 py-2.5 text-sm text-text hover:text-primary hover:bg-warm transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link to="/shop" className="block px-4 py-2.5 text-sm font-medium text-primary hover:bg-warm transition-colors">
                          View All Products
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Location / Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <div
                onClick={() => setLocationModal(true)}
                className="flex items-center gap-2 cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-2 py-1.5 hover:border-primary hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <div className="leading-tight">
                  <p className="text-[10px] text-gray-500">Verify pincode</p>
                  <p className="font-semibold text-xs">{locationName || 'Add location'}</p>
                  <p className="text-[10px] text-gray-400">{pincode ? pincode : 'Enter pincode'}</p>
                </div>
              </div>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-text hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link to="/login" className="text-sm font-medium text-text hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Signup
              </Link>

              <Link to="/cart" className="relative p-2 text-text hover:text-primary transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-text">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-text hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-text">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
            <div className="bg-white rounded-xl shadow-2xl p-4 animate-slide-up">
              <div className="flex items-center gap-3 border-b-2 border-primary/20 pb-3">
                <Search className="w-5 h-5 text-primary" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 text-base outline-none text-text placeholder:text-text-muted"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5 text-text-muted hover:text-text" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {locationModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-3xl w-full max-w-[450px] p-6 shadow-2xl">
            <div className="flex justify-between items-start gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-semibold">Confirm Pincode</h2>
                <p className="text-sm text-gray-500 mt-1">Helps show accurate delivery dates</p>
              </div>
              <button onClick={() => setLocationModal(false)} className="text-gray-500 hover:text-text">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 mb-4">
              <input
                type="number"
                placeholder="Enter area pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full border border-transparent rounded-xl bg-white px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={fetchLocation}
                className="w-full bg-primary text-white rounded-xl mt-4 py-3 font-semibold hover:bg-primary/90 transition-colors"
              >
                {loadingLocation ? 'Checking...' : 'Apply'}
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
              <span className="h-px flex-1 bg-gray-200"></span>
              <span>OR</span>
              <span className="h-px flex-1 bg-gray-200"></span>
            </div>

            <button
              className="mt-4 w-full rounded-xl bg-[#7d9b3c] px-4 py-3 text-white font-semibold hover:bg-[#6f8c33] transition-colors"
              onClick={() => {
                setLocationModal(false);
                // Optional: redirect to login/page for address addition
              }}
            >
              LOG IN TO ADD NEW ADDRESS
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 animate-fade-in lg:hidden">
          <div className="section-padding flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-text text-lg font-medium py-3 border-b border-gray-100 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
              <Link
                to="/login"
                className="rounded-2xl border border-gray-200 px-4 py-3 text-center text-sm font-medium text-text hover:border-primary hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-2xl bg-primary px-4 py-3 text-center text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
              <div className="flex flex-col gap-2">
                <a href="tel:+919217872866" className="flex items-center gap-2 text-primary font-medium py-2">
                  <Phone className="w-5 h-5" />
                  +91 92178 72866
                </a>
                <p className="text-text-muted text-sm mt-2">care@divyamayurveda.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
