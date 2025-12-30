
import React, { useState, useRef } from 'react';
import { 
  Package, ShoppingCart, Settings, Plus, Trash2, Edit, Save, 
  Globe, Lock, X, Layout, Image as ImageIcon, 
  Upload, RotateCcw, Star, Eye, PlusCircle, Phone, MapPin, ExternalLink, Printer, Trash, Info
} from 'lucide-react';
import { useCMS } from '../store/CMSContext';
import { Product, resolveImageUrl, optimizeImage, DesignAsset, Order, SiteSettings, Category, DesignCategory } from '../types';

export const AdminDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'designs' | 'settings' | 'seo' | 'cms'>('products');
  const { 
    products, setProducts, 
    designAssets, setDesignAssets, 
    orders, setOrders, 
    settings, setSettings, 
    resetStorage 
  } = useCMS();

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
      alert('Upload failed. Try a smaller image.');
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

  const updateArrayField = (field: 'features' | 'process' | 'faqs', index: number, key: string, value: string) => {
    const newArray = [...settings[field]] as any[];
    newArray[index] = { ...newArray[index], [key]: value };
    updateSetting(field, newArray);
  };

  const addArrayItem = (field: 'features' | 'process' | 'faqs') => {
    const defaultItems = { 
      features: { title: 'New Feature', desc: 'Feature detail' }, 
      process: { step: '0', title: 'New Step', desc: 'Process detail' }, 
      faqs: { q: 'New Question?', a: 'Answer detail' } 
    };
    updateSetting(field, [...settings[field], (defaultItems as any)[field]]);
  };

  const removeArrayItem = (field: 'features' | 'process' | 'faqs', index: number) => {
    updateSetting(field, settings[field].filter((_, i) => i !== index));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (viewingOrder?.id === orderId) setViewingOrder(prev => prev ? { ...prev, status } : null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="glass p-10 rounded-[40px] border border-white/10 w-full max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 orange-gradient rounded-3xl flex items-center justify-center text-black mx-auto mb-8 shadow-xl shadow-orange-500/20">
            <Lock size={32} />
          </div>
          <h2 className="font-heading font-black text-3xl text-white mb-6 uppercase tracking-widest leading-none">Terminal Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="System Password"
              className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-[#FF8C00] text-center tracking-widest font-bold"
            />
            {loginError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Unauthorized Access Denied.</p>}
            <button type="submit" className="w-full orange-gradient text-black font-black uppercase py-5 rounded-2xl tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform">
              Unlock Terminal
            </button>
          </form>
          <p className="mt-8 text-zinc-600 text-[9px] font-black uppercase tracking-widest italic">Core Admin Privileges Required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 glass border-r border-white/5 p-6 space-y-2 shrink-0 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-10 px-4">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
          <h2 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">Node Active</h2>
        </div>
        {[
          { id: 'products', label: 'Inventory', icon: <Package size={18} /> },
          { id: 'designs', label: 'Design HQ', icon: <Star size={18} /> },
          { id: 'orders', label: 'Order Hub', icon: <ShoppingCart size={18} /> },
          { id: 'cms', label: 'Website CMS', icon: <Layout size={18} /> },
          { id: 'settings', label: 'Site Config', icon: <Settings size={18} /> },
          { id: 'seo', label: 'SEO Calibration', icon: <Globe size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setEditingProduct(null);
              setEditingDesign(null);
              setViewingOrder(null);
            }}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'orange-gradient text-black shadow-xl shadow-orange-500/20' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
        <div className="pt-12 border-t border-white/5 mt-12 px-2">
          <button onClick={resetStorage} className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-colors">
            <RotateCcw size={14} />
            <span>Factory Reset</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto bg-[#020202]">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div>
              <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter text-white leading-none">
                {activeTab.toUpperCase()} <span className="text-[#FF8C00]">TERMINAL</span>
              </h1>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-4 flex items-center">
                <Info size={12} className="mr-2" /> Authorized access to site parameters and manifests.
              </p>
            </div>
            
            {(activeTab === 'products' || activeTab === 'designs') && !editingProduct && !editingDesign && (
              <button 
                onClick={() => {
                  setIsAddingNew(true);
                  if (activeTab === 'products') {
                    setEditingProduct({ id: '', name: '', description: '', price: 0, category: 'Apparel', image: '', stock: 100 });
                  } else {
                    setEditingDesign({ id: '', title: '', description: '', price: 0, category: 'T-Shirt', thumbnail: '', createdAt: '' });
                  }
                }}
                className="orange-gradient text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center shadow-2xl shadow-orange-500/20 hover:scale-105 transition-transform"
              >
                <Plus size={18} className="mr-2" /> Deploy New Asset
              </button>
            )}
          </header>

          {/* Tab: Inventory (Products) */}
          {activeTab === 'products' && (
            <div className="animate-in fade-in duration-500">
              {editingProduct ? (
                <div className="glass p-10 rounded-[40px] border border-[#FF8C00]/20 max-w-3xl mx-auto shadow-2xl">
                  <h2 className="font-heading font-black text-3xl uppercase tracking-tighter text-white mb-10">{isAddingNew ? 'Deploy New SKU' : 'Modify Asset'}</h2>
                  <form onSubmit={saveProduct} className="space-y-8">
                    <div className="flex justify-center">
                      <div className="relative group cursor-pointer" onClick={() => itemImageInputRef.current?.click()}>
                        <div className="w-48 h-48 glass rounded-[32px] overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900 shadow-inner">
                          {editingProduct.image ? <img src={resolveImageUrl(editingProduct.image)} className="w-full h-full object-cover" /> : <ImageIcon size={48} className="text-zinc-700" />}
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[32px] border-2 border-dashed border-[#FF8C00]/50">
                          <Upload size={24} className="text-white" />
                        </div>
                        <input type="file" ref={itemImageInputRef} onChange={e => handleFileUpload(e, 'product')} className="hidden" accept="image/*" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Asset Name</label>
                        <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Manifest Category</label>
                        <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00] appearance-none">
                          <option className="bg-zinc-900" value="Apparel">Apparel</option>
                          <option className="bg-zinc-900" value="Accessories">Accessories</option>
                          <option className="bg-zinc-900" value="Business">Business</option>
                          <option className="bg-zinc-900" value="Gifts">Gifts</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Base Price (GHS)</label>
                        <input required type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Stock Reservoir</label>
                        <input required type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Description Brief</label>
                      <textarea rows={4} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none focus:border-[#FF8C00]" />
                    </div>
                    <div className="flex gap-4 pt-6">
                      <button type="submit" className="flex-grow orange-gradient text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.01] transition-transform">Commit Manifest</button>
                      <button type="button" onClick={() => setEditingProduct(null)} className="px-10 glass border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/5">Abort</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(p => (
                    <div key={p.id} className="glass p-8 rounded-[40px] border border-white/5 group relative hover:border-[#FF8C00]/30 transition-all">
                      <div className="aspect-square bg-zinc-950 rounded-3xl mb-6 overflow-hidden border border-white/5 shadow-inner">
                        <img src={resolveImageUrl(p.image)} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <div className="mb-6">
                        <h3 className="text-white font-black uppercase text-lg tracking-tight mb-2">{p.name}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-[#FF8C00] font-black text-lg">GHS {p.price.toFixed(2)}</span>
                          <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">{p.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingProduct(p); setIsAddingNew(false); }} className="flex-grow glass border border-white/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center">
                          <Edit size={14} className="mr-2" /> Modify
                        </button>
                        <button onClick={() => { if(confirm('Delete this asset?')) setProducts(prev => prev.filter(i => i.id !== p.id)) }} className="px-5 glass border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Design HQ */}
          {activeTab === 'designs' && (
            <div className="animate-in fade-in duration-500">
              {editingDesign ? (
                <div className="glass p-10 rounded-[40px] border border-[#FF8C00]/20 max-w-3xl mx-auto shadow-2xl">
                  <h2 className="font-heading font-black text-3xl uppercase tracking-tighter text-white mb-10">{isAddingNew ? 'Deploy New Asset' : 'Edit HQ Asset'}</h2>
                  <form onSubmit={saveDesign} className="space-y-8">
                    <div className="flex justify-center">
                      <div className="relative group cursor-pointer" onClick={() => itemImageInputRef.current?.click()}>
                        <div className="w-48 h-48 glass rounded-[32px] overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900 shadow-inner">
                          {editingDesign.thumbnail ? <img src={resolveImageUrl(editingDesign.thumbnail)} className="w-full h-full object-contain p-6" /> : <Star size={48} className="text-zinc-700" />}
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[32px] border-2 border-dashed border-[#FF8C00]/50">
                          <Upload size={24} className="text-white" />
                        </div>
                        <input type="file" ref={itemImageInputRef} onChange={e => handleFileUpload(e, 'design')} className="hidden" accept="image/*" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Asset Title</label>
                        <input required value={editingDesign.title} onChange={e => setEditingDesign({...editingDesign, title: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Design Category</label>
                        <select value={editingDesign.category} onChange={e => setEditingDesign({...editingDesign, category: e.target.value as DesignCategory})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00] appearance-none">
                          <option className="bg-zinc-900" value="T-Shirt">T-Shirt</option>
                          <option className="bg-zinc-900" value="Caps">Caps</option>
                          <option className="bg-zinc-900" value="Tote Bags">Tote Bags</option>
                          <option className="bg-zinc-900" value="Pillow Cases">Pillow Cases</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Licensing Fee (GHS)</label>
                      <input required type="number" step="0.01" value={editingDesign.price} onChange={e => setEditingDesign({...editingDesign, price: parseFloat(e.target.value)})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Asset Context</label>
                      <textarea rows={4} value={editingDesign.description} onChange={e => setEditingDesign({...editingDesign, description: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none focus:border-[#FF8C00]" />
                    </div>
                    <div className="flex gap-4 pt-6">
                      <button type="submit" className="flex-grow orange-gradient text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.01] transition-transform">Finalize Asset</button>
                      <button type="button" onClick={() => setEditingDesign(null)} className="px-10 glass border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/5">Abort</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {designAssets.map(d => (
                    <div key={d.id} className="glass p-6 rounded-[32px] border border-white/5 group relative hover:border-[#FF8C00]/30 transition-all flex flex-col">
                      <div className="aspect-square bg-zinc-950 rounded-2xl mb-6 overflow-hidden flex items-center justify-center p-6 border border-white/5 shadow-inner">
                        <img src={resolveImageUrl(d.thumbnail)} className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-500" />
                      </div>
                      <div className="flex-grow mb-6">
                        <h3 className="text-white font-black uppercase text-sm tracking-tight mb-2 line-clamp-1">{d.title}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-[#FF8C00] font-black text-sm">GHS {d.price.toFixed(2)}</span>
                          <span className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.2em]">{d.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingDesign(d); setIsAddingNew(false); }} className="flex-grow glass border border-white/10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                          Modify
                        </button>
                        <button onClick={() => { if(confirm('Erase this asset from HQ?')) setDesignAssets(prev => prev.filter(i => i.id !== d.id)) }} className="px-3 glass border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Order Hub */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in duration-500">
              <div className="glass rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.03]">
                      <tr>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Manifest</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Client</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Momo Signal</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                        <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Intel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.length > 0 ? orders.map(order => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setViewingOrder(order)}>
                          <td className="p-8"><span className="text-[#FF8C00] font-mono font-black text-sm tracking-tighter">{order.id}</span></td>
                          <td className="p-8">
                            <p className="text-white font-black text-xs uppercase tracking-tight">{order.customerName}</p>
                            <p className="text-zinc-600 text-[9px] font-bold mt-1 uppercase">{order.customerPhone}</p>
                          </td>
                          <td className="p-8">
                            <p className="text-zinc-400 font-mono text-xs uppercase">{order.transactionId || 'AWAITING'}</p>
                            <p className="text-zinc-600 text-[9px] font-bold mt-1 uppercase tracking-widest">GHS {order.totalAmount.toFixed(2)}</p>
                          </td>
                          <td className="p-8">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                              order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/5' :
                              order.status === 'Printing' ? 'bg-[#FF8C00]/10 text-[#FF8C00] border-[#FF8C00]/20 shadow-orange-500/5' :
                              order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5' :
                              'bg-zinc-800 text-zinc-400 border-white/5'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-8 text-right">
                            <button className="p-3 glass rounded-xl text-[#FF8C00] hover:bg-[#FF8C00] hover:text-black transition-all shadow-lg">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="p-20 text-center">
                            <ShoppingCart className="text-zinc-800 mx-auto mb-4" size={48} />
                            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">No orders currently manifested.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Order View Modal */}
          {viewingOrder && (
            <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
              <div className="glass w-full max-w-6xl max-h-[95vh] rounded-[48px] border border-white/10 overflow-hidden flex flex-col shadow-[0_0_100px_rgba(255,140,0,0.15)] animate-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div>
                    <h2 className="text-white font-black text-4xl uppercase tracking-tighter leading-none">Manifest <span className="text-[#FF8C00]">{viewingOrder.id}</span></h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-4">Node Origin: {new Date(viewingOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => window.print()} className="p-4 glass rounded-2xl hover:bg-white/10 text-white transition-all"><Printer size={24} /></button>
                    <button onClick={() => setViewingOrder(null)} className="p-4 glass rounded-2xl hover:bg-red-500/20 text-red-500 transition-all"><X size={24} /></button>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-4 gap-12">
                  <div className="lg:col-span-3 space-y-8">
                    <h3 className="text-[#FF8C00] font-black uppercase tracking-[0.3em] text-[10px] mb-8">Print Production Queue</h3>
                    <div className="space-y-6">
                      {viewingOrder.items.map((item, idx) => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                          <div key={idx} className="glass p-8 rounded-[40px] border border-white/5 flex flex-col md:flex-row gap-10 hover:border-white/10 transition-all group">
                            <div className="w-56 h-56 glass rounded-[32px] overflow-hidden shrink-0 border border-white/10 relative bg-zinc-950 shadow-inner">
                              {product && <img src={resolveImageUrl(product.image)} className="w-full h-full object-cover opacity-30 grayscale-[0.5]" />}
                              {item.designUrl && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                                  <img src={item.designUrl} 
                                    style={{ transform: `scale(${(item.designScale || 100) / 100}) translate(${item.designX || 0}px, ${item.designY || 0}px)` }}
                                    className="max-w-full max-h-full object-contain filter drop-shadow(0 0 15px rgba(0,0,0,1))" 
                                  />
                                </div>
                              )}
                              <div className="absolute bottom-4 left-4 right-4 text-center">
                                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Production Preview</span>
                              </div>
                            </div>
                            <div className="flex-grow flex flex-col justify-center space-y-6">
                              <div>
                                <h4 className="text-white font-black uppercase text-2xl tracking-tighter mb-2">{product?.name || 'Asset Identification Error'}</h4>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{product?.category || 'Unknown'} Category</p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="glass p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                                  <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Configuration</p>
                                  <p className="text-white font-black text-sm uppercase">Size: {item.size || 'N/A'}</p>
                                </div>
                                <div className="glass p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                                  <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Quantity</p>
                                  <p className="text-[#FF8C00] font-black text-sm">{item.quantity} Units</p>
                                </div>
                                <div className="glass p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                                  <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mb-1">Positioning</p>
                                  <p className="text-zinc-400 font-mono text-[10px]">X:{item.designX} Y:{item.designY} S:{item.designScale}%</p>
                                </div>
                              </div>
                              {item.designUrl && (
                                <a href={item.designUrl} download={`teetot-${viewingOrder.id}-hq-artwork.png`} className="inline-flex items-center text-[10px] font-black text-[#FF8C00] hover:text-white uppercase tracking-widest transition-colors w-fit p-3 glass rounded-xl border border-[#FF8C00]/20 hover:border-[#FF8C00]">
                                  <ExternalLink size={16} className="mr-3" /> Fetch Original Assets
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6 bg-white/[0.01]">
                      <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-[10px]">Client Metadata</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#FF8C00]"><Phone size={16}/></div>
                          <div><p className="text-white font-bold text-xs">{viewingOrder.customerPhone}</p><p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Signal</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[#FF8C00]"><MapPin size={16}/></div>
                          <div><p className="text-white font-bold text-xs leading-tight">{viewingOrder.customerAddress}</p><p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Coordinates</p></div>
                        </div>
                      </div>
                    </div>

                    <div className="glass p-8 rounded-[40px] border border-[#FF8C00]/20 space-y-6 bg-[#FF8C00]/[0.02]">
                      <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-[10px]">Audit Log</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">Momo ID</span><span className="text-white font-mono text-sm tracking-tighter">{viewingOrder.transactionId || 'PENDING'}</span></div>
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center"><span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Revenue</span><span className="text-[#FF8C00] font-black text-2xl tracking-tighter">GHS {viewingOrder.totalAmount.toFixed(2)}</span></div>
                      </div>
                    </div>

                    <div className="glass p-8 rounded-[40px] border border-white/5 space-y-4">
                      <h3 className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Status Control</h3>
                      <div className="space-y-3">
                        {['Pending', 'Printing', 'Shipped', 'Delivered'].map(s => (
                          <button key={s} onClick={() => updateOrderStatus(viewingOrder.id, s as any)}
                            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${viewingOrder.status === s ? 'orange-gradient text-black border-[#FF8C00] shadow-lg shadow-orange-500/10' : 'glass border-white/5 text-zinc-500 hover:text-white'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Website CMS (The editable content) */}
          {activeTab === 'cms' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="glass p-10 rounded-[48px] border border-white/10 space-y-10 shadow-2xl">
                <header className="flex items-center gap-4">
                  <div className="p-3 orange-gradient text-black rounded-2xl"><Layout size={24}/></div>
                  <h3 className="text-white font-black uppercase text-2xl tracking-tighter">Hero & Landing Phase</h3>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Hero Headline</label>
                    <input value={settings.heroHeadline} onChange={e => updateSetting('heroHeadline', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black text-xl outline-none focus:border-[#FF8C00] uppercase tracking-tighter" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Sub-headline Description</label>
                    <textarea rows={4} value={settings.heroSubheadline} onChange={e => updateSetting('heroSubheadline', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm font-medium outline-none focus:border-[#FF8C00]" />
                  </div>
                </div>
              </div>

              <div className="glass p-10 rounded-[48px] border border-white/10 space-y-10 shadow-2xl">
                <header className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 orange-gradient text-black rounded-2xl"><Star size={24}/></div>
                    <h3 className="text-white font-black uppercase text-2xl tracking-tighter">Core Features</h3>
                  </div>
                  <button onClick={() => addArrayItem('features')} className="text-[#FF8C00] text-[10px] font-black uppercase tracking-widest flex items-center p-3 glass rounded-xl border border-[#FF8C00]/20 hover:border-[#FF8C00]"><Plus size={14} className="mr-2"/> Add Entry</button>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {settings.features.map((f, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex gap-4 items-start relative group">
                      <div className="flex-grow space-y-4">
                        <input placeholder="Feature Title" value={f.title} onChange={e => updateArrayField('features', i, 'title', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs font-black uppercase tracking-widest outline-none focus:border-[#FF8C00]" />
                        <textarea placeholder="Feature Description" rows={2} value={f.desc} onChange={e => updateArrayField('features', i, 'desc', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-[11px] outline-none focus:border-[#FF8C00]" />
                      </div>
                      <button onClick={() => removeArrayItem('features', i)} className="p-3 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-10 rounded-[48px] border border-white/10 space-y-10 shadow-2xl">
                <header className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 orange-gradient text-black rounded-2xl"><RotateCcw size={24}/></div>
                    <h3 className="text-white font-black uppercase text-2xl tracking-tighter">Production Process</h3>
                  </div>
                  <button onClick={() => addArrayItem('process')} className="text-[#FF8C00] text-[10px] font-black uppercase tracking-widest flex items-center p-3 glass rounded-xl border border-[#FF8C00]/20 hover:border-[#FF8C00]"><Plus size={14} className="mr-2"/> Add Phase</button>
                </header>
                <div className="space-y-4">
                  {settings.process.map((p, i) => (
                    <div key={i} className="glass p-6 rounded-3xl border border-white/5 flex flex-wrap lg:flex-nowrap gap-4 items-center group">
                      <div className="w-12 h-12 glass rounded-xl flex items-center justify-center text-[#FF8C00] font-black shrink-0">
                        <input value={p.step} onChange={e => updateArrayField('process', i, 'step', e.target.value)} className="w-full bg-transparent text-center focus:outline-none" />
                      </div>
                      <input placeholder="Phase Title" value={p.title} onChange={e => updateArrayField('process', i, 'title', e.target.value)} className="flex-grow lg:w-1/4 glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs font-bold uppercase outline-none focus:border-[#FF8C00]" />
                      <input placeholder="Phase Description" value={p.desc} onChange={e => updateArrayField('process', i, 'desc', e.target.value)} className="flex-grow lg:w-2/4 glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-[11px] outline-none focus:border-[#FF8C00]" />
                      <button onClick={() => removeArrayItem('process', i)} className="p-3 text-zinc-600 hover:text-red-500 shrink-0"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-10 rounded-[48px] border border-white/10 space-y-10 shadow-2xl">
                <header className="flex items-center gap-4">
                  <div className="p-3 orange-gradient text-black rounded-2xl"><Info size={24}/></div>
                  <h3 className="text-white font-black uppercase text-2xl tracking-tighter">Footer & Social Calibration</h3>
                </header>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Footer "About Us" Summary</label>
                    <textarea rows={3} value={settings.footerAboutText} onChange={e => updateSetting('footerAboutText', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-xs font-medium outline-none focus:border-[#FF8C00]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">TikTok Signal</label>
                      <input value={settings.tiktokUrl} onChange={e => updateSetting('tiktokUrl', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-[10px] font-mono outline-none focus:border-[#FF8C00]" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Instagram Signal</label>
                      <input value={settings.instagramUrl} onChange={e => updateSetting('instagramUrl', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-[10px] font-mono outline-none focus:border-[#FF8C00]" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Facebook Signal</label>
                      <input value={settings.facebookUrl} onChange={e => updateSetting('facebookUrl', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-4 text-white text-[10px] font-mono outline-none focus:border-[#FF8C00]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Site Config */}
          {activeTab === 'settings' && (
            <div className="glass p-12 rounded-[48px] border border-white/10 space-y-12 animate-in fade-in duration-500 shadow-2xl">
              <header className="flex items-center gap-4">
                <div className="p-3 orange-gradient text-black rounded-2xl"><Settings size={24}/></div>
                <h3 className="text-white font-black uppercase text-2xl tracking-tighter">Site Core Identity</h3>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Universal Logo Asset</label>
                    <div className="flex items-center space-x-6">
                      <div className="w-28 h-28 glass rounded-[32px] overflow-hidden flex items-center justify-center bg-zinc-950 border border-white/5 shadow-inner">
                        {settings.logoUrl ? <img src={resolveImageUrl(settings.logoUrl)} className="w-full h-full object-contain p-4" /> : <ImageIcon size={32} className="text-zinc-700" />}
                      </div>
                      <div>
                        <input type="file" ref={logoInputRef} onChange={e => handleFileUpload(e, 'logo')} className="hidden" />
                        <button onClick={() => logoInputRef.current?.click()} className="orange-gradient text-black px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">Update Asset</button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Brand Name</label>
                    <input value={settings.siteName} onChange={e => updateSetting('siteName', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black uppercase tracking-tighter text-2xl outline-none focus:border-[#FF8C00]" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Terminal Phone / Signal</label>
                    <input value={settings.contactPhone} onChange={e => updateSetting('contactPhone', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Primary Terminal Email</label>
                    <input value={settings.contactEmail} onChange={e => updateSetting('contactEmail', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">HQ Coordinates</label>
                    <input value={settings.location} onChange={e => updateSetting('location', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-[#FF8C00]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: SEO Calibration */}
          {activeTab === 'seo' && (
            <div className="glass p-12 rounded-[48px] border border-white/10 max-w-3xl space-y-12 animate-in slide-in-from-bottom-6 duration-500 shadow-2xl">
              <header className="flex items-center gap-4">
                <div className="p-3 orange-gradient text-black rounded-2xl"><Globe size={24}/></div>
                <h3 className="text-white font-black uppercase text-2xl tracking-tighter">Search Index Calibration</h3>
              </header>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Global Page Title</label>
                  <input value={settings.metaTitle} onChange={e => updateSetting('metaTitle', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black uppercase tracking-tighter text-xl outline-none focus:border-[#FF8C00]" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Global Meta Description</label>
                  <textarea rows={6} value={settings.metaDescription} onChange={e => updateSetting('metaDescription', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-sm font-medium outline-none focus:border-[#FF8C00]" />
                </div>
              </div>
              <div className="p-6 glass border border-blue-500/20 bg-blue-500/[0.02] rounded-[32px]">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                  <Info size={14} className="mr-3" /> Search Engine Optimization Tip
                </p>
                <p className="text-zinc-500 text-[11px] mt-4 leading-relaxed font-medium italic">
                  Keep titles under 60 characters and descriptions under 160 characters for peak performance in global search indexes.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
