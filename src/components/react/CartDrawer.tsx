import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import {
  $cartItems,
  $isCartOpen,
  $cartSubtotal,
  $cartDiscount,
  $cartFinalAmount,
  $appliedVoucher,
  updateCartQuantity,
  removeFromCart,
  toggleCartDrawer,
  applyCoupon,
  removeCoupon,
} from '../../utils/cartStore';
import { formatRupiah } from '../../utils/currency';
import storeConfig from '../../data/storeConfig.json';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CartDrawer() {
  const isOpen = useStore($isCartOpen);
  const items = useStore($cartItems);
  const subtotal = useStore($cartSubtotal);
  const discount = useStore($cartDiscount);
  const finalAmount = useStore($cartFinalAmount);
  const appliedVoucher = useStore($appliedVoucher);

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Free shipping progress calculator
  const freeShippingThreshold = storeConfig.freeShippingMinAmount;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => toggleCartDrawer(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <h2 className="text-base font-bold text-slate-900">
                Keranjang Belanja ({items.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => toggleCartDrawer(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-slate-900 text-white px-4 py-3 text-xs">
            <div className="flex items-center justify-between font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-bold">Selamat! Anda Mendapatkan Subsidi Ongkir!</span>
                ) : (
                  <span>Tambah <strong className="text-amber-300">{formatRupiah(remainingForFreeShipping)}</strong> lagi untuk Gratis Ongkir</span>
                )}
              </span>
              <span className="text-[11px] text-slate-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Keranjang Anda masih kosong</p>
                <p className="text-xs max-w-xs text-slate-400">
                  Temukan koleksi pakaian esensial terbaik kami dan tambahkan ke keranjang.
                </p>
                <button
                  onClick={() => toggleCartDrawer(false)}
                  className="mt-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-white shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Hapus barang"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {item.color}
                        </span>
                        <span>•</span>
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          Size {item.size}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatRupiah(item.price * item.quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Summary & Voucher */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/70 space-y-4">
              
              {/* Voucher Form */}
              {appliedVoucher ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-lg text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Kupon <strong>{appliedVoucher.code}</strong> aktif (-{formatRupiah(discount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-rose-600 text-xs font-bold underline ml-2"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Punya voucher? Misal: FASHIONHEMAT"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                    >
                      Pakai
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-[11px] ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                </form>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Diskon Voucher</span>
                    <span>-{formatRupiah(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Ongkos Kirim</span>
                  <span className="italic">Dihitung di checkout</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimasi Total</span>
                  <span className="text-base text-slate-900">{formatRupiah(finalAmount)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2 pt-1">
                <a
                  href="/checkout"
                  onClick={() => toggleCartDrawer(false)}
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-card hover:shadow-float transition-all"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
