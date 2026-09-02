import React from 'react';
import { useStore } from '@nanostores/react';
import { $activeThemeId } from '../../utils/themeStore';
import { THEME_PRESETS } from '../../data/themes';
import { Truck, ShieldCheck, RefreshCw, MessageCircle, Heart } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';

export default function DynamicFooter() {
  const activeThemeId = useStore($activeThemeId);
  const current = THEME_PRESETS[activeThemeId] || THEME_PRESETS.fashion;
  const config = current.storeConfig;

  return (
    <footer className="bg-slate-100/70 text-slate-700 pt-16 pb-12 mt-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Key Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-200 text-slate-700">
          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-xs"
              style={{ color: current.styles.primaryColor }}
            >
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900">Gratis Ongkir</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Min. belanja {formatRupiah(config.freeShippingMinAmount)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-xs"
              style={{ color: current.styles.primaryColor }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900">100% Original</h4>
              <p className="text-xs text-slate-500 mt-0.5">Kualitas terjamin resmi</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-xs"
              style={{ color: current.styles.primaryColor }}
            >
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900">Garansi Kepuasan</h4>
              <p className="text-xs text-slate-500 mt-0.5">Retur mudah dalam 7 hari</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-xs"
              style={{ color: current.styles.primaryColor }}
            >
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900">CS Fast Response</h4>
              <p className="text-xs text-slate-500 mt-0.5">{config.whatsappAdminName}</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12 border-b border-slate-200">
          
          <div className="md:col-span-5 space-y-4">
            <h3
              className="font-serif text-2xl font-bold uppercase tracking-wider"
              style={{ color: current.styles.primaryColor }}
            >
              {config.storeName}
            </h3>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              {config.storeSubtitle}
            </p>
            <div className="pt-2 text-xs text-slate-500 space-y-1.5">
              <p className="flex items-center gap-2">
                <span className="text-slate-700 font-medium">📍 Alamat Toko:</span> {config.address}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-700 font-medium">⏰ Jam Layanan:</span> {config.operationalHours}
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Koleksi Produk</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="/#katalog" className="hover:text-slate-900 transition-colors">Semua Produk</a></li>
              <li><a href="/#promo" className="hover:text-slate-900 transition-colors">Voucher Diskon</a></li>
              <li><a href="/#keunggulan" className="hover:text-slate-900 transition-colors">Keunggulan Brand</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">
                Metode Pembayaran Resmi
              </h4>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded shadow-xs">📱 QRIS</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-blue-600 rounded shadow-xs">BCA VA</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-amber-600 rounded shadow-xs">Mandiri</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-blue-500 rounded shadow-xs">BRI</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-emerald-600 rounded shadow-xs">COD</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">
                Ekspedisi Terpercaya
              </h4>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded shadow-xs">📦 JNE</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded shadow-xs">🔴 J&T Express</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded shadow-xs">💨 SiCepat</span>
                <span className="px-2.5 py-1 bg-white border border-slate-200 rounded shadow-xs">🛵 GoSend</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {config.storeName}. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Ditenagai oleh</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="font-medium text-slate-700">Astro.build White-Label Engine</span>
            <span>• Bebas Komisi Admin</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
