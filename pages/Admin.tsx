
import React, { useState, useRef } from 'react';
import { 
  Package, ShoppingCart, Settings, Plus, Trash2, Edit, Save, 
  Globe, Lock, X, Layout, Image as ImageIcon, 
  Upload, RotateCcw, Star, Eye, CheckCircle2, AlertTriangle, ChevronRight,
  PlusCircle, Mail, Phone, MapPin, ExternalLink
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
      alert('Failed to process image.');
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

  const deleteOrder = (orderId: string) => {
    if (confirm("Permanently remove this order manifest?")) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setViewingOrder(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="glass p-10 rounded-[40px] border border-white/10 w-full max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 orange-gradient rounded-3xl flex items-center justify-center text-black mx-auto mb-8 shadow-xl shadow-orange-500/20">
            <Lock size={32} />
          </div>
          <h2 className="font-heading font-black text-3xl text-white mb-6 uppercase tracking-tighter">Terminal Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="System Password"
              className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-[#FF8C00] text-center tracking-widest"
            />
            {loginError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Unauthorized Access Attempt.</p>}
            <button type="submit" className="w-full orange-gradient text-black font-black uppercase py-5 rounded-2xl tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform">
              Unlock Core
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar */}
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
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setEditingProduct(null);
              setEditingDesign(null);
              setViewingOrder(null);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'orange-gradient text-black shadow-lg shadow-orange-500/10' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
        <div className="pt-10 border-t border-white/5 mt-10">
          <button onClick={resetStorage} className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-500 transition-all">
            <RotateCcw size={14} />
            <span>Factory Reset</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="font-heading font-black text-4xl uppercase tracking-tighter text-white">
              {activeTab.toUpperCase()} <span className="text-[#FF8C00]">Control</span>
            </h1>
            
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
                className="orange-gradient text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center shadow-lg shadow-orange-500/20"
              >
                <Plus size={16} className="mr-2" /> Add New
              </button>
            )}
          </div>

          {/* Orders Hub Detail Modal */}
          {viewingOrder && (
            <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="glass w-full max-w-5xl max-h-[90vh] rounded-[40px] border border-white/10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <div>
                    <h2 className="font-black text-3xl uppercase tracking-tighter text-white">Order <span className="text-[#FF8C00]">{viewingOrder.id}</span></h2>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Manifested on {new Date(viewingOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => setViewingOrder(null)} className="p-3 glass rounded-full hover:bg-white/10 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-xs">Unit Breakdown</h3>
                    <div className="space-y-4">
                      {viewingOrder.items.map((item, idx) => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                          <div key={idx} className="glass p-6 rounded-3xl border border-white/5 flex gap-8">
                            <div className="w-32 h-32 glass rounded-2xl overflow-hidden shrink-0 border border-white/10 relative bg-zinc-900 shadow-xl">
                              {product && <img src={resolveImageUrl(product.image)} className="w-full h-full object-cover opacity-60" />}
                              {item.designUrl && (
                                <div className="absolute inset-0 flex items-center justify-center p-2">
                                  <img 
                                    src={item.designUrl} 
                                    style={{ 
                                      transform: `scale(${(item.designScale || 100) / 100}) translate(${item.designX || 0}px, ${item.designY || 0}px)`,
                                      filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))'
                                    }}
                                    className="max-w-full max-h-full object-contain" 
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow py-2">
                              <h4 className="text-white font-black uppercase text-lg leading-none mb-2">{product?.name || 'Unknown Product'}</h4>
                              <div className="flex gap-4 mb-4">
                                {item.size && <span className="text-[10px] font-black uppercase px-2 py-1 glass rounded text-[#FF8C00]">Size: {item.size}</span>}
                                <span className="text-[10px] font-black uppercase px-2 py-1 glass rounded text-blue-400">Qty: {item.quantity}</span>
                              </div>
                              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                Placement: Scale {item.designScale}% | Offset X: {item.designX} Y: {item.designY}
                              </p>
                              {item.designUrl && (
                                <a href={item.designUrl} target="_blank" className="inline-flex items-center text-[9px] font-black text-white hover:text-[#FF8C00] uppercase tracking-widest mt-4">
                                  <ExternalLink size={12} className="mr-1" /> Original Artwork
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                      <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-xs">Customer Intel</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-zinc-500"><PlusCircle size={18} /></div>
                          <div>
                            <p className="text-white font-black text-xs uppercase">{viewingOrder.customerName}</p>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase">Name</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-zinc-500"><Phone size={18} /></div>
                          <div>
                            <p className="text-white font-black text-xs uppercase">{viewingOrder.customerPhone}</p>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase">Phone</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-zinc-500"><MapPin size={18} /></div>
                          <div>
                            <p className="text-white font-black text-xs uppercase leading-tight">{viewingOrder.customerAddress}</p>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase">Location</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                      <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-xs">Status Console</h3>
                      <div className="space-y-3">
                        {['Pending', 'Printing', 'Shipped', 'Delivered'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => updateOrderStatus(viewingOrder.id, s as any)}
                            className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${viewingOrder.status === s ? 'orange-gradient text-black border-[#FF8C00]' : 'glass border-white/5 text-zinc-500 hover:bg-white/5'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <button onClick={() => deleteOrder(viewingOrder.id)} className="w-full py-3 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-colors flex items-center justify-center">
                          <Trash2 size={14} className="mr-2" /> Scrap Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="glass p-10 rounded-[40px] border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-xs">Global Branding</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Site Logo (Header/Footer)</label>
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 glass rounded-[20px] overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900 shadow-inner">
                          {settings.logoUrl ? <img src={settings.logoUrl} className="w-full h-full object-contain p-2" /> : <ImageIcon size={24} className="text-zinc-700" />}
                        </div>
                        <div>
                          <input type="file" ref={logoInputRef} onChange={e => handleFileUpload(e, 'logo')} className="hidden" accept="image/*" />
                          <button onClick={() => logoInputRef.current?.click()} className="px-6 py-3 orange-gradient text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                            {isOptimizing ? 'Uploading...' : 'Update Logo'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Site Display Name</label>
                      <input value={settings.siteName} onChange={e => updateSetting('siteName', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#FF8C00]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-xs">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">WhatsApp / Phone</label>
                      <input value={settings.contactPhone} onChange={e => updateSetting('contactPhone', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#FF8C00]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Support Email</label>
                      <input value={settings.contactEmail} onChange={e => updateSetting('contactEmail', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#FF8C00]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Physical Address</label>
                      <input value={settings.location} onChange={e => updateSetting('location', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#FF8C00]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="glass p-10 rounded-[40px] border border-white/10 max-w-2xl space-y-8 animate-in slide-in-from-bottom-4">
              <div className="flex items-center space-x-3 text-[#FF8C00] mb-4">
                 <Globe size={24} />
                 <h3 className="font-black uppercase tracking-[0.2em] text-sm">SEO Calibration</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Meta Title</label>
                  <input value={settings.metaTitle} onChange={e => updateSetting('metaTitle', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#FF8C00]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Meta Description</label>
                  <textarea rows={5} value={settings.metaDescription} onChange={e => updateSetting('metaDescription', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium outline-none focus:border-[#FF8C00]" />
                </div>
              </div>
            </div>
          )}

          {/* CMS Tab */}
          {activeTab === 'cms' && (
            <div className="glass p-10 rounded-[40px] border border-white/10 space-y-12 animate-in fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-8">
                     <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-xs">Hero Section Editor</h3>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Main Headline</label>
                           <input value={settings.heroHeadline} onChange={e => updateSetting('heroHeadline', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-xl outline-none focus:border-[#FF8C00] uppercase tracking-tighter" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sub-Headline Text</label>
                           <textarea rows={4} value={settings.heroSubheadline} onChange={e => updateSetting('heroSubheadline', e.target.value)} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium outline-none focus:border-[#FF8C00]" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <h3 className="text-[#FF8C00] font-black uppercase tracking-widest text-xs">Homepage Visibility</h3>
                     <div className="space-y-4">
                        {[
                          { key: 'showFeatures', label: 'Display Workflow (How it Works)' },
                          { key: 'showFAQ', label: 'Display Intel Hub (FAQ)' },
                          { key: 'showTestimonials', label: 'Display Testimonial Slider' }
                        ].map(comp => (
                          <div key={comp.key} className="flex items-center justify-between glass p-5 rounded-2xl border border-white/5">
                             <span className="text-white text-[11px] font-black uppercase tracking-widest">{comp.label}</span>
                             <button 
                               onClick={() => updateSetting(comp.key as any, !settings[comp.key as keyof SiteSettings])}
                               className={`w-14 h-7 rounded-full transition-all relative ${settings[comp.key as keyof SiteSettings] ? 'bg-[#FF8C00]' : 'bg-zinc-800'}`}
                             >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all ${settings[comp.key as keyof SiteSettings] ? 'left-8' : 'left-1'}`}></div>
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}
          
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="animate-in fade-in">
              {editingProduct ? (
                <div className="glass p-8 rounded-[40px] border border-[#FF8C00]/20 max-w-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-heading font-black text-2xl uppercase tracking-tighter text-white">
                      {isAddingNew ? 'Deploy New SKU' : 'Modify Asset'}
                    </h3>
                    <button onClick={() => setEditingProduct(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <form onSubmit={saveProduct} className="space-y-6">
                    <div className="flex justify-center mb-8">
                      <div className="relative group cursor-pointer" onClick={() => itemImageInputRef.current?.click()}>
                        <div className="w-40 h-40 glass rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900">
                          {editingProduct.image ? <img src={resolveImageUrl(editingProduct.image)} className="w-full h-full object-cover" /> : <PlusCircle size={40} className="text-zinc-700" />}
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                          <Upload size={24} className="text-white" />
                        </div>
                        <input type="file" ref={itemImageInputRef} onChange={e => handleFileUpload(e, 'product')} className="hidden" accept="image/*" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Name</label>
                        <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Unit Category</label>
                        <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white">
                          <option className="bg-zinc-900" value="Apparel">Apparel</option>
                          <option className="bg-zinc-900" value="Accessories">Accessories</option>
                          <option className="bg-zinc-900" value="Business">Business</option>
                          <option className="bg-zinc-900" value="Gifts">Gifts</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Unit Price (GHS)</label>
                        <input required type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Stockpile Level</label>
                        <input required type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Description</label>
                      <textarea rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                    </div>
                    <button type="submit" className="w-full orange-gradient text-black py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20">
                      Commit Manifest
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="glass p-6 rounded-[32px] border border-white/5 group relative overflow-hidden">
                      <div className="aspect-square bg-zinc-900 rounded-2xl mb-4 overflow-hidden">
                        <img src={resolveImageUrl(p.image)} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-black uppercase text-sm tracking-tight">{p.name}</h3>
                        <span className="text-[#FF8C00] font-black text-xs">GHS {p.price.toFixed(2)}</span>
                      </div>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mb-4">{p.category}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingProduct(p); setIsAddingNew(false); }} className="flex-grow glass border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-colors flex items-center justify-center">
                          <Edit size={12} className="mr-2" /> Modify
                        </button>
                        <button onClick={() => setProducts(prev => prev.filter(i => i.id !== p.id))} className="px-4 glass border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Designs Tab */}
          {activeTab === 'designs' && (
            <div className="animate-in fade-in">
              {editingDesign ? (
                <div className="glass p-8 rounded-[40px] border border-[#FF8C00]/20 max-w-2xl">
                   <div className="flex justify-between items-center mb-8">
                    <h3 className="font-heading font-black text-2xl uppercase tracking-tighter text-white">
                      {isAddingNew ? 'Deploy New Asset' : 'Edit Asset'}
                    </h3>
                    <button onClick={() => setEditingDesign(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <form onSubmit={saveDesign} className="space-y-6">
                    <div className="flex justify-center mb-8">
                      <div className="relative group cursor-pointer" onClick={() => itemImageInputRef.current?.click()}>
                        <div className="w-40 h-40 glass rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900">
                          {editingDesign.thumbnail ? <img src={resolveImageUrl(editingDesign.thumbnail)} className="w-full h-full object-contain p-4" /> : <ImageIcon size={40} className="text-zinc-700" />}
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                          <Upload size={24} className="text-white" />
                        </div>
                        <input type="file" ref={itemImageInputRef} onChange={e => handleFileUpload(e, 'design')} className="hidden" accept="image/*" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Title</label>
                        <input required value={editingDesign.title} onChange={e => setEditingDesign({...editingDesign, title: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Type</label>
                        <select value={editingDesign.category} onChange={e => setEditingDesign({...editingDesign, category: e.target.value as DesignCategory})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white">
                          <option className="bg-zinc-900" value="T-Shirt">T-Shirt</option>
                          <option className="bg-zinc-900" value="Caps">Caps</option>
                          <option className="bg-zinc-900" value="Tote Bags">Tote Bags</option>
                          <option className="bg-zinc-900" value="Pillow Cases">Pillow Cases</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Cost (GHS)</label>
                      <input required type="number" step="0.01" value={editingDesign.price} onChange={e => setEditingDesign({...editingDesign, price: parseFloat(e.target.value)})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Intel</label>
                      <textarea rows={3} value={editingDesign.description} onChange={e => setEditingDesign({...editingDesign, description: e.target.value})} className="w-full glass bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                    </div>
                    <button type="submit" className="w-full orange-gradient text-black py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20">
                      Finalize Deployment
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {designAssets.map(d => (
                    <div key={d.id} className="glass p-6 rounded-[32px] border border-white/5 group relative">
                      <div className="aspect-square bg-zinc-900 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                        <img src={resolveImageUrl(d.thumbnail)} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <h3 className="text-white font-black uppercase text-sm mb-1">{d.title}</h3>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[#FF8C00] font-black text-xs">GHS {d.price.toFixed(2)}</span>
                        <span className="text-zinc-600 text-[9px] font-bold uppercase">{d.category}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingDesign(d); setIsAddingNew(false); }} className="flex-grow glass border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-colors flex items-center justify-center">
                          <Edit size={12} className="mr-2" /> Edit
                        </button>
                        <button onClick={() => setDesignAssets(prev => prev.filter(i => i.id !== d.id))} className="px-4 glass border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
             <div className="glass rounded-[40px] border border-white/5 overflow-hidden animate-in fade-in">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Manifest</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Customer</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Total</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setViewingOrder(order)}>
                            <td className="p-6"><span className="text-[#FF8C00] font-mono font-black text-xs">{order.id}</span></td>
                            <td className="p-6">
                               <p className="text-white font-black text-xs uppercase">{order.customerName}</p>
                               <p className="text-zinc-600 text-[9px] font-bold uppercase">{order.customerPhone}</p>
                            </td>
                            <td className="p-6">
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                 order.status === 'Printing' ? 'bg-[#FF8C00]/20 text-[#FF8C00]' : 
                                 order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-zinc-400'
                               }`}>
                                 {order.status}
                               </span>
                            </td>
                            <td className="p-6 text-white font-black text-xs">GHS {order.totalAmount.toFixed(2)}</td>
                            <td className="p-6 text-right">
                              <button className="p-2 glass rounded-lg text-[#FF8C00] hover:bg-[#FF8C00] hover:text-black transition-all">
                                <Eye size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};
