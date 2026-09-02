import { atom } from 'nanostores';
import type { Order } from '../types';

const STORAGE_KEY = 'kala_fashion_orders';

// Initial sample orders so the admin panel has rich mock data immediately
const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ORD-20260828-001',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    customer: {
      fullName: 'Dimas Prasetyo',
      whatsapp: '081298765432',
      email: 'dimas.prasetyo@gmail.com',
      address: 'Jl. Kemang Raya No. 12B, RT 04/RW 02',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      district: 'Cilandak',
      postalCode: '12430',
      notes: 'Tolong jangan dilempar pagar ya kak',
    },
    items: [
      {
        productId: 'prod-001',
        variantId: 'var-001-olive-l',
        name: 'Kemeja Linen Oversized Casual',
        color: 'Olive Green',
        size: 'L',
        price: 239000,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        weightGrams: 280,
        stock: 11,
      },
      {
        productId: 'prod-003',
        variantId: 'var-003-white-l',
        name: 'Heavyweight Boxy Tee 24s',
        color: 'Off White',
        size: 'L',
        price: 129000,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        weightGrams: 220,
        stock: 30,
      },
    ],
    subtotal: 368000,
    shippingCost: 10000,
    discountAmount: 20000,
    paymentFee: 0,
    uniqueCode: 0,
    totalAmount: 358000,
    courier: {
      courierCode: 'sicepat',
      courierName: 'SiCepat Ekspres',
      serviceCode: 'SIUNTUNG',
      serviceName: 'SiCepat SIUNTUNG',
      etd: '1-2 Hari',
      cost: 10000,
      logo: '💨 SiCepat',
    },
    paymentMethod: {
      id: 'qris',
      category: 'qris',
      name: 'QRIS (ShopeePay, GoPay, OVO, BCA, Dana)',
      provider: 'QRIS Dinamis',
      icon: '📱',
      instructions: ['Buka aplikasi e-wallet / mobile banking', 'Scan QRIS yang tampil', 'Konfirmasi nama merchant KALA Studio'],
      fee: 0,
    },
    paymentStatus: 'PAID',
    orderStatus: 'PROCESSING',
    voucherCode: 'ONGKIRGRATIS',
  },
  {
    id: 'ORD-20260828-002',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customer: {
      fullName: 'Siti Rahmawati',
      whatsapp: '085712345678',
      email: 'siti.rahma@yahoo.com',
      address: 'Jl. Dago Asri No. 8',
      province: 'Jawa Barat',
      city: 'Bandung',
      district: 'Coblong',
      postalCode: '40132',
    },
    items: [
      {
        productId: 'prod-005',
        variantId: 'var-005-sage-m',
        name: 'Blouse Rayon Silk Drape Flowy',
        color: 'Sage Green',
        size: 'M',
        price: 219000,
        image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        weightGrams: 200,
        stock: 14,
      },
    ],
    subtotal: 219000,
    shippingCost: 11000,
    discountAmount: 0,
    paymentFee: 0,
    uniqueCode: 0,
    totalAmount: 230000,
    courier: {
      courierCode: 'jne',
      courierName: 'JNE Express',
      serviceCode: 'REG',
      serviceName: 'JNE Reguler',
      etd: '1-2 Hari',
      cost: 11000,
      logo: '📦 JNE',
    },
    paymentMethod: {
      id: 'bca_va',
      category: 'va',
      name: 'BCA Virtual Account',
      provider: 'BCA',
      icon: '🏦',
      instructions: ['Pilih Transfer > Virtual Account', 'Masukkan no VA 8801293847291', 'Bayar sesuai nominal'],
      fee: 0,
    },
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    trackingNumber: 'JNEREG9823174981',
  },
];

function getInitialOrders(): Order[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    }
  }
  return DEFAULT_ORDERS;
}

export const $orders = atom<Order[]>(getInitialOrders());

if (typeof window !== 'undefined') {
  $orders.subscribe((orders) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  });
}

export function saveNewOrder(order: Order) {
  const current = $orders.get();
  $orders.set([order, ...current]);
}

export function updateOrderStatus(
  orderId: string,
  newStatus: Order['orderStatus'],
  trackingNumber?: string
) {
  const current = $orders.get();
  const updated = current.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        orderStatus: newStatus,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
      };
    }
    return order;
  });
  $orders.set(updated);
}

export function updateOrderPaymentStatus(orderId: string, newPaymentStatus: Order['paymentStatus']) {
  const current = $orders.get();
  const updated = current.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        paymentStatus: newPaymentStatus,
        orderStatus: newPaymentStatus === 'PAID' && order.orderStatus === 'PENDING' ? 'PROCESSING' : order.orderStatus,
      };
    }
    return order;
  });
  $orders.set(updated);
}

export function getOrderById(orderId: string): Order | undefined {
  return $orders.get().find((o) => o.id === orderId);
}
