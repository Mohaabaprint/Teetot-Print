
import React, { useState, useRef } from 'react';
import { 
  Package, ShoppingCart, Settings, Plus, Trash2, Edit, Save, 
  Globe, Lock, X, Layout, Image as ImageIcon, 
  Upload, RotateCcw, Star, Eye, CheckCircle2, AlertTriangle, ChevronRight,
  PlusCircle, Mail, Phone, MapPin, ExternalLink, Printer
} from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { Product, resolveImageUrl, optimizeImage, DesignAsset, Order, SiteSettings, Category, DesignCategory } from '../types';

export const AdminDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'designs' | 'settings' | 'seo' | 'cms'>('products');
  const { products, setProducts, designAssets, setDesignAssets, orders, setOrders, settings, setSettings, resetStorage } = useCMS();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingDesign, setEditingDesign] = useState<DesignAsset | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const itemImageInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Basit2525') {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'design' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsOptimizing(true);
    try {
      const optimizedBase64 = await optimizeImage(file);
      if (target === 'product' && editingProduct) setEditingProduct({ ...editingProduct, image: optimizedBase64 });
      else if (target === 'design' && editingDesign) setEditingDesign({ ...editingDesign, thumbnail: optimizedBase64 });
      else if (target === 'logo') setSettings({ ...settings, logoUrl: optimizedBase64 });
    } catch (err) {
      alert('Upload failed. Try a smaller file.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (isAddingNew) {
      setProducts(prev => [{ ...editingProduct, id: Date.now().toString() }, ...prev]);
    } else {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
    }
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const saveDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDesign) return;
    if (isAddingNew) {
      setDesignAssets(prev => [{ ...editingDesign, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]);
    } else {
      setDesignAssets(prev => prev.map(d => d.id === editingDesign.id ? editingDesign : d));
    }
    setEditingDesign(null);
    setIsAddingNew(false);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (viewingOrder?.id === orderId) setViewingOrder(prev => prev ? { ...prev, status } : null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="glass p-10 rounded-[40px] border border-white/10 w-full max-w-md text-center">
          <div className="w-20 h-20 orange-gradient rounded-3xl flex items-center justify-center text-black mx-auto mb-8 shadow-xl shadow-orange-500/20">
            <Lock size={32} />
          </div>
          <h2 className="font-heading font-black text-3xl text-white mb-6 uppercase tracking-tighter">Terminal Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
              className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-[#FF8C00] text-center tracking-widest"
            />
            {loginError && <p className="text-red-500 text-[10px] font-black uppercase">Access Denied.</p>}
            <button type="submit" className="w-full orange-gradient text-black font-black uppercase py-5 rounded-2xl tracking-[0.2em] shadow-lg shadow-orange-500/20">
              Unlock Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-black flex flex-col md:flex-row">
      <aside className="w-full md:w-64 glass border-r border-white/5 p-6 space-y-2 shrink-0">
        <div className="flex items-center space-x-2 mb-8 px-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h2 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Core Live</h2>
        </div>
        {[
          { id: 'products', label: 'Inventory', icon: <Package size={18} /> },
          { id: 'designs', label: 'Design HQ', icon: <Star size={18} /> },
          { id: 'orders', label: 'Order Hub', icon: <ShoppingCart size={18} /> },
          { id: 'cms', label: 'CMS Config', icon: <Layout size={18} /> },
          { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
          { id: 'seo', label: 'SEO Data', icon: <Globe size={18} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setEditingProduct(null); setEditingDesign(null); setViewingOrder(null); }}
            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'orange-gradient text-black shadow-lg shadow-orange-500/10' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
        <div className="pt-10 border-t border-white/5 mt-10">
          <button onClick={resetStorage} className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-[10px] font-black uppercase text-zinc-600 hover:text-red-500">
            <RotateCcw size={14} /> <span>System Reset</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="font-heading font-black text-4xl uppercase tracking-tighter text-white">
              {activeTab.toUpperCase()} <span className="text-[#FF8C00]">Control</span>
            </h1>
            {(activeTab === 'products' || activeTab === 'designs') && (
              <button onClick={() => { setIsAddingNew(true); if (activeTab === 'products') setEditingProduct({ id: '', name: '', description: '', price: 0, category: 'Apparel', image: '', stock: 100 }); else setEditingDesign({ id: '', title: '', description: '', price: 0, category: 'T-Shirt', thumbnail: '', createdAt: '' }); }}
                className="orange-gradient text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center"
              >
                <Plus size={16} className="mr-2" /> New Asset
              </button>
            )}
          </div>

          {/* Viewing Order Details - Detailed Hub */}
          {viewingOrder && (
            <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="glass w-full max-w-6xl max-h-[95vh] rounded-[40px] border border-white/10 overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div>
                    <h2 className="text-white font-black text-3xl uppercase tracking-tighter">Manifest: <span className="text-[#FF8C00]">{viewingOrder.id}</span></h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Processed: {new Date(viewingOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => window.print()} className="p-3 glass rounded-xl hover:bg-white/10 text-white"><Printer size={20} /></button>
                    <button onClick={() => setViewingOrder(null)} className="p-3 glass rounded-xl hover:bg-red-500/20 text-red-500"><X size={20} /></button>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3 space-y-6">
                    <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-[10px]">Print Production Queue</h3>
                    {viewingOrder.items.map((item, idx) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <div key={idx} className="glass p-6 rounded-3xl border border-white/5 flex gap-8">
                          <div className="w-48 h-48 glass rounded-2xl overflow-hidden shrink-0 border border-white/10 relative bg-zinc-900 group">
                            {product && <img src={resolveImageUrl(product.image)} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />}
                            {item.designUrl && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                                <img src={item.designUrl} 
                                  style={{ transform: `scale(${(item.designScale || 100) / 100}) translate(${item.designX || 0}px, ${item.designY || 0}px)` }}
                                  className="max-w-full max-h-full object-contain filter drop-shadow(0 0 10px rgba(0,0,0,0.7))" 
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-grow flex flex-col justify-center">
                            <h4 className="text-white font-black uppercase text-xl mb-3">{product?.name || 'Asset Error'}</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="glass p-3 rounded-xl border border-white/5">
                                <p className="text-zinc-500 text-[8px] font-black uppercase mb-1">Unit Config</p>
                                <p className="text-white font-black text-sm">{item.size || 'N/A'} • Qty: {item.quantity}</p>
                              </div>
                              <div className="glass p-3 rounded-xl border border-white/5">
                                <p className="text-zinc-500 text-[8px] font-black uppercase mb-1">Print Offset</p>
                                <p className="text-[#FF8C00] font-black text-xs">X: {item.designX} | Y: {item.designY} | Scale: {item.designScale}%</p>
                              </div>
                            </div>
                            {item.designUrl && (
                              <a href={item.designUrl} download={`teetot-${viewingOrder.id}-artwork.png`} className="mt-6 inline-flex items-center text-[10px] font-black text-white hover:text-[#FF8C00] uppercase transition-colors">
                                <ExternalLink size={14} className="mr-2" /> Download Original High-Res PNG
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-6">
                    <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                      <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-[10px]">Client Intel</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-zinc-500 text-[8px] font-black uppercase">Recipient</p>
                          <p className="text-white font-bold text-xs">{viewingOrder.customerName}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-[8px] font-black uppercase">Signal</p>
                          <p className="text-white font-bold text-xs">{viewingOrder.customerPhone}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-[8px] font-black uppercase">Location</p>
                          <p className="text-white font-bold text-xs leading-relaxed">{viewingOrder.customerAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-[#FF8C00]/20 space-y-4">
                      <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-[10px]">Financials</h3>
                      <div className="flex justify-between">
                         <span className="text-zinc-500 text-[10px] font-black">Momo ID</span>
                         <span className="text-white font-mono text-xs">{viewingOrder.transactionId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/5">
                         <span className="text-zinc-500 text-[10px] font-black">Total</span>
                         <span className="text-white font-black text-lg">GHS {viewingOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-white/5 space-y-3">
                      <h3 className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Lifecycle</h3>
                      {['Pending', 'Printing', 'Shipped', 'Delivered'].map(s => (
                        <button key={s} onClick={() => updateOrderStatus(viewingOrder.id, s as any)}
                          className={`w-full py-3 rounded-xl text-[9px] font-black uppercase border transition-all ${viewingOrder.status === s ? 'orange-gradient text-black border-[#FF8C00]' : 'glass border-white/5 text-zinc-500 hover:text-white'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content Logic */}
          {activeTab === 'orders' && (
            <div className="glass rounded-[40px] border border-white/5 overflow-hidden animate-in fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase text-zinc-500">Manifest</th>
                      <th className="p-6 text-[10px] font-black uppercase text-zinc-500">Customer</th>
                      <th className="p-6 text-[10px] font-black uppercase text-zinc-500">Payment</th>
                      <th className="p-6 text-[10px] font-black uppercase text-zinc-500">Status</th>
                      <th className="p-6 text-[10px] font-black uppercase text-zinc-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setViewingOrder(order)}>
                        <td className="p-6 font-mono text-xs text-[#FF8C00]">{order.id}</td>
                        <td className="p-6">
                          <p className="text-white font-black text-xs uppercase">{order.customerName}</p>
                          <p className="text-zinc-500 text-[9px] font-bold">{order.customerPhone}</p>
                        </td>
                        <td className="p-6 font-mono text-[10px] text-zinc-400">{order.transactionId || '---'}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${order.status === 'Printing' ? 'bg-[#FF8C00]/20 text-[#FF8C00]' : 'bg-white/5 text-zinc-400'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <button className="p-2 glass rounded-lg text-[#FF8C00] hover:bg-[#FF8C00] hover:text-black transition-all"><Eye size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Re-implementing simplified product editing for space */}
          {activeTab === 'products' && !editingProduct && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
              {products.map(p => (
                <div key={p.id} className="glass p-6 rounded-[32px] border border-white/5 group">
                  <div className="aspect-square bg-zinc-900 rounded-2xl mb-4 overflow-hidden">
                    <img src={resolveImageUrl(p.image)} className="w-full h-full object-cover transition-all" />
                  </div>
                  <h3 className="text-white font-black uppercase text-sm mb-1">{p.name}</h3>
                  <p className="text-[#FF8C00] font-black text-xs mb-4">GHS {p.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingProduct(p); setIsAddingNew(false); }} className="flex-grow glass border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase">Modify</button>
                    <button onClick={() => setProducts(products.filter(i => i.id !== p.id))} className="px-4 glass border border-red-500/20 text-red-500 rounded-xl"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingProduct && (
            <div className="glass p-10 rounded-[40px] border border-white/10 max-w-2xl animate-in slide-in-from-bottom-4">
              <form onSubmit={saveProduct} className="space-y-6">
                <div className="flex justify-center mb-8">
                  <div className="w-40 h-40 glass rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900 cursor-pointer" onClick={() => itemImageInputRef.current?.click()}>
                    {editingProduct.image ? <img src={resolveImageUrl(editingProduct.image)} className="w-full h-full object-cover" /> : <Plus size={40} />}
                  </div>
                  <input type="file" ref={itemImageInputRef} className="hidden" onChange={e => handleFileUpload(e, 'product')} />
                </div>
                <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Product Name" className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white" />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} placeholder="Price" className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white" />
                  <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white">
                    <option value="Apparel">Apparel</option><option value="Accessories">Accessories</option><option value="Business">Business</option>
                  </select>
                </div>
                <button type="submit" className="w-full orange-gradient text-black py-4 rounded-xl font-black uppercase">Save Product</button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
