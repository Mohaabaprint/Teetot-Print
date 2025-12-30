
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Phone, Mail, MapPin, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { resolveImageUrl } from '../types';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { settings } = useCMS();
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 orange-gradient rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 overflow-hidden">
        {settings.logoUrl ? (
          <img src={resolveImageUrl(settings.logoUrl)} alt={settings.siteName} className="w-full h-full object-cover" />
        ) : (
          <span className="font-black text-black">TP</span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-heading font-black text-lg tracking-tighter text-white uppercase leading-none">
          {settings.siteName}
        </span>
        <span className="text-[8px] font-medium tracking-[0.2em] text-gray-400 uppercase italic">
          Print That Speaks
        </span>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCMS();
  const location = useLocation();

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
    <nav className="fixed w-full z-50 transition-all duration-500 glass py-3 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#FF8C00] ${location.pathname === link.path ? 'text-[#FF8C00]' : 'text-gray-300'}`}>
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative p-2 text-white hover:text-[#FF8C00]">
            <ShoppingBag size={20} strokeWidth={2.5} />
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-[#FF8C00] text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-black">{cartCount}</span>}
          </Link>
          <Link to="/admin" className="p-2 text-white hover:text-[#FF8C00]"><User size={20} strokeWidth={2.5} /></Link>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden glass fixed inset-0 top-[60px] z-50 p-6 flex flex-col space-y-6 animate-in slide-in-from-right">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="text-2xl font-black text-white uppercase tracking-tighter hover:text-[#FF8C00]">{link.name}</Link>
          ))}
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
          <Logo className="mb-6" />
          <p className="text-gray-500 text-xs leading-relaxed mb-6">{settings.footerAboutText}</p>
          <div className="flex space-x-3">
            <a href={settings.instagramUrl} className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-[#FF8C00] hover:text-black transition-all"><Instagram size={14} /></a>
            <a href={settings.facebookUrl} className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-[#FF8C00] hover:text-black transition-all"><Facebook size={14} /></a>
            <a href={settings.tiktokUrl} className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-[#FF8C00] hover:text-black transition-all group"><span className="text-[10px] font-black">Tk</span></a>
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white mb-6 uppercase tracking-[0.2em]">Nav</h4>
          <ul className="space-y-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <li><Link to="/shop" className="hover:text-[#FF8C00]">Shop</Link></li>
            <li><Link to="/designs" className="hover:text-[#FF8C00]">Designs</Link></li>
            <li><Link to="/quote" className="hover:text-[#FF8C00]">Bulk Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white mb-6 uppercase tracking-[0.2em]">Connect</h4>
          <ul className="space-y-4 text-xs text-gray-500">
            <li className="flex items-center space-x-3"><Phone size={14} className="text-[#FF8C00]" /><span>{settings.contactPhone}</span></li>
            <li className="flex items-center space-x-3"><Mail size={14} className="text-[#FF8C00]" /><span className="lowercase">{settings.contactEmail}</span></li>
            <li className="flex items-center space-x-3"><MapPin size={14} className="text-[#FF8C00]" /><span>{settings.location}</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-white mb-6 uppercase tracking-[0.2em]">Priority Drops</h4>
          <div className="flex gap-2">
            <input type="email" placeholder="EMAIL" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] w-full focus:outline-none focus:border-[#FF8C00] text-white" />
            <button className="orange-gradient text-black px-3 rounded-lg font-black"><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-white/5 text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] flex justify-between">
        <span>&copy; {new Date().getFullYear()} {settings.siteName.toUpperCase()} CORE. SYSTEMS LIVE.</span>
        <span>GHANA 🇬🇭</span>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#FF8C00] selection:text-black bg-black">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
