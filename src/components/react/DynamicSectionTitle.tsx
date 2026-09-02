import React from 'react';
import { useStore } from '@nanostores/react';
import { $activeThemeId } from '../../utils/themeStore';
import { THEME_PRESETS } from '../../data/themes';

export default function DynamicSectionTitle() {
  const activeThemeId = useStore($activeThemeId);
  const current = THEME_PRESETS[activeThemeId] || THEME_PRESETS.fashion;

  const titles: Record<string, { subtitle: string; title: string; desc: string }> = {
    fashion: {
      subtitle: 'Katalog Lengkap',
      title: 'Koleksi Pakaian Esensial',
      desc: 'Semua produk bergaransi tukar ukuran 7 hari & bebas biaya admin marketplace.',
    },
    skincare: {
      subtitle: 'Dermatology Care',
      title: 'Koleksi Skincare & Perawatan Wajah',
      desc: 'Formulasi aktif BPOM & Halal MUI untuk merawat skin barrier dan mencerahkan kulit.',
    },
    streetwear: {
      subtitle: 'Division Drops',
      title: 'Koleksi Urban Streetwear',
      desc: 'Apparel heavyweight berpotongan boxy dengan grafis sablon high-density.',
    },
    coffee: {
      subtitle: 'Specialty Coffee',
      title: 'Koleksi Biji Kopi & Kopi Drip Bag',
      desc: 'Single origin pilihan dari petani Nusantara, di-roasting segar setiap minggu.',
    },
  };

  const item = titles[activeThemeId] || titles.fashion;

  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
        {item.subtitle}
      </span>
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
        {item.title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
        {item.desc}
      </p>
    </div>
  );
}
