import React from 'react';
import { useStore } from '@nanostores/react';
import { $activeThemeId } from '../../utils/themeStore';
import { THEME_PRESETS } from '../../data/themes';
import CartCounter from './CartCounter';
import { Sparkles, LayoutDashboard } from 'lucide-react';

export default function DynamicHeader() {
  const activeThemeId = useStore($activeThemeId);
  const current = THEME_PRESETS[activeThemeId] || THEME_PRESETS.fashion;

  const handleHomeClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        className="text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 transition-colors duration-300 shadow-xs"
        style={{ backgroundColor: current.styles.primaryColor }}
      >
        <span className="inline-block animate-pulse">⚡</span>
        <span>
          GRATIS ONGKIR SE-INDONESIA min. belanja {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(current.storeConfig.freeShippingMinAmount)} | Gunakan kode: <strong>{current.storeConfig.activeVouchers[0]?.code}</strong>
        </span>
      </div>

      {/* Main Header (Clean White / Light Glass) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            
            {/* Dynamic Brand Logo & Tagline */}
            <div className="flex items-center gap-4">
              <a href="/" onClick={handleHomeClick} className="group flex flex-col">
                <span
                  className="font-serif text-2xl md:text-3xl font-bold tracking-wider group-hover:opacity-80 transition-opacity uppercase"
                  style={{ color: current.styles.primaryColor }}
                >
                  {current.storeConfig.storeName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold -mt-1 hidden sm:block">
                  {current.storeConfig.storeTagline}
                </span>
              </a>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a
                href="/"
                onClick={handleHomeClick}
                className="hover:text-slate-900 transition-colors py-1"
              >
                Beranda
              </a>
              <a href="/#katalog" className="hover:text-slate-900 transition-colors py-1">
                Katalog Produk
              </a>
              <a
                href="/#promo"
                className="hover:opacity-80 transition-opacity py-1 flex items-center gap-1 font-semibold"
                style={{ color: current.styles.primaryColor }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Voucher Diskon
              </a>
              <a href="/#keunggulan" className="hover:text-slate-900 transition-colors py-1">
                Tentang Brand
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                title="Masuk ke Panel Pengelola Toko"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
                <span>Panel Toko</span>
              </a>

              <a
                href={`https://wa.me/${current.storeConfig.whatsappNumber}?text=${encodeURIComponent(`Halo Admin ${current.storeConfig.storeName}, saya ingin bertanya.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors border border-emerald-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Chat CS</span>
              </a>

              <CartCounter />
            </div>

          </div>
        </div>
      </header>
    </>
  );
}
