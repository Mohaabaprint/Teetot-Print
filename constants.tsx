
import React from 'react';
import { Product, SiteSettings, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    description: 'High-quality 100% cotton tee with durable screen print finish.',
    price: 25.00,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    stock: 150,
    featured: true
  },
  {
    id: '2',
    name: 'Urban Streetwear Hoodie',
    description: 'Heavyweight fleece hoodie perfect for custom embroidery or DTG.',
    price: 45.00,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    stock: 80,
    featured: true
  },
  {
    id: '3',
    name: 'Custom Ceramic Mug',
    description: '11oz ceramic mug with vibrant sublimation printing.',
    price: 12.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800',
    stock: 200,
    featured: true
  },
  {
    id: '4',
    name: 'Branded Baseball Cap',
    description: 'Premium structured cap for high-impact corporate branding.',
    price: 18.00,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    stock: 100
  },
  {
    id: '5',
    name: 'Professional Business Cards',
    description: 'Premium 450gsm cards with velvet touch finish.',
    price: 35.00,
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=800',
    stock: 500
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'TeetotPrint',
  heroHeadline: 'Your Vision, Professionally Printed.',
  heroSubheadline: 'Premium custom apparel and merchandise delivered to your door. From single pieces to bulk corporate orders.',
  contactPhone: '0244907853',
  contactEmail: 'teetotptint@gmail.com',
  location: 'Off Teshie Century Road, Accra, Ghana',
  gradientIntensity: 80,
  showTestimonials: true,
  showFAQ: true,
  showFeatures: true,
  metaTitle: 'TeetotPrint | Print That Speaks - Premium POD & Custom Printing',
  metaDescription: 'Expert custom printing hub in Teshie. Premium T-shirts, Hoodies, and Mugs with the official "Print That Speaks" quality guarantee.'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7721',
    customerName: 'Kofi Mensah',
    customerEmail: 'kofi@example.com',
    customerPhone: '0244001122',
    customerAddress: '123 Osu St, Accra, Ghana',
    paymentStatus: 'Verified',
    items: [{ productId: '1', quantity: 2 }],
    totalAmount: 50.00,
    status: 'Printing',
    createdAt: '2024-05-20T10:30:00Z'
  },
  {
    id: 'ORD-8812',
    customerName: 'Ama Serwaa',
    customerEmail: 'ama.s@corp.com',
    customerPhone: '0205556677',
    customerAddress: 'Plot 45, Kumasi, Ghana',
    paymentStatus: 'Awaiting Verification',
    items: [{ productId: '5', quantity: 1 }],
    totalAmount: 35.00,
    status: 'Pending',
    createdAt: '2024-05-21T14:45:00Z'
  }
];
