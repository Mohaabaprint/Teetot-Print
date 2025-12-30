
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Zap, Star, ChevronRight, ArrowRight, Play } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
// Fix: Import resolveImageUrl from types to resolve the "Cannot find name 'resolveImageUrl'" error
import { resolveImageUrl } from '../types';

const Hero: React.FC = () => {
  const { settings } = useCMS();
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <div className="inline-flex items-center space-x-2 glass px-5 py-2 rounded-full mb-10 border border-[#FF8C00]/40 shadow-lg shadow-orange-500/10">
            <div className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Systems Online & Active</span>
          </div>
          <h1 className="font-heading font-black text-6xl md:text-8xl leading-[0.8] mb-10 uppercase tracking-tighter text-white">
            {settings.heroHeadline}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-14 leading-relaxed font-medium max-w-xl">
            {settings.heroSubheadline}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
            <Link to="/shop" className="orange-gradient text-black px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center shadow-2xl shadow-orange-500/30 hover:scale-105 transition-transform">Explore Drops <ArrowRight size={18} className="ml-3"/></Link>
            <Link to="/quote" className="glass text-white border border-white/10 px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center hover:bg-white/5 transition-all">Bulk Quote</Link>
          </div>
        </div>
        <div className="hidden lg:block relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF8C00] to-transparent opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
          <img 
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200" 
            className="rounded-[64px] border border-white/10 shadow-2xl grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 animate-float" 
            alt="Printing Workshop"
          />
        </div>
      </div>
    </section>
  );
};

export const Home: React.FC = () => {
  const { products, settings } = useCMS();
  return (
    <div className="bg-black text-white">
      <Hero />
      
      {settings.showFeatures && (
        <section className="py-32 bg-[#020202] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
            {settings.features.map((f, i) => (
              <div key={i} className="glass p-12 rounded-[48px] border border-white/5 hover:border-[#FF8C00]/40 transition-all group shadow-xl">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-[#FF8C00] mb-8 group-hover:orange-gradient group-hover:text-black transition-all">
                  <Star size={24} />
                </div>
                <h3 className="font-heading font-black text-2xl uppercase tracking-tighter text-white mb-4 leading-none">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-40 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
            <div>
              <span className="text-[#FF8C00] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Core Inventory</span>
              <h2 className="font-heading font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none">The Bestsellers</h2>
            </div>
            <Link to="/shop" className="text-zinc-500 font-black uppercase text-[11px] tracking-[0.3em] flex items-center hover:text-white transition-colors p-4 glass rounded-2xl border border-white/5">Catalog Node <ChevronRight size={16} className="ml-3"/></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.slice(0, 4).map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="group block">
                <div className="relative overflow-hidden rounded-[40px] glass border border-white/5 mb-8 aspect-[4/5] shadow-2xl">
                  <img src={resolveImageUrl(product.image)} className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                     <button className="w-full orange-gradient text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Deploy Custom</button>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase mb-2 tracking-tight leading-none group-hover:text-[#FF8C00] transition-colors">{product.name}</h3>
                  <p className="text-[#FF8C00] font-black text-lg tracking-widest leading-none">GHS {product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {settings.showFeatures && (
        <section className="py-40 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-24">
               <span className="text-[#FF8C00] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Workflow Hub</span>
               <h2 className="font-heading font-black text-5xl uppercase tracking-tighter text-white leading-none">Production Loop</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {settings.process.map((s, i) => (
                <div key={i} className="text-center group relative">
                  {i < settings.process.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px border-t-2 border-dashed border-white/5 -z-10 translate-x-12"></div>
                  )}
                  <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-10 border border-white/10 group-hover:border-[#FF8C00] group-hover:shadow-[0_0_40px_rgba(255,140,0,0.2)] transition-all duration-500">
                    <span className="group-hover:text-[#FF8C00] transition-colors">{s.step}</span>
                  </div>
                  <h4 className="font-heading font-black text-2xl uppercase tracking-tighter text-white mb-4 leading-none">{s.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-[250px] mx-auto">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {settings.showFAQ && (
        <section className="py-40 bg-black">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-20">
              <span className="text-[#FF8C00] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Intel Archive</span>
              <h2 className="font-heading font-black text-5xl uppercase tracking-tighter mb-12 leading-none">FAQ HUB</h2>
            </div>
            <div className="space-y-6">
              {settings.faqs.map((f, i) => (
                <details key={i} className="glass rounded-3xl border border-white/5 overflow-hidden group transition-all duration-500 hover:border-white/10">
                  <summary className="p-8 cursor-pointer text-xs font-black uppercase tracking-widest text-white hover:text-[#FF8C00] list-none flex justify-between items-center select-none">
                    {f.q} 
                    <div className="p-2 glass rounded-lg group-open:rotate-180 transition-transform">
                       <ChevronRight size={16} />
                    </div>
                  </summary>
                  <div className="p-8 pt-0 text-gray-500 text-sm leading-relaxed border-t border-white/5 font-medium animate-in slide-in-from-top-4 duration-300">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
