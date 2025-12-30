
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, SiteSettings, QuoteInquiry, CartItem, DesignAsset } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_ORDERS } from '../constants';

interface CMSContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  designAssets: DesignAsset[];
  setDesignAssets: React.Dispatch<React.SetStateAction<DesignAsset[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  inquiries: QuoteInquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<QuoteInquiry[]>>;
  cart: CartItem[];
  addToCart: (productId: string, qty: number, designUrl?: string, size?: string, designScale?: number, designX?: number, designY?: number) => void;
  updateCartQty: (productId: string, qty: number, designUrl?: string) => void;
  removeFromCart: (productId: string, designUrl?: string) => void;
  clearCart: () => void;
  submitOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => void;
  resetStorage: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

// STABLE KEYS - CRITICAL: DO NOT CHANGE THESE TO PRESERVE USER DATA ACROSS UPDATES
const STORAGE_KEYS = {
  PRODUCTS: 'teetot_products_v2',
  DESIGNS: 'teetot_designs_v2',
  ORDERS: 'teetot_orders_v2',
  SETTINGS: 'teetot_settings_v2',
  CART: 'teetot_cart_v2'
};

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [designAssets, setDesignAssets] = useState<DesignAsset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DESIGNS);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });
  
  const [inquiries, setInquiries] = useState<QuoteInquiry[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(designAssets));
  }, [designAssets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const resetStorage = () => {
    if (confirm("Reset all site data to default? This will delete all custom products, designs, and orders.")) {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      window.location.reload();
    }
  };

  const addToCart = (productId: string, qty: number, designUrl?: string, size?: string, designScale?: number, designX?: number, designY?: number) => {
    setCart(prev => {
      // Find item with same configuration
      const existing = prev.find(item => 
        item.productId === productId && 
        item.designUrl === designUrl && 
        item.size === size
      );
      if (existing) {
        return prev.map(item => 
          (item.productId === productId && item.designUrl === designUrl && item.size === size) 
          ? { ...item, quantity: item.quantity + qty, designScale, designX, designY } 
          : item
        );
      }
      return [...prev, { productId, quantity: qty, designUrl, size, designScale, designX, designY }];
    });
  };

  const updateCartQty = (productId: string, qty: number, designUrl?: string) => {
    setCart(prev => prev.map(item => 
      (item.productId === productId && item.designUrl === designUrl) 
      ? { ...item, quantity: Math.max(1, qty) } 
      : item
    ));
  };

  const removeFromCart = (productId: string, designUrl?: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.designUrl === designUrl)));
  };

  const clearCart = () => setCart([]);

  const submitOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      paymentStatus: 'Awaiting Verification'
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  return (
    <CMSContext.Provider value={{ 
      products, setProducts, 
      designAssets, setDesignAssets,
      orders, setOrders, 
      settings, setSettings,
      inquiries, setInquiries,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, submitOrder, resetStorage
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within CMSProvider');
  return context;
};
