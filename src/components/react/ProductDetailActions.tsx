import React, { useState, useMemo } from 'react';
import type { Product, ProductVariant } from '../../types';
import { addToCart } from '../../utils/cartStore';
import { formatRupiah } from '../../utils/currency';
import { generateProductInquiryWhatsAppUrl } from '../../utils/whatsapp';
import {
  ShoppingBag,
  Zap,
  Ruler,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
  X,
  AlertCircle,
} from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductDetailActions({ product }: Props) {
  const [selectedColor, setSelectedColor] = useState<string>(product.variants[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState<string>(product.variants[0]?.size || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [showAddedToast, setShowAddedToast] = useState<boolean>(false);

  // Available unique colors and sizes
  const uniqueColors = useMemo(() => {
    const map = new Map<string, string>();
    product.variants.forEach((v) => map.set(v.color, v.colorHex));
    return Array.from(map.entries()).map(([color, colorHex]) => ({ color, colorHex }));
  }, [product]);

  const uniqueSizes = useMemo(() => {
    const set = new Set<string>();
    product.variants.forEach((v) => set.add(v.size));
    return Array.from(set);
  }, [product]);

  // Find currently selected variant object
  const activeVariant: ProductVariant | undefined = useMemo(() => {
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    ) || product.variants.find((v) => v.color === selectedColor) || product.variants[0];
  }, [product, selectedColor, selectedSize]);

  // Check if current variant is available & stock
  const currentStock = activeVariant ? activeVariant.stock : 0;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = (directToCheckout = false) => {
    if (!activeVariant || isOutOfStock) return;

    addToCart({
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      color: activeVariant.color,
      size: activeVariant.size,
      price: product.price + (activeVariant.priceDelta || 0),
      image: product.images[0],
      quantity: quantity,
      weightGrams: product.weightGrams,
      stock: activeVariant.stock,
    });

    if (directToCheckout) {
      window.location.href = '/checkout';
    } else {
      setShowAddedToast(true);
      setTimeout(() => setShowAddedToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showAddedToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-float flex items-center gap-3 animate-fade-in border border-slate-800">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold">Berhasil Ditambahkan!</p>
            <p className="text-slate-300">
              {product.name} ({activeVariant?.color} - {activeVariant?.size})
            </p>
          </div>
        </div>
      )}

      {/* 1. Color Selector */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Warna: <span className="font-semibold text-slate-600 normal-case">{selectedColor}</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {uniqueColors.map(({ color, colorHex }) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm ring-2 ring-slate-900 ring-offset-2'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                  style={{ backgroundColor: colorHex }}
                />
                <span>{color}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Size Selector + Size Guide Modal Trigger */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Ukuran: <span className="font-semibold text-slate-600 normal-case">{selectedSize}</span>
          </label>
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 underline underline-offset-4"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Panduan Ukuran</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {uniqueSizes.map((size) => {
            const isSelected = selectedSize === size;
            const variantForSize = product.variants.find(
              (v) => v.color === selectedColor && v.size === size
            );
            const stockForSize = variantForSize ? variantForSize.stock : 0;
            const isSizeAvailable = stockForSize > 0;

            return (
              <button
                key={size}
                type="button"
                disabled={!isSizeAvailable}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[48px] h-11 px-3.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm ring-2 ring-slate-900 ring-offset-2'
                    : isSizeAvailable
                    ? 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                    : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                }`}
              >
                <span>{size}</span>
                {stockForSize <= 5 && stockForSize > 0 && (
                  <span className="text-[9px] font-normal text-amber-500">Sisa {stockForSize}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Stock Status Banner */}
      <div className="flex items-center gap-2 text-xs">
        {isOutOfStock ? (
          <span className="flex items-center gap-1.5 font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
            <AlertCircle className="w-4 h-4" /> Stok Habis untuk varian ini
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Stok Tersedia ({currentStock} pcs)
          </span>
        )}
      </div>

      {/* 4. Action Buttons (Desktop & Tablet) */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          {/* Quantity Counter */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
            <button
              type="button"
              disabled={quantity <= 1 || isOutOfStock}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30"
            >
              -
            </button>
            <span className="w-10 text-center font-bold text-sm text-slate-900">{quantity}</span>
            <button
              type="button"
              disabled={quantity >= currentStock || isOutOfStock}
              onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-30"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => handleAddToCart(false)}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tambah ke Keranjang</span>
          </button>
        </div>

        {/* Buy Now (Direct Checkout) */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => handleAddToCart(true)}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-card hover:shadow-float disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Beli Sekarang (Langsung Checkout)</span>
        </button>

        {/* WhatsApp Product Inquiry Fallback */}
        <a
          href={generateProductInquiryWhatsAppUrl(
            product.name,
            `${selectedColor} - ${selectedSize}`,
            typeof window !== 'undefined' ? window.location.href : undefined
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Tanya / Order Produk Ini via WhatsApp</span>
        </a>
      </div>

      {/* 5. Sticky Mobile Bottom Bar (Conversion Booster) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-float flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[10px] text-slate-400 font-medium">Harga Total</div>
          <div className="text-sm font-bold text-slate-900">
            {formatRupiah((product.price + (activeVariant?.priceDelta || 0)) * quantity)}
          </div>
        </div>
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => handleAddToCart(false)}
          className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center"
          title="Tambah ke Keranjang"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => handleAddToCart(true)}
          className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Beli Sekarang</span>
        </button>
      </div>

      {/* 6. Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-slate-900" />
                <h3 className="font-bold text-base text-slate-900">Panduan Ukuran (Size Chart)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Ukuran dalam satuan centimeter (cm). Toleransi selisih ukuran ± 1-2 cm wajar karena proses penjahitan garment.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Size</th>
                    <th className="px-4 py-2.5">Lebar Dada</th>
                    <th className="px-4 py-2.5">Panjang Badan</th>
                    {product.sizeChart.some((s) => s.sleeve) && (
                      <th className="px-4 py-2.5">Panjang Lengan</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.sizeChart.map((row) => (
                    <tr key={row.size} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-bold text-slate-900">{row.size}</td>
                      <td className="px-4 py-2.5 text-slate-600">{row.chest} cm</td>
                      <td className="px-4 py-2.5 text-slate-600">{row.length} cm</td>
                      {row.sleeve !== undefined && (
                        <td className="px-4 py-2.5 text-slate-600">{row.sleeve} cm</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">💡 Tips Memilih Ukuran:</p>
              <p>• Jika ingin fit santai / regular, pilih ukuran yang biasa Anda kenakan.</p>
              <p>• Jika ingin kesan <em>Oversized Look</em>, naikkan 1 tingkat ukuran di atasnya.</p>
            </div>

            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
