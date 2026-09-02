export interface ProductVariant {
  id: string;
  name: string; // e.g. "Hitam - M"
  color: string;
  colorHex: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'All Size';
  stock: number;
  priceDelta?: number; // extra price if any
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: 'Kemeja' | 'Kaos' | 'Outerwear' | 'Celana' | 'Aksesoris' | 'Wanita';
  images: string[];
  variants: ProductVariant[];
  rating: number;
  soldCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  weightGrams: number;
  material: string;
  careInstructions: string[];
  sizeChart: {
    size: string;
    chest: number; // Lebar dada (cm)
    length: number; // Panjang badan (cm)
    sleeve?: number; // Panjang lengan (cm)
  }[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  weightGrams: number;
  stock: number;
}

export interface CourierService {
  courierCode: 'jne' | 'jnt' | 'sicepat' | 'anteraja' | 'gosend';
  courierName: string;
  serviceCode: string;
  serviceName: string;
  etd: string; // "1-2 Hari"
  cost: number;
  badge?: string; // "Paling Populer", "Instan"
  logo: string;
}

export interface PaymentMethodOption {
  id: 'qris' | 'bca_va' | 'mandiri_va' | 'bri_va' | 'bni_va' | 'cod' | 'manual_transfer';
  category: 'qris' | 'va' | 'cod' | 'bank';
  name: string;
  provider: string;
  icon: string;
  instructions: string[];
  fee: number;
  isPopular?: boolean;
  qrPayload?: string;
  vaNumber?: string;
}

export interface OrderCustomer {
  fullName: string;
  whatsapp: string;
  email?: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. "ORD-20260828-001"
  createdAt: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  paymentFee: number;
  uniqueCode: number; // 3-digit kode unik jika transfer
  totalAmount: number;
  courier: CourierService;
  paymentMethod: PaymentMethodOption;
  paymentStatus: 'UNPAID' | 'PAID' | 'EXPIRED';
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  trackingNumber?: string; // No Resi
  qrisExpiryTime?: string;
  voucherCode?: string;
}

export interface StoreConfig {
  storeName: string;
  storeTagline: string;
  whatsappNumber: string;
  whatsappAdminName: string;
  instagramHandle: string;
  operationalHours: string;
  address: string;
  originCity: string;
  currency: string;
  freeShippingMinAmount: number;
  activeVouchers: {
    code: string;
    discountType: 'PERCENT' | 'FIXED';
    value: number;
    minSpend: number;
    description: string;
  }[];
}
