
import { Product, SiteSettings, Order } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Cotton T-Shirt', description: 'High-quality 100% cotton tee.', price: 25.00, category: 'Apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', stock: 150, featured: true },
  { id: '2', name: 'Urban Streetwear Hoodie', description: 'Heavyweight fleece hoodie.', price: 45.00, category: 'Apparel', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', stock: 80, featured: true },
  { id: '3', name: 'Custom Ceramic Mug', description: '11oz ceramic mug.', price: 12.00, category: 'Accessories', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', stock: 200, featured: true }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'TeetotPrint',
  heroHeadline: 'Your Vision, Professionally Printed.',
  heroSubheadline: 'Premium custom apparel and merchandise delivered to your door.',
  contactPhone: '0244907853',
  contactEmail: 'teetotptint@gmail.com',
  location: 'Off Teshie Century Road, Accra, Ghana',
  tiktokUrl: 'https://tiktok.com/@teetotprint',
  instagramUrl: '#',
  facebookUrl: '#',
  footerAboutText: 'Premium custom apparel and merchandise hub. Leveraging industry-leading print technology to make your vision speak.',
  showTestimonials: true,
  showFAQ: true,
  showFeatures: true,
  features: [
    { title: 'Elite Materials', desc: 'Sourced premium blanks from across the globe.' },
    { title: 'Rapid Transit', desc: 'Proprietary logistics network for fast delivery.' },
    { title: 'Infinite Scale', desc: 'From prototypes to 10,000 unit runs.' }
  ],
  process: [
    { step: '01', title: 'Curate', desc: 'Select from our catalog of apparel.' },
    { step: '02', title: 'Deploy', desc: 'Upload your vector assets.' },
    { step: '03', title: 'Manifest', desc: 'Industrial grade production.' }
  ],
  faqs: [
    { q: 'Accepted Asset Specs?', a: 'High-resolution vector formats or transparent PNGs.' },
    { q: 'Volume Thresholds?', a: 'Zero minimums for core drops.' },
    { q: 'Dispatch Timeline?', a: 'Standard cycles are 48-72 hours.' }
  ],
  metaTitle: 'TeetotPrint | Print That Speaks',
  metaDescription: 'Expert custom printing hub in Teshie.'
};

export const INITIAL_ORDERS: Order[] = [];
