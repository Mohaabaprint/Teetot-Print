
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ChevronLeft, Plus, Minus } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { resolveImageUrl } from '../types';

export const Cart: React.FC = () => {
  const { cart, products, removeFromCart, updateCartQty } = useCMS();
  const navigate = useNavigate();

  const cartDetails = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const total = cartDetails.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 text-center px-4 bg-black min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-8 text-zinc-700">
            <ShoppingBag size={32} />
          </div>
          <h2 className="font-heading font-black text-3xl uppercase tracking-tighter text-white mb-4">Your basket is empty</h2>
          <p className="text-zinc-500 mb-10 font-medium">It looks like you haven't added any premium units to your mission yet.</p>
          <Link to="/shop" className="orange-gradient text-black px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs inline-flex items-center">
            Deploy to Shop <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/shop" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-12 uppercase tracking-widest text-[10px] font-black">
          <ChevronLeft size={16} className="mr-2" /> Continue Mission
        </Link>
        
        <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter text-white mb-12">
          Cart <span className="text-[#FF8C00]">Manifest</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cartDetails.map((item, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex items-center space-x-6 group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 relative bg-zinc-900">
                  <img src={resolveImageUrl(item.product!.image)} className="w-full h-full object-cover" alt={item.product!.name} />
                  {item.designUrl && (
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <img src={item.designUrl} className="max-w-full max-h-full object-contain opacity-80" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-black uppercase text-sm tracking-tight">{item.product!.name}</h3>
                    <button onClick={() => removeFromCart(item.productId, item.designUrl)} className="text-zinc-600 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 mb-4">
                    {item.size && <span className="text-[10px] font-black uppercase px-2 py-0.5 glass rounded text-[#FF8C00]">{item.size}</span>}
                    {item.designUrl && <span className="text-[10px] font-black uppercase px-2 py-0.5 glass rounded text-blue-400">Custom Design</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center glass rounded-lg border border-white/10">
                      <button onClick={() => updateCartQty(item.productId, item.quantity - 1, item.designUrl)} className="p-2 text-zinc-500 hover:text-white"><Minus size={14} /></button>
                      <span className="w-8 text-center text-white font-black text-xs">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.productId, item.quantity + 1, item.designUrl)} className="p-2 text-zinc-500 hover:text-white"><Plus size={14} /></button>
                    </div>
                    <span className="text-[#FF8C00] font-black text-sm">GHS {(item.product!.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="glass p-8 rounded-[32px] border border-white/10 shadow-xl shadow-orange-500/5">
              <h2 className="font-heading font-black text-xl uppercase tracking-tighter text-white mb-6">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>GHS {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  <span>Logistics</span>
                  <span className="text-green-500">Calculated at Verify</span>
                </div>
                <div className="h-px bg-white/5 pt-4"></div>
                <div className="flex justify-between text-white font-black text-lg uppercase tracking-tight">
                  <span>Total</span>
                  <span className="text-[#FF8C00]">GHS {total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full orange-gradient text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center hover:scale-[1.02] transition-transform">
                Proceed to Checkout <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed text-center px-4">
              Secure transactions via Momo. Quality inspection guaranteed on every unit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
