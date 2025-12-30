
import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export const CustomQuote: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-24 flex items-center justify-center px-4">
        <div className="glass p-12 rounded-3xl border border-[#FF8C00]/30 text-center max-w-lg">
          <div className="w-20 h-20 orange-gradient rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-2xl shadow-[#FF8C00]/20 animate-bounce">
            <CheckCircle size={40} />
          </div>
          <h2 className="font-heading font-black text-4xl uppercase tracking-tighter mb-4 text-white">Inquiry Received!</h2>
          <p className="text-gray-400 mb-8 font-medium">Our sales team will review your requirements and get back to you with a custom quote within 24 hours.</p>
          <button onClick={() => setSubmitted(false)} className="text-[#FF8C00] font-black uppercase tracking-widest text-sm hover:underline">Send another inquiry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-white mb-8 leading-none">
            Scale Your <span className="text-[#FF8C00]">Impact.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
            Need 100 shirts for an event? Or branding for your entire corporate team? We specialize in high-volume, professional printing with significant discounts.
          </p>
          
          <div className="space-y-8">
            {[
              { title: 'Corporate Branding', desc: 'Uniforms, gift boxes, and office merchandise.' },
              { title: 'Event Apparel', desc: 'Conferences, music festivals, and sports teams.' },
              { title: 'White Label POD', desc: 'Scale your online brand with our fulfillment.' }
            ].map((item, i) => (
              <div key={i} className="flex space-x-6 group">
                <div className="shrink-0 w-12 h-12 glass rounded-xl border border-white/10 flex items-center justify-center text-[#FF8C00] font-black group-hover:border-[#FF8C00]/50 transition-all">{i+1}</div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-widest mb-1">{item.title}</h4>
                  <p className="text-zinc-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-10 rounded-3xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Full Name</label>
                <input required type="text" className="w-full glass bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF8C00]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Company Name</label>
                <input type="text" className="w-full glass bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF8C00]" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Email Address</label>
              <input required type="email" className="w-full glass bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF8C00]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Product Type</label>
                <select className="w-full glass bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF8C00] appearance-none">
                  <option className="bg-zinc-900">T-Shirts</option>
                  <option className="bg-zinc-900">Hoodies</option>
                  <option className="bg-zinc-900">Business Cards</option>
                  <option className="bg-zinc-900">Other Merchandise</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Approx. Quantity</label>
                <input required type="number" min="10" placeholder="Min 10" className="w-full glass bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF8C00]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Project Description</label>
              <textarea required rows={4} className="w-full glass bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF8C00]" placeholder="Tell us about your printing needs..."></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Upload Reference Design</label>
              <input type="file" className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#FF8C00] file:text-black hover:file:bg-[#FF4500]" />
            </div>

            <button type="submit" className="w-full orange-gradient text-black font-black uppercase tracking-widest py-4 rounded-lg flex items-center justify-center hover:scale-[1.01] transition-transform">
              Send Quote Request <Send size={18} className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
