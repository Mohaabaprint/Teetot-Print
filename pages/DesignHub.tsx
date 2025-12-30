
import React, { useState } from 'react';
import { Search, Download, ShoppingCart, Image as ImageIcon, Zap, Filter } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { resolveImageUrl, DesignCategory } from '../types';

export const DesignHub: React.FC = () => {
  const { designAssets } = useCMS();
  const [activeCategory, setActiveCategory] = useState<DesignCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = designAssets.filter(d => {
    const matchesCat = activeCategory === 'All' || d.category === activeCategory;
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories: (DesignCategory | 'All')[] = ['All', 'T-Shirt', 'Caps', 'Tote Bags', 'Pillow Cases'];

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 glass px-4 py-1.5 rounded-full mb-6 border border-[#FF8C00]/30">
            <Zap size={14} className="text-[#FF8C00]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Digital HQ Assets</span>
          </div>
          <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-white mb-6 leading-none">
            High-Resolution <span className="text-[#FF8C00]">Graphics</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
            Professional vectors and transparent PNGs curated for POD mastery. Ready for direct application on apparel, headwear, and home decor.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? 'orange-gradient text-black border-[#FF8C00]' : 'glass text-gray-500 border-white/5 hover:border-white/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#FF8C00] font-medium"
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {filtered.map(asset => (
              <div key={asset.id} className="group glass rounded-[40px] overflow-hidden border border-white/5 hover:border-[#FF8C00]/30 transition-all duration-500 shadow-xl hover:shadow-orange-500/5">
                <div className="aspect-square relative overflow-hidden bg-zinc-950/50 flex items-center justify-center p-8">
                  <img 
                    src={resolveImageUrl(asset.thumbnail)} 
                    alt={asset.title} 
                    className="w-full h-full object-contain filter group-hover:brightness-110 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute top-6 right-6 glass px-3 py-1 rounded-full text-[8px] font-black text-[#FF8C00] uppercase tracking-widest border border-[#FF8C00]/20">
                    {asset.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-white font-black uppercase tracking-tighter text-xl mb-2 leading-none">{asset.title}</h3>
                  <p className="text-gray-500 text-[11px] font-medium mb-8 line-clamp-2 leading-relaxed">{asset.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[#FF8C00] font-black text-lg tracking-widest">GHS {asset.price.toFixed(2)}</span>
                    <button className="flex items-center space-x-2 text-white font-black uppercase tracking-widest text-[10px] hover:text-[#FF8C00] transition-colors group/btn">
                      <Download size={14} className="group-hover/btn:scale-110 transition-transform"/>
                      <span>License</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center glass rounded-[48px] border border-dashed border-white/10 animate-pulse">
            <ImageIcon className="text-zinc-800 mx-auto mb-6" size={56} />
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">No digital assets manifested in this sector yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
