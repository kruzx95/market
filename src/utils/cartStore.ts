import { atom, computed } from 'nanostores';
import type { CartItem } from '../types';
import storeConfig from '../data/storeConfig.json';

// Initialize from localStorage if browser
function getInitialCart(): CartItem[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('kala_fashion_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }
  return [];
}

function getInitialVoucher() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('kala_fashion_voucher');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load voucher', e);
    }
  }
  return null;
}

export const $cartItems = atom<CartItem[]>(getInitialCart());
export const $isCartOpen = atom<boolean>(false);
export const $appliedVoucher = atom<{
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  value: number;
  minSpend: number;
  description: string;
} | null>(getInitialVoucher());

// Save to localStorage on changes
if (typeof window !== 'undefined') {
  $cartItems.subscribe((items) => {
    try {
      localStorage.setItem('kala_fashion_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  });

  $appliedVoucher.subscribe((voucher) => {
    try {
      if (voucher) {
        localStorage.setItem('kala_fashion_voucher', JSON.stringify(voucher));
      } else {
        localStorage.removeItem('kala_fashion_voucher');
      }
    } catch (e) {
      console.error('Failed to save voucher', e);
    }
  });
}

// Computed total items in cart
export const $totalCartCount = computed($cartItems, (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
});

// Computed subtotal
export const $cartSubtotal = computed($cartItems, (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Computed total weight in grams
export const $cartTotalWeight = computed($cartItems, (items) => {
  return items.reduce((total, item) => total + item.weightGrams * item.quantity, 0);
});

// Computed discount amount
export const $cartDiscount = computed([$cartSubtotal, $appliedVoucher], (subtotal, voucher) => {
  if (!voucher) return 0;
  if (subtotal < voucher.minSpend) return 0;

  if (voucher.discountType === 'PERCENT') {
    return Math.round((subtotal * voucher.value) / 100);
  } else {
    return Math.min(voucher.value, subtotal);
  }
});

// Computed total after discount
export const $cartFinalAmount = computed([$cartSubtotal, $cartDiscount], (subtotal, discount) => {
  return Math.max(0, subtotal - discount);
});

// Helper actions
export function addToCart(item: CartItem) {
  const current = $cartItems.get();
  const existingIndex = current.findIndex(
    (i) => i.productId === item.productId && i.variantId === item.variantId
  );

  if (existingIndex > -1) {
    const updated = [...current];
    const newQty = updated[existingIndex].quantity + item.quantity;
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: Math.min(newQty, updated[existingIndex].stock),
    };
    $cartItems.set(updated);
  } else {
    $cartItems.set([...current, item]);
  }
  $isCartOpen.set(true);
}

export function updateCartQuantity(variantId: string, quantity: number) {
  const current = $cartItems.get();
  if (quantity <= 0) {
    removeFromCart(variantId);
    return;
  }
  const updated = current.map((item) => {
    if (item.variantId === variantId) {
      return { ...item, quantity: Math.min(quantity, item.stock) };
    }
    return item;
  });
  $cartItems.set(updated);
}

export function removeFromCart(variantId: string) {
  const current = $cartItems.get();
  $cartItems.set(current.filter((item) => item.variantId !== variantId));
}

export function clearCart() {
  $cartItems.set([]);
  $appliedVoucher.set(null);
}

export function toggleCartDrawer(isOpen?: boolean) {
  if (typeof isOpen === 'boolean') {
    $isCartOpen.set(isOpen);
  } else {
    $isCartOpen.set(!$isCartOpen.get());
  }
}

export function applyCoupon(code: string): { success: boolean; message: string } {
  const normalized = code.trim().toUpperCase();
  const found = storeConfig.activeVouchers.find((v) => v.code === normalized);
  const subtotal = $cartSubtotal.get();

  if (!found) {
    return { success: false, message: 'Kode kupon tidak valid atau sudah kedaluwarsa.' };
  }

  if (subtotal < found.minSpend) {
    return {
      success: false,
      message: `Minimal belanja untuk kode ini adalah ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(found.minSpend)}`,
    };
  }

  $appliedVoucher.set(found as any);
  return { success: true, message: `Kupon ${found.code} berhasil digunakan!` };
}

export function removeCoupon() {
  $appliedVoucher.set(null);
}
