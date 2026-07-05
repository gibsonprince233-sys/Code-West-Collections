export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string; // Base64 data URL or external HTTP URL
  category: string;
  orderLink?: string; // Optional custom order link (redirect directly to this if provided)
  status: 'available' | 'out_of_stock';
  createdAt: number;
}

export interface StoreSettings {
  adminPasscode: string;
  whatsappNumber: string; // e.g., "1234567890"
  whatsappTemplate: string; // e.g., "Hello, I am interested in ordering {product_name} ({price})"
  instagramUrl?: string;
  tiktokUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number;
  status: 'unread' | 'read' | 'archived';
}

