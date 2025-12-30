
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { Category, resolveImageUrl } from '../types';

export const Shop: React.FC = () => {
  const { products } = useCMS();
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: (Category | 'All')[] = ['All', 'Apparel', 'Accessories', 'Business', 'Gifts'];

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="font-heading font-black text-5xl md:text-6xl uppercase tracking-tighter text-white mb-4">The Collection</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Premium Blanks Ready For Your Designs</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${activeCategory === cat ? 'orange-gradient text-black border-[#FF8C00]' : 'glass text-gray-400 border-white/5 hover:border-white/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#FF8C00] transition-colors"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="group block">
                <div className="relative overflow-hidden rounded-2xl glass border border-white/5 mb-6 aspect-[4/5]">
                  <img 
                    src={resolveImageUrl(product.image)} 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                  />
                  
                  <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#FF8C00] border border-[#FF8C00]/30 z-20 group-hover:bg-[#FF8C00] group-hover:text-black transition-colors duration-300">
                    {product.category}
                  </div>

                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 z-10">
                    <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-bold text-xl text-white uppercase tracking-wider mb-1">{product.name}</h3>
                      <p className="text-[#FF8C00] font-black text-lg tracking-widest mb-4">GHS {product.price.toFixed(2)}</p>
                      <button className="w-full orange-gradient text-black py-3 rounded-lg font-black text-xs uppercase tracking-widest transform transition-transform duration-300 hover:scale-[1.02]">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="font-bold text-lg text-white uppercase tracking-wider mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-[#FF8C00] font-black text-sm tracking-widest">GHS {product.price.toFixed(2)}</p>
                    <span className="text-[10px] font-black uppercase text-white/40">Discover &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass rounded-2xl border border-white/5">
            <p className="text-gray-500 font-bold uppercase tracking-widest">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
