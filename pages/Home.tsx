
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Zap, Star, ChevronRight, ArrowRight, Play } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { resolveImageUrl } from '../types';

const Hero: React.FC = () => {
  const { settings } = useCMS();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FF8C00]/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-[#FF8C00]/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FF8C00 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center space-x-3 glass px-5 py-2 rounded-full mb-8 border border-[#FF8C00]/30 shadow-xl shadow-orange-500/10">
            <span className="w-2.5 h-2.5 orange-gradient rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF8C00]">Print That Speaks</span>
          </div>
          <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-[100px] leading-[0.85] mb-8 uppercase tracking-tighter text-white">
            {settings.heroHeadline}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed font-medium">
            {settings.heroSubheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/shop" className="orange-gradient text-black px-10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs w-full sm:w-auto hover:scale-105 transition-all duration-300 flex items-center justify-center group shadow-2xl shadow-orange-500/30">
              Explore Drops <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/quote" className="glass text-white border border-white/10 px-10 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs w-full sm:w-auto hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
              Bulk Quote
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative z-10 animate-float">
             <div className="relative group">
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200" alt="TeetotPrint Showcase" className="rounded-[40px] shadow-2xl shadow-black/80 border border-white/5 grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000" />
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-black/40 to-transparent opacity-60"></div>
                {settings.showTestimonials && (
                  <div className="absolute -bottom-12 -left-12 glass p-8 rounded-3xl border border-[#FF8C00]/30 max-w-[240px] shadow-2xl shadow-black/50 backdrop-blur-2xl">
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-[#FF8C00] text-[#FF8C00]" />)}
                      </div>
                      <p className="text-white text-sm font-black uppercase tracking-tighter leading-tight italic">"The quality actually speaks for itself. Unmatched."</p>
                      <div className="flex items-center mt-4 gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10"></div>
                          <p className="text-[#FF8C00] text-[10px] font-black uppercase tracking-widest">A. Mensah • Accra</p>
                      </div>
                  </div>
                )}
             </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#FF8C00]/10 blur-[150px] -z-10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

const Features: React.FC = () => (
  <section className="py-32 bg-zinc-950 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: <ShieldCheck className="text-[#FF8C00]" size={40} />, title: 'Elite Materials', desc: 'Sourced premium blanks from across the globe to ensure the perfect canvas for your design.' },
          { icon: <Truck className="text-[#FF8C00]" size={40} />, title: 'Rapid Transit', desc: 'Proprietary logistics network ensuring your custom gear arrives while the vision is still fresh.' },
          { icon: <Zap className="text-[#FF8C00]" size={40} />, title: 'Infinite Scale', desc: 'From the first prototype to a 10,000 unit run, our quality remains surgical and consistent.' }
        ].map((f, i) => (
          <div key={i} className="glass p-12 rounded-[32px] border border-white/5 hover:border-[#FF8C00]/40 transition-all duration-500 group relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF8C00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
            <div className="mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">{f.icon}</div>
            <h3 className="font-heading font-black text-2xl uppercase tracking-tighter text-white mb-5">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Process: React.FC = () => (
  <section className="py-32 bg-black overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-24">
        <h2 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter mb-6">The Workflow</h2>
        <div className="w-32 h-1.5 orange-gradient mx-auto rounded-full mb-8"></div>
        <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-[0.3em] text-[10px] font-black">Surgical Precision from Screen to Stitch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        <div className="hidden md:block absolute top-[40px] left-0 w-full h-px bg-white/5 -z-10"></div>
        {[
          { step: '01', title: 'Curate', desc: 'Select from our catalog of heavyweight apparel and premium accessories.' },
          { step: '02', title: 'Deploy', desc: 'Upload your vector assets or work with our in-house design unit.' },
          { step: '03', title: 'Manifest', desc: 'Industrial grade production and QC before rapid dispatch.' }
        ].map((s, i) => (
          <div key={i} className="text-center group">
            <div className="w-20 h-20 orange-gradient rounded-3xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-10 shadow-2xl shadow-orange-500/20 relative z-10 group-hover:rotate-[15deg] transition-transform duration-500">
              {s.step}
            </div>
            <h4 className="font-heading font-bold text-2xl uppercase tracking-tighter text-white mb-5">{s.title}</h4>
            <p className="text-gray-500 text-sm font-medium leading-relaxed px-6">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQ: React.FC = () => (
  <section className="py-32 bg-zinc-950">
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="font-heading font-black text-4xl uppercase tracking-tighter mb-16 text-center">Intel Hub</h2>
      <div className="space-y-6">
        {[
          { q: 'Accepted Asset Specs?', a: 'We strictly require high-resolution (300DPI+) vector formats (AI, SVG, EPS) or transparent PNGs. Our pre-press team optimizes every file for maximum impact.' },
          { q: 'Volume Thresholds?', a: 'Zero minimums for core drops. Tiered corporate pricing kicks in at 50 units. We handle scale others can\'t reach.' },
          { q: 'Dispatch Timeline?', a: 'Standard production cycles are 48-72 hours. Express units ship within 24 hours of asset approval.' }
        ].map((item, i) => (
          <details key={i} className="glass rounded-2xl overflow-hidden group border border-white/5">
            <summary className="p-8 cursor-pointer font-black text-white flex justify-between items-center list-none uppercase tracking-[0.2em] text-[10px] hover:text-[#FF8C00] transition-colors">
              {item.q}
              <ChevronRight className="group-open:rotate-90 transition-transform text-[#FF8C00]" size={20} />
            </summary>
            <div className="p-8 pt-0 text-gray-500 text-sm leading-relaxed border-t border-white/5 font-medium">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export const Home: React.FC = () => {
  const { products, settings } = useCMS();
  return (
    <div className="bg-black text-white">
      <Hero />
      {settings.showFeatures && <Features />}
      
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter">Bestsellers</h2>
              <p className="text-[#FF8C00] mt-4 uppercase tracking-[0.4em] text-[10px] font-black italic">The Gold Standard in Print</p>
            </div>
            <Link to="/shop" className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] flex items-center hover:text-white transition-all mt-8 md:mt-0 group">
              View Entire Catalog <ArrowRight size={16} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="group relative block">
                <div className="relative overflow-hidden rounded-[32px] glass border border-white/5 mb-6 aspect-[4/5] shadow-2xl shadow-black">
                  <img 
                    src={resolveImageUrl(product.image)} 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                      <h3 className="font-black text-2xl uppercase tracking-tighter text-white mb-2 leading-none">{product.name}</h3>
                      <p className="text-[#FF8C00] font-black tracking-[0.2em] text-sm mb-6 uppercase">GHS {product.price.toFixed(2)}</p>
                      <button className="w-full orange-gradient text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transform transition-all duration-300 hover:scale-105">
                        Acquire Unit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-2 group-hover:opacity-0 transition-opacity duration-500">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">{product.name}</h3>
                  <p className="text-[#FF8C00] font-black text-xs tracking-widest">GHS {product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Process />
      {settings.showFAQ && <FAQ />}
      
      <section className="py-40 relative overflow-hidden text-center bg-[#050505]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8C00]/5 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-heading font-black text-6xl md:text-9xl uppercase tracking-tighter mb-10 leading-[0.8]">Your Vision.<br /><span className="text-[#FF8C00]">Manifested.</span></h2>
          <p className="text-gray-500 text-lg md:text-xl mb-14 font-medium max-w-2xl mx-auto leading-relaxed">Join thousands of brands and creators who trust TeetotPrint to deliver quality that actually speaks.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-8">
            <Link to="/quote" className="orange-gradient text-black px-12 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:scale-105 transition-all shadow-2xl shadow-orange-500/20">Initiate Project</Link>
            <Link to="/shop" className="glass text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs border border-white/10 hover:bg-white/10 transition-all">Explore Collection</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
