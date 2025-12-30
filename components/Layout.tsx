
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Phone, Mail, MapPin, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { resolveImageUrl } from '../types';

const Logo: React.FC<{ className?: string; light?: boolean }> = ({ className = "", light = false }) => {
  const { settings } = useCMS();
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        <div className="w-12 h-12 orange-gradient rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
          {settings.logoUrl ? (
            <img src={resolveImageUrl(settings.logoUrl)} alt={settings.siteName} className="w-full h-full object-cover" />
          ) : (
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-black fill-current">
              <path d="M20 50 Q 40 10 70 30 T 90 50 L 70 60 Q 50 80 20 50 Z" />
              <path d="M70 30 L 75 10 M 60 25 L 60 5 M 50 30 L 45 10" stroke="black" strokeWidth="4" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-heading font-black text-xl tracking-tighter text-white uppercase leading-none">
          {settings.siteName.split('Print')[0]} <span className="text-[#FF8C00]">PRINT</span>
        </span>
        <span className="text-[9px] font-medium tracking-[0.2em] text-gray-400 uppercase mt-1 italic font-serif">
          Print That Speaks
        </span>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, settings } = useCMS();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Designs', path: '/designs' },
    { name: 'Bulk Orders', path: '/quote' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-2 border-b border-white/5' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-[#FF8C00] relative group ${location.pathname === link.path ? 'text-[#FF8C00]' : 'text-gray-300'}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#FF8C00] transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-5">
          <Link to="/cart" className="relative p-2 text-white hover:text-[#FF8C00] transition-colors">
            <ShoppingBag size={22} strokeWidth={2.5} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#FF8C00] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-black animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/admin" className="hidden sm:block p-2 text-white hover:text-[#FF8C00] transition-colors">
            <User size={22} strokeWidth={2.5} />
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden glass fixed inset-0 top-[68px] z-50 p-6 flex flex-col space-y-6 animate-in slide-in-from-right duration-500">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className="text-2xl font-black text-white border-b border-white/5 pb-4 uppercase tracking-tighter hover:text-[#FF8C00] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link 
              to="/admin" 
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold text-gray-500 uppercase tracking-widest pt-4"
            >
              Admin Portal
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const { settings } = useCMS();
  
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <Logo className="mb-8" />
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
            Premium custom apparel and merchandise hub. Leveraging industry-leading print technology to make your vision speak through quality.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-[#FF8C00] hover:text-black transition-all group">
              <Instagram size={18} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-[#FF8C00] hover:text-black transition-all group">
              <Facebook size={18} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://tiktok.com/@teetotprint" target="_blank" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-[#FF8C00] hover:text-black transition-all group">
              <span className="text-xs font-black">Tk</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-xs font-black text-white mb-8 uppercase tracking-[0.3em]">Navigation</h4>
          <ul className="space-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <li><Link to="/shop" className="hover:text-[#FF8C00] transition-colors">The Shop</Link></li>
            <li><Link to="/designs" className="hover:text-[#FF8C00] transition-colors">Design Assets</Link></li>
            <li><Link to="/quote" className="hover:text-[#FF8C00] transition-colors">Bulk Inquiries</Link></li>
            <li><Link to="/about" className="hover:text-[#FF8C00] transition-colors">Expertise</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xs font-black text-white mb-8 uppercase tracking-[0.3em]">Direct Contact</h4>
          <ul className="space-y-5 text-sm text-gray-500">
            <li className="flex items-start space-x-4 group">
              <Phone size={18} className="text-[#FF8C00] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors">{settings.contactPhone}</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <Mail size={18} className="text-[#FF8C00] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors lowercase">{settings.contactEmail}</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <MapPin size={18} className="text-[#FF8C00] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white transition-colors">{settings.location}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-xs font-black text-white mb-8 uppercase tracking-[0.3em]">Priority Access</h4>
          <p className="text-gray-500 text-xs mb-6 leading-relaxed">Join our inner circle for exclusive drops, bulk discount codes, and print maintenance tips.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="EMAIL ADDRESS" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[10px] font-black w-full focus:outline-none focus:border-[#FF8C00] text-white tracking-widest" />
            <button className="orange-gradient text-black px-4 rounded-lg font-black transition-transform active:scale-95"><ArrowRight size={20} /></button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">
        <span>&copy; {new Date().getFullYear()} {settings.siteName.toUpperCase()} CORE. SYSTEMS ONLINE.</span>
        <div className="mt-4 md:mt-0 flex space-x-8">
           <Link to="/legal" className="hover:text-[#FF8C00] transition-colors">Terms</Link>
           <Link to="/legal" className="hover:text-[#FF8C00] transition-colors">Privacy</Link>
           <span className="text-zinc-400">MADE IN GHANA 🇬🇭</span>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#FF8C00] selection:text-black">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
