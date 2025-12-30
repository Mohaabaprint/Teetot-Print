
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ChevronLeft, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { resolveImageUrl } from '../types';

export const Checkout: React.FC = () => {
  const { cart, products, submitOrder } = useCMS();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    transactionId: ''
  });

  const total = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  const sendWhatsAppAlert = (orderId: string) => {
    const itemDetails = cart.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      return `- ${p?.name} (Qty: ${item.quantity}${item.size ? `, Size: ${item.size}` : ''})`;
    }).join('%0A');

    const message = `*NEW ORDER FROM TEETOTPRINT*%0A` +
      `*Order ID:* ${orderId}%0A%0A` +
      `*Customer:* ${formData.name}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Address:* ${formData.address}%0A%0A` +
      `*Items:*%0A${itemDetails}%0A%0A` +
      `*Total Payable:* GHS ${total.toFixed(2)}%0A` +
      `*Momo Transaction ID:* ${formData.transactionId}%0A%0A` +
      `_Please verify this transaction for production._`;

    const whatsappUrl = `https://wa.me/233242645533?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // In actual app, we'd pass this ID to submitOrder, but for simulation:
    submitOrder({
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      transactionId: formData.transactionId,
      items: cart,
      totalAmount: total
    });
    
    sendWhatsAppAlert(orderId);
    setIsSubmitted(true);
  };

  if (cart.length === 0 && !isSubmitted) {
    return <div className="pt-40 text-center text-white">Manifest session expired. <Link to="/shop" className="text-[#FF8C00]">Return to Shop</Link></div>;
  }

  if (isSubmitted) {
    return (
      <div className="pt-40 pb-24 bg-black min-h-screen flex items-center justify-center px-4">
        <div className="glass p-12 rounded-[40px] border border-[#FF8C00]/30 text-center max-w-lg animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 orange-gradient rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-2xl shadow-orange-500/20">
            <CheckCircle size={40} />
          </div>
          <h2 className="font-heading font-black text-4xl uppercase tracking-tighter mb-4 text-white">Verification Sent</h2>
          <p className="text-zinc-500 mb-10 font-medium leading-relaxed">
            Order submitted and WhatsApp alert triggered. Our team will verify Transaction <span className="text-[#FF8C00] font-mono">{formData.transactionId}</span>. Check your WhatsApp to complete the transmission.
          </p>
          <button onClick={() => navigate('/')} className="orange-gradient text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg shadow-orange-500/20">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <Link to="/cart" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors mb-12 uppercase tracking-widest text-[10px] font-black">
            <ChevronLeft size={16} className="mr-2" /> Adjust Manifest
          </Link>
          <h1 className="font-heading font-black text-5xl uppercase tracking-tighter text-white mb-10">
            Payment & <span className="text-[#FF8C00]">Verify</span>
          </h1>
          
          <div className="glass p-8 rounded-[32px] border border-[#FF8C00]/20 mb-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 orange-gradient rounded-2xl flex items-center justify-center text-black">
                <CreditCard size={28} />
              </div>
              <div>
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Mobile Money Transfer</h3>
                <p className="text-[#FF8C00] font-bold text-[10px] uppercase tracking-widest">All Networks Supported</p>
              </div>
            </div>
            
            <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Momo Terminal</span>
                <span className="text-white font-black text-2xl tracking-tighter">0242645533</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Target Account</span>
                <span className="text-white font-bold text-xs uppercase tracking-widest">Teetot Print Solutions</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Payable Total</span>
                <span className="text-[#FF8C00] font-black text-2xl">GHS {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 flex items-start space-x-4 text-zinc-500 text-[10px] font-bold uppercase leading-relaxed tracking-widest">
              <ShieldCheck className="text-green-500 shrink-0" size={20} />
              <p>Transfer the total amount to the number above. A WhatsApp alert will be triggered upon submission to notify the owner immediately.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="glass p-10 rounded-[40px] border border-white/10 sticky top-32 shadow-2xl">
            <h2 className="font-heading font-black text-2xl uppercase tracking-tighter text-white mb-8">Verification Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Client Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold focus:border-[#FF8C00] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Signal Phone</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs font-bold focus:border-[#FF8C00] outline-none" placeholder="024XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Signal Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs font-bold focus:border-[#FF8C00] outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Dispatch Address</label>
                <textarea required rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs font-medium focus:border-[#FF8C00] outline-none" placeholder="Delivery coordinates..." />
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF8C00] ml-1">Momo Transaction ID</label>
                <input required value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} className="w-full glass bg-white/10 border border-[#FF8C00]/50 rounded-xl p-4 text-white font-mono text-xl focus:border-[#FF8C00] outline-none uppercase" placeholder="Enter ID from SMS" />
              </div>
              <button type="submit" className="w-full orange-gradient text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center hover:scale-[1.02] transition-transform shadow-2xl shadow-orange-500/20">
                Finalize Order & Alert <Send size={18} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
