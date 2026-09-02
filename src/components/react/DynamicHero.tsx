import React from 'react';
import { useStore } from '@nanostores/react';
import { $activeThemeId } from '../../utils/themeStore';
import { THEME_PRESETS } from '../../data/themes';
import { Sparkles, ArrowRight, Percent, Star, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';

export default function DynamicHero() {
  const activeThemeId = useStore($activeThemeId);
  const current = THEME_PRESETS[activeThemeId] || THEME_PRESETS.fashion;
  const config = current.storeConfig;
  const firstProduct = current.products[0];

  return (
    <>
      {/* 1. BRIGHT, AIRY & ELEGANT HERO SECTION */}
      <section
        className="relative overflow-hidden py-12 md:py-20 border-b border-slate-200/80 transition-all duration-500"
        style={{
          background: current.styles.heroGradient,
        }}
      >
        {/* Soft Ambient Blur Glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: current.styles.primaryColor }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs border transition-colors"
                style={{
                  backgroundColor: current.styles.badgeBg,
                  color: current.styles.badgeText,
                  borderColor: 'rgba(0,0,0,0.06)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{config.badgeText}</span>
              </div>

              {/* Main Headline */}
              <h1
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.18]"
                style={{ color: current.styles.textPrimary }}
              >
                {config.heroTitle}
              </h1>

              <p
                className="text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
                style={{ color: current.styles.textSecondary }}
              >
                {config.heroSubtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#katalog"
                  className="w-full sm:w-auto px-8 py-4 text-white text-xs sm:text-sm font-bold rounded-xl shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 group"
                  style={{
                    backgroundColor: current.styles.primaryColor,
                  }}
                >
                  <span>Lihat Katalog Lengkap</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#promo"
                  className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Percent className="w-4 h-4" style={{ color: current.styles.primaryColor }} />
                  <span>Kupon Diskon</span>
                </a>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    <img
                      className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-xs"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Avatar"
                    />
                    <img
                      className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-xs"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                      alt="Avatar"
                    />
                    <img
                      className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-xs"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                      alt="Avatar"
                    />
                  </div>
                  <span className="text-slate-800 font-bold ml-1">2.500+</span>
                  <span>Pesanan Terkirim</span>
                </div>

                <div className="flex items-center gap-1 text-slate-800 font-semibold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4.9 / 5.0 Rating Toko</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Original</span>
                </div>
              </div>

            </div>

            {/* Right Visual Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                
                {/* Lookbook Image */}
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-card border-4 border-white bg-slate-100 relative group">
                  <img
                    src={config.heroImage}
                    alt={config.storeName}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Floating Featured Product Pill */}
                  {firstProduct && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-100 text-xs shadow-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <span
                            className="text-[10px] uppercase font-bold tracking-wider block"
                            style={{ color: current.styles.primaryColor }}
                          >
                            Produk Terlaris
                          </span>
                          <p className="font-bold text-slate-900 text-sm line-clamp-1">
                            {firstProduct.name}
                          </p>
                        </div>
                        <span
                          className="font-bold text-sm shrink-0 ml-2"
                          style={{ color: current.styles.primaryColor }}
                        >
                          {formatRupiah(firstProduct.price)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Free Shipping Badge */}
                <div className="absolute -top-4 -left-4 bg-white text-slate-900 p-3 rounded-2xl shadow-float border border-slate-100 flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <p className="font-bold text-slate-900">Gratis Ongkir</p>
                    <p className="text-slate-500">Min. {formatRupiah(config.freeShippingMinAmount)}</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VOUCHER TICKER */}
      <section id="promo" className="bg-white border-b border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold shrink-0 shadow-xs"
                style={{ backgroundColor: current.styles.primaryColor }}
              >
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                  Voucher Diskon Spesial {config.storeName}
                </h3>
                <p className="text-xs text-slate-500">
                  Gunakan kode kupon di bawah ini saat proses checkout
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {config.activeVouchers.map((v) => (
                <div
                  key={v.code}
                  className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-xs"
                >
                  <div className="mr-2">
                    <span
                      className="font-mono font-bold block"
                      style={{ color: current.styles.primaryColor }}
                    >
                      {v.code}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{v.description}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
