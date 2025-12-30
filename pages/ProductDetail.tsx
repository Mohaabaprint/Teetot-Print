
import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Upload, ShoppingCart, Shield, Truck, Zap, Loader2, X, Maximize, Move } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { resolveImageUrl, optimizeImage } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { products, addToCart } = useCMS();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [customDesign, setCustomDesign] = useState<string | undefined>(undefined);
  const [designScale, setDesignScale] = useState(100);
  const [designX, setDesignX] = useState(0);
  const [designY, setDesignY] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const product = products.find(p => p.id === id);

  if (!product) return <div className="pt-32 text-center text-white">Product not found.</div>;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, customDesign, size, designScale, designX, designY);
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsOptimizing(true);
      try {
        const optimizedBase64 = await optimizeImage(file);
        setCustomDesign(optimizedBase64);
        setDesignScale(100);
        setDesignX(0);
        setDesignY(0);
      } catch (err) {
        alert("Failed to optimize design asset.");
        setFileName(null);
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-12 uppercase tracking-widest text-xs font-black">
          <ChevronLeft size={16} className="mr-2" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-4">
            <div className="glass rounded-3xl overflow-hidden aspect-square border border-white/5 relative bg-zinc-950">
              <img src={resolveImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover opacity-80" />
              
              {/* Custom Design Overlay */}
              {customDesign && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/5 aspect-square border border-dashed border-[#FF8C00]/40 rounded-lg flex items-center justify-center p-2 relative">
                    <img 
                      src={customDesign} 
                      style={{ 
                        transform: `scale(${designScale / 100}) translate(${designX}px, ${designY}px)`,
                        filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))'
                      }}
                      className="max-w-full max-h-full object-contain transition-transform duration-200" 
                      alt="User Design"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-8">
              <span className="text-[#FF8C00] font-black uppercase tracking-widest text-xs mb-4 block">{product.category}</span>
              <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-white mb-4 leading-none">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 font-medium">
                {product.description}
              </p>
              <p className="text-[#FF8C00] font-black text-4xl tracking-widest">GHS {product.price.toFixed(2)}</p>
            </div>

            <div className="space-y-8 mb-10">
              {product.category === 'Apparel' && (
                <div>
                  <label className="text-white font-black uppercase tracking-widest text-xs mb-4 block">Select Size</label>
                  <div className="flex space-x-3">
                    {['S', 'M', 'L', 'XL', '2XL'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => setSize(s)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all border ${size === s ? 'orange-gradient text-black border-[#FF8C00]' : 'glass text-white border-white/10 hover:border-white/30'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-white font-black uppercase tracking-widest text-xs mb-4 block">Custom Artwork (POD)</label>
                <div className="space-y-6">
                  <div className="relative">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                    <div 
                      onClick={() => !isOptimizing && fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center glass border-2 border-dashed border-white/10 rounded-2xl p-8 cursor-pointer hover:border-[#FF8C00]/50 transition-all group"
                    >
                      {isOptimizing ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="text-[#FF8C00] animate-spin mb-4" size={32} />
                          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Processing Transparency...</span>
                        </div>
                      ) : (
                        <>
                          {customDesign ? (
                            <div className="relative flex flex-col items-center">
                               <img src={customDesign} className="w-16 h-16 object-contain rounded mb-4" />
                               <span className="text-green-400 font-black text-[9px] uppercase tracking-widest">Transparency Fixed</span>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setCustomDesign(undefined); setFileName(null); }}
                                 className="absolute -top-4 -right-4 bg-red-500 p-1.5 rounded-full hover:scale-110 transition-transform"
                               >
                                 <X size={12} />
                               </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="text-gray-500 mb-4 group-hover:text-[#FF8C00] transition-colors" size={32} />
                              <span className="text-white font-bold uppercase tracking-widest text-[10px] mb-1">
                                {fileName || 'Upload Transparent Design'}
                              </span>
                              <span className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em]">PNG Recommended for Transparency</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Resizer & Positioning Controls */}
                  {customDesign && !isOptimizing && (
                    <div className="glass p-6 rounded-2xl border border-[#FF8C00]/20 animate-in fade-in slide-in-from-top-4 space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-2">
                            <Maximize size={14} className="text-[#FF8C00]" />
                            <label className="text-white font-black uppercase tracking-widest text-[10px]">Magnification</label>
                          </div>
                          <span className="text-[#FF8C00] font-black text-[10px]">{designScale}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="200" 
                          value={designScale}
                          onChange={(e) => setDesignScale(Number(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <Move size={14} className="text-[#FF8C00]" />
                            <label className="text-white font-black uppercase tracking-widest text-[10px]">X-Offset</label>
                          </div>
                          <input 
                            type="range" 
                            min="-100" 
                            max="100" 
                            value={designX}
                            onChange={(e) => setDesignX(Number(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-4">
                            <Move size={14} className="text-[#FF8C00]" />
                            <label className="text-white font-black uppercase tracking-widest text-[10px]">Y-Offset</label>
                          </div>
                          <input 
                            type="range" 
                            min="-100" 
                            max="100" 
                            value={designY}
                            onChange={(e) => setDesignY(Number(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => { setDesignX(0); setDesignY(0); setDesignScale(100); }}
                        className="text-[9px] font-black uppercase text-zinc-500 hover:text-white transition-colors tracking-widest"
                      >
                        Reset Adjustments
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-white font-black uppercase tracking-widest text-xs mb-4 block">Order Units</label>
                <div className="flex items-center space-x-6">
                   <div className="flex items-center glass border border-white/10 rounded-lg">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-12 flex items-center justify-center text-white hover:text-[#FF8C00] font-black">-</button>
                      <span className="w-12 text-center font-black text-white">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-12 flex items-center justify-center text-white hover:text-[#FF8C00] font-black">+</button>
                   </div>
                   <button 
                    onClick={handleAddToCart}
                    className="flex-grow orange-gradient text-black py-4 rounded-lg font-black uppercase tracking-widest text-xs flex items-center justify-center hover:scale-[1.02] transition-transform shadow-xl shadow-orange-500/20"
                   >
                     <ShoppingCart size={18} className="mr-2" /> Commit to Cart
                   </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-white/5">
              {[
                { icon: <Shield size={18} />, label: 'Premium Quality' },
                { icon: <Truck size={18} />, label: 'Swift Delivery' },
                { icon: <Zap size={18} />, label: 'Vibrant Colors' }
              ].map((badge, i) => (
                <div key={i} className="flex items-center space-x-2 text-zinc-500 font-bold uppercase tracking-[0.15em] text-[10px]">
                  <span className="text-[#FF8C00]">{badge.icon}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
