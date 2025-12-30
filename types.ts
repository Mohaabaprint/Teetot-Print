
export type Category = 'Apparel' | 'Accessories' | 'Business' | 'Gifts';
export type DesignCategory = 'T-Shirt' | 'Caps' | 'Tote Bags' | 'Pillow Cases' | 'Mixed';

export interface FeatureItem { title: string; desc: string; }
export interface ProcessStep { step: string; title: string; desc: string; }
export interface FAQItem { q: string; a: string; }

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  featured?: boolean;
}

export interface DesignAsset {
  id: string;
  title: string;
  description: string;
  price: number;
  category: DesignCategory;
  thumbnail: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  transactionId?: string;
  paymentStatus: 'Awaiting Verification' | 'Verified' | 'Failed';
  items: { productId: string; quantity: number; designUrl?: string; designScale?: number; size?: string; designX?: number; designY?: number }[];
  totalAmount: number;
  status: 'Pending' | 'Printing' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  heroHeadline: string;
  heroSubheadline: string;
  contactPhone: string;
  contactEmail: string;
  location: string;
  tiktokUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  footerAboutText: string;
  showTestimonials: boolean;
  showFAQ: boolean;
  showFeatures: boolean;
  features: FeatureItem[];
  process: ProcessStep[];
  faqs: FAQItem[];
  metaTitle: string;
  metaDescription: string;
}

export interface QuoteInquiry {
  id: string;
  name: string;
  email: string;
  productType: string;
  quantity: number;
  description: string;
  fileUrl?: string;
  status: 'New' | 'Replied' | 'Closed';
}

export interface CartItem {
  productId: string;
  quantity: number;
  designUrl?: string;
  designScale?: number;
  designX?: number;
  designY?: number;
  size?: string;
}

export const resolveImageUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  const trimmedUrl = url.trim();
  if (trimmedUrl.includes('drive.google.com')) {
    const idMatch = trimmedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }
  return trimmedUrl;
};

export const optimizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1200;
        if (width > height) { if (width > MAX_DIM) { height *= MAX_DIM / width; width = MAX_DIM; } }
        else { if (height > MAX_DIM) { width *= MAX_DIM / height; height = MAX_DIM; } }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context not found');
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      };
    };
    reader.onerror = reject;
  });
};
