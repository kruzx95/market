import React, { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { $activeThemeId } from '../../utils/themeStore';
import { THEME_PRESETS } from '../../data/themes';
import type { Product } from '../../types';
import { formatRupiah, formatNumber } from '../../utils/currency';
import { Star, Sparkles, ArrowUpDown } from 'lucide-react';

interface Props {
  initialProducts: Product[];
}

export default function ProductGridWithFilter({ initialProducts }: Props) {
  const activeThemeId = useStore($activeThemeId);
  const activePreset = THEME_PRESETS[activeThemeId] || THEME_PRESETS.fashion;

  const currentProducts = activePreset.products || initialProducts;

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  // Dynamic categories based on current products
  const categories = useMemo(() => {
    const set = new Set<string>(['Semua']);
    currentProducts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [currentProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...currentProducts];

    if (selectedCategory !== 'Semua') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'popular') {
      list.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [currentProducts, selectedCategory, sortBy]);

  return (
    <div className="space-y-6">
      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        
        {/* Category Pills (Horizontal scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="popular">Paling Populer</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
          </select>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <p className="font-semibold text-slate-700">Tidak ada produk dalam kategori ini.</p>
          <p className="text-xs">Coba pilih kategori lain atau reset filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const firstImage = product.images[0];
            const secondImage = product.images[1] || product.images[0];
            const availableColors = Array.from(new Set(product.variants.map((v) => v.color)));
            const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
            const totalStock = product.variants.reduce((acc, curr) => acc + curr.stock, 0);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-card hover:border-slate-200 transition-all duration-300"
              >
                {/* Image Aspect 3:4 */}
                <a
                  href={`/products/${product.slug}`}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 block"
                >
                  <img
                    src={firstImage}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out"
                  />

                  {secondImage !== firstImage && (
                    <img
                      src={secondImage}
                      alt={`${product.name} alternate view`}
                      loading="lazy"
                      className="h-full w-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.discountPercentage && product.discountPercentage > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        -{product.discountPercentage}%
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-slate-900 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        Best Seller
                      </span>
                    )}
                    {product.isNewArrival && !product.isBestSeller && (
                      <span className="bg-indigo-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        New
                      </span>
                    )}
                  </div>

                  {totalStock <= 10 && totalStock > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold text-center py-0.5 rounded-md">
                      Sisa {totalStock} pcs!
                    </div>
                  )}
                </a>

                {/* Content */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className="font-medium uppercase tracking-wider text-[10px] text-slate-400">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-slate-700 font-semibold text-[11px]">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal">({formatNumber(product.soldCount)}+)</span>
                      </div>
                    </div>

                    <a href={`/products/${product.slug}`} className="block group-hover:text-slate-700 transition-colors">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 leading-snug">
                        {product.name}
                      </h3>
                    </a>

                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {product.tagline}
                    </p>

                    {/* Variant swatch dots */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <div className="flex items-center gap-1">
                        {product.variants.slice(0, 3).map((v) => (
                          <span
                            key={v.id}
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-slate-200"
                            style={{ backgroundColor: v.colorHex }}
                            title={v.color}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {availableSizes.slice(0, 3).join(', ')}
                        {availableSizes.length > 3 ? '...' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatRupiah(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {formatRupiah(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    <a
                      href={`/products/${product.slug}`}
                      className="text-[11px] font-bold text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-lg transition-all"
                    >
                      Beli
                    </a>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
